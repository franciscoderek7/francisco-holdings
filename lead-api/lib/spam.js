/**
 * Lightweight, dependency-free spam heuristics. None of this is a real
 * substitute for a proper spam/abuse service -- it's the baseline a small
 * serverless function can do on its own. See README.md "Hardening" section
 * for the real recommendation (e.g. Upstash-backed rate limiting) once this
 * is actually deployed and gets real traffic.
 */
"use strict";

var MIN_FILL_TIME_MS = 3000; // reject forms submitted faster than this
var MAX_FILL_TIME_MS = 1000 * 60 * 60 * 2; // reject stale forms (2h+ old page)

/**
 * Honeypot: a hidden field real visitors never see or fill. If it has any
 * value, this is almost certainly a bot. Callers should still respond 200
 * (never tip off the bot) but skip validation, storage, and notification.
 */
function isHoneypotTripped(body) {
  return !!(body && typeof body.website_url === "string" && body.website_url.trim().length > 0);
}

/**
 * Timing check: the frontend sends `form_rendered_at` (ms epoch, set when
 * the form first rendered). A real human takes at least a few seconds to
 * fill a form; a submission faster than that is almost certainly scripted.
 */
function isTimingSuspicious(body) {
  var renderedAt = body && Number(body.form_rendered_at);
  if (!renderedAt || !isFinite(renderedAt)) return true; // missing = suspicious
  var elapsed = Date.now() - renderedAt;
  return elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_TIME_MS;
}

/**
 * Best-effort in-memory per-IP rate limit. Serverless functions may run as
 * multiple cold-started instances with no shared memory, so this only
 * catches abuse within a single warm instance -- it is NOT a real rate
 * limiter. Documented as a known limitation; see README.md.
 */
var recentSubmissionsByIp = new Map();
var RATE_LIMIT_WINDOW_MS = 60 * 1000;
var RATE_LIMIT_MAX_PER_WINDOW = 5;

function isRateLimited(ip) {
  if (!ip) return false;
  var now = Date.now();
  var history = (recentSubmissionsByIp.get(ip) || []).filter(function (t) {
    return now - t < RATE_LIMIT_WINDOW_MS;
  });
  history.push(now);
  recentSubmissionsByIp.set(ip, history);
  return history.length > RATE_LIMIT_MAX_PER_WINDOW;
}

/**
 * Best-effort duplicate-submission guard (e.g. a visitor double-clicking
 * "Submit"). Same caveat as the rate limiter: in-memory, single-instance
 * only, not a substitute for a real datastore-backed idempotency key.
 * Returns the PREVIOUS lead_id if this looks like an accidental repeat
 * within the window, so the caller can skip re-notifying while still
 * telling the visitor their request was received.
 */
var recentSubmissions = new Map(); // key -> { leadId, timestamp }
var DUPLICATE_WINDOW_MS = 30 * 1000;

function duplicateKey(businessId, email, message) {
  return businessId + "|" + (email || "").toLowerCase() + "|" + (message || "");
}

function checkAndRecordDuplicate(businessId, email, message, newLeadId) {
  var key = duplicateKey(businessId, email, message);
  var now = Date.now();
  var existing = recentSubmissions.get(key);

  if (existing && now - existing.timestamp < DUPLICATE_WINDOW_MS) {
    return { isDuplicate: true, leadId: existing.leadId };
  }

  recentSubmissions.set(key, { leadId: newLeadId, timestamp: now });
  return { isDuplicate: false, leadId: newLeadId };
}

module.exports = {
  isHoneypotTripped,
  isTimingSuspicious,
  isRateLimited,
  checkAndRecordDuplicate,
};
