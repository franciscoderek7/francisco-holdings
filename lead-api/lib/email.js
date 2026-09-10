/**
 * Email notification adapter. Default provider is Resend (resend.com) --
 * simple API, generous free tier, no SDK dependency needed (plain fetch).
 * Swapping providers means rewriting sendViaResend() only; everything else
 * in this file is provider-agnostic.
 *
 * SECURITY: the API key is read from process.env.RESEND_API_KEY only. It
 * is never hardcoded, never logged, and never present in any frontend file
 * in any of the three site directories -- this function only runs
 * server-side.
 *
 * Requires Node 18+ (global fetch). See package.json "engines".
 */
"use strict";

var sanitize = require("./sanitize.js");

function formatLeadAsPlainText(business, lead, leadId, timestamp) {
  var lines = [
    "New lead: " + business.label,
    "Lead ID: " + leadId,
    "Received: " + timestamp,
    "",
  ];
  Object.keys(lead).forEach(function (key) {
    if (key === "consent") return; // covered by the notice line below
    var value = lead[key];
    if (value === "" || value === undefined || value === null) return;
    lines.push(key + ": " + value);
  });
  lines.push("");
  lines.push(
    lead.consent
      ? "Consent: visitor confirmed this submission is used to respond to their inquiry."
      : "Consent: NOT confirmed -- do not act on this submission until reviewed."
  );
  return lines.join("\n");
}

/**
 * @returns {Promise<{sent: boolean, error?: string}>}
 */
async function sendViaResend(toEmail, subject, textBody) {
  var apiKey = process.env.RESEND_API_KEY;
  var fromAddress = process.env.LEAD_NOTIFY_FROM_EMAIL;

  if (!apiKey || !fromAddress) {
    return {
      sent: false,
      error:
        "RESEND_API_KEY and/or LEAD_NOTIFY_FROM_EMAIL are not configured. " +
        "See lead-api/README.md — ACCESS/CONFIGURATION REQUIRED.",
    };
  }

  try {
    var response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toEmail],
        subject: subject,
        text: textBody,
      }),
    });

    if (!response.ok) {
      var errText = await response.text().catch(function () {
        return "";
      });
      return { sent: false, error: "Resend API error " + response.status + ": " + errText };
    }

    return { sent: true };
  } catch (err) {
    return { sent: false, error: "Resend request failed: " + (err && err.message) };
  }
}

/**
 * Sends the notification (and, if a separate archive address is
 * configured for this business, a copy there too). Never throws -- callers
 * get a result object either way, because a notification failure must
 * never be reported to the visitor as a submission failure once the lead
 * itself was accepted.
 */
async function sendLeadNotification(business, lead, leadId, timestamp) {
  var notifyEmail = process.env[business.notifyEnvVar];
  if (!notifyEmail) {
    return {
      sent: false,
      error:
        business.notifyEnvVar +
        " is not configured -- ACCESS/CONFIGURATION REQUIRED. The lead was accepted but no notification could be sent.",
    };
  }

  var subject =
    "New " + business.label + " lead: " + sanitize.truncate(lead.name || "(no name)", 80);
  var body = formatLeadAsPlainText(business, lead, leadId, timestamp);

  var primary = await sendViaResend(notifyEmail, subject, body);

  var archiveEmail = process.env[business.archiveEnvVar];
  if (archiveEmail && primary.sent) {
    // Best-effort; archive failures don't change the overall result.
    await sendViaResend(archiveEmail, "[Archive] " + subject, body);
  }

  return primary;
}

/**
 * Optional pluggable persistence: if LEAD_STORE_WEBHOOK_URL is set, POST
 * the lead there too (e.g. a Zapier/Make webhook feeding a spreadsheet or
 * real database). This is deliberately NOT a hardcoded database choice --
 * see README.md "Persistence" for why.
 */
async function persistLead(business, lead, leadId, timestamp) {
  var webhookUrl = process.env.LEAD_STORE_WEBHOOK_URL;
  if (!webhookUrl) {
    return { persisted: false, method: "email-only" };
  }
  try {
    var response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_id: leadId,
        business_id: business.id,
        timestamp: timestamp,
        lead: lead,
      }),
    });
    return { persisted: response.ok, method: "webhook", status: response.status };
  } catch (err) {
    return { persisted: false, method: "webhook", error: err && err.message };
  }
}

module.exports = { sendLeadNotification, persistLead, formatLeadAsPlainText };
