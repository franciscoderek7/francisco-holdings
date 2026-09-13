/**
 * Local, file-based lead persistence for DEVELOPMENT/TESTING ONLY.
 *
 * This is NOT a production persistence mechanism. It exists so that,
 * without any external account or credential, someone can run
 * `node dev-server.js` locally and prove the full pipeline actually
 * works end to end: a real HTTP POST -> real server-side validation ->
 * a real durable record written to disk -> a real response -> and that
 * record readable back afterward, per-business, to verify isolation.
 *
 * Why this is dev-only, not how production should work:
 *   - It writes plain JSON Lines files under lead-api/.dev-data/, which
 *     is gitignored (see .gitignore) so real lead data can never end up
 *     committed to this public repository.
 *   - It has no access control, no encryption at rest, no retention
 *     policy, and no backup story -- all things real customer PII needs.
 *   - On a real serverless deployment (Vercel etc.) the filesystem is
 *     usually read-only/ephemeral outside of /tmp anyway, so this
 *     wouldn't durably persist there even if you tried.
 *
 * Production persistence remains a deliberate, separate decision -- see
 * lib/email.js's LEAD_STORE_WEBHOOK_URL (point it at a real
 * database/CRM once one exists) and README.md's "Persistence" section.
 * Until that's configured, production persistence is
 * CONFIGURATION REQUIRED, exactly as before -- this file does not
 * change that.
 */
"use strict";

var fs = require("fs");
var path = require("path");

var DEV_DATA_DIR = path.join(__dirname, "..", ".dev-data");

function isDevPersistenceEnabled() {
  // Opt-in and explicit, so a real deployment doesn't accidentally start
  // writing to a local disk nobody is looking at. Set LEAD_DEV_PERSIST=1
  // only when running dev-server.js locally for testing.
  return process.env.LEAD_DEV_PERSIST === "1";
}

function ensureDir() {
  if (!fs.existsSync(DEV_DATA_DIR)) {
    fs.mkdirSync(DEV_DATA_DIR, { recursive: true });
  }
}

function filePathFor(businessId) {
  // businessId is always validated against the hardcoded allow-list in
  // lib/businesses.js before this is ever called, so it's safe to use
  // directly in a filename -- but defense-in-depth: strip anything that
  // isn't alphanumeric/hyphen, matching the only shapes businessId can
  // actually take.
  var safe = String(businessId).replace(/[^a-z0-9-]/gi, "");
  return path.join(DEV_DATA_DIR, safe + ".jsonl");
}

/**
 * Appends one lead record as a line of JSON to that business's own file.
 * Never throws -- a dev-persistence failure should not be able to break
 * the actual request handling.
 * @returns {{persisted: boolean, file?: string, error?: string}}
 */
function appendLead(businessId, leadId, timestamp, lead) {
  if (!isDevPersistenceEnabled()) {
    return { persisted: false, reason: "dev persistence not enabled (LEAD_DEV_PERSIST!=1)" };
  }
  try {
    ensureDir();
    var file = filePathFor(businessId);
    var record = {
      lead_id: leadId,
      business_id: businessId,
      created_at: timestamp,
      lead: lead,
    };
    fs.appendFileSync(file, JSON.stringify(record) + "\n", "utf8");
    return { persisted: true, file: file };
  } catch (err) {
    return { persisted: false, error: err && err.message };
  }
}

/**
 * Reads back every record for one business. Test/inspection helper only
 * -- there is no HTTP route anywhere that exposes this; it's called
 * directly from test code and from a human running scripts locally.
 */
function readLeadsForBusiness(businessId) {
  var file = filePathFor(businessId);
  if (!fs.existsSync(file)) return [];
  var content = fs.readFileSync(file, "utf8");
  return content
    .split("\n")
    .filter(function (line) {
      return line.trim().length > 0;
    })
    .map(function (line) {
      return JSON.parse(line);
    });
}

module.exports = { isDevPersistenceEnabled, appendLead, readLeadsForBusiness, DEV_DATA_DIR };
