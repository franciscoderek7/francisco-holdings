/**
 * POST /api/lead
 *
 * Single shared endpoint for all three businesses' lead forms. Isolation
 * is enforced by business_id: it must be one of the hardcoded IDs in
 * lib/businesses.js, and every downstream step (schema, notification
 * recipient, archive recipient, allowed origin) is looked up from THAT
 * business's own config only. There is no code path in this file, or
 * anywhere in this project, that reads or returns another business's
 * stored leads -- this endpoint only ever accepts a new submission and
 * responds with success/failure. No GET, no list, no admin view.
 *
 * Vercel serverless function convention (module.exports = handler).
 * Portable to Netlify Functions / Cloudflare Workers with light adaptation
 * -- see README.md.
 */
"use strict";

var crypto = require("crypto");
var businesses = require("../lib/businesses.js");
var schemas = require("../lib/schema.js");
var validate = require("../lib/validate.js");
var spam = require("../lib/spam.js");
var email = require("../lib/email.js");

var STATUS_NEW = "NEW";

function setCorsHeaders(res, allowedOrigin) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

function getClientIp(req) {
  var forwarded = req.headers && req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return (req.socket && req.socket.remoteAddress) || "";
}

module.exports = async function handler(req, res) {
  // Resolve the business as early as possible so CORS can reflect its
  // configured allowed origin (falls back to "*" if unset -- tighten this
  // once the real deployed site origins are known; see README.md).
  var businessIdForCors =
    req.body && typeof req.body === "object" ? req.body.business_id : undefined;
  var businessForCors = businessIdForCors ? businesses.getBusiness(businessIdForCors) : null;
  var allowedOrigin = businessForCors
    ? process.env[businessForCors.allowedOriginEnvVar] || "*"
    : "*";
  setCorsHeaders(res, allowedOrigin);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed." });
    return;
  }

  var body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      res.status(400).json({ ok: false, error: "Invalid JSON body." });
      return;
    }
  }
  if (!body || typeof body !== "object") {
    res.status(400).json({ ok: false, error: "Request body must be JSON." });
    return;
  }

  var business = businesses.getBusiness(body.business_id);
  if (!business) {
    // Deliberately vague -- do not reveal the valid business_id list to
    // an unknown caller.
    res.status(400).json({ ok: false, error: "Unknown or missing business_id." });
    return;
  }
  business.id = body.business_id;

  // --- Spam checks: respond 200 without processing, never tip off bots ---
  if (spam.isHoneypotTripped(body)) {
    res.status(200).json({ ok: true, message: "Received." });
    return;
  }

  var ip = getClientIp(req);
  if (spam.isRateLimited(ip)) {
    res.status(429).json({ ok: false, error: "Too many submissions. Please try again shortly." });
    return;
  }

  if (spam.isTimingSuspicious(body)) {
    // Likely a bot (or a stale/replayed form). Respond generically rather
    // than explaining exactly why, which would help an attacker calibrate.
    res.status(200).json({ ok: true, message: "Received." });
    return;
  }

  // --- Schema validation (server-side source of truth) ---
  var schema = schemas.getSchema(body.business_id);
  var result = validate.validateLead(schema, body);
  if (!result.ok) {
    res.status(400).json({ ok: false, error: "Validation failed.", details: result.errors });
    return;
  }

  var leadId = crypto.randomUUID();
  var timestamp = new Date().toISOString();
  var lead = result.clean;
  lead.status = STATUS_NEW;

  var dup = spam.checkAndRecordDuplicate(body.business_id, lead.email, lead.message, leadId);
  if (dup.isDuplicate) {
    // Same visitor, same business, same content, within the window --
    // almost certainly a double-click. Acknowledge without re-notifying.
    res.status(200).json({
      ok: true,
      lead_id: dup.leadId,
      message: "Your request has been received. A member of the team will review it and follow up.",
      _debug: { duplicate_of_recent_submission: true },
    });
    return;
  }

  // --- Notification + persistence. Both are best-effort: once validation
  // passes, the visitor gets a success response either way (a notification
  // outage is an operational problem for the business to fix, not
  // something the visitor should see as "your submission failed"). Both
  // outcomes are still reported in the response for debugging/ops.
  var notifyResult = await email.sendLeadNotification(business, lead, leadId, timestamp);
  var persistResult = await email.persistLead(business, lead, leadId, timestamp);

  if (!notifyResult.sent) {
    // Server-side log only -- never exposed to the client in detail.
    console.error("[lead-api] notification not sent:", notifyResult.error);
  }

  res.status(200).json({
    ok: true,
    lead_id: leadId,
    message: "Your request has been received. A member of the team will review it and follow up.",
    // Included only to make deployment debugging honest -- remove or gate
    // behind an internal-only flag once this is confirmed working end to
    // end in production.
    _debug: {
      notification_sent: notifyResult.sent,
      persisted: persistResult.persisted,
      persist_method: persistResult.method,
    },
  });
};
