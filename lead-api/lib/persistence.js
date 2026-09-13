/**
 * Persistence adapter -- the single place api/lead.js calls to persist a
 * validated lead, so it never needs to know which underlying storage
 * provider is actually active.
 *
 *   validateLead() -> (this file) persist() -> dev file store
 *                                            -> production provider
 *
 * Today there are two providers, both best-effort (a persistence failure
 * never changes the visitor-facing result once validation has passed):
 *
 *   - DEV: lib/devStore.js -- local, gitignored JSONL files, opt-in via
 *     LEAD_DEV_PERSIST=1. See that file's header for why this can never
 *     become the implicit production database.
 *   - PRODUCTION: lib/email.js's persistLead() -- an optional
 *     LEAD_STORE_WEBHOOK_URL, unconfigured today (CONFIGURATION REQUIRED).
 *
 * Swapping in a real production database/CRM later means adding a new
 * provider call here (or replacing the production branch outright) --
 * api/lead.js and the validation layer stay untouched either way.
 */
"use strict";

var devStore = require("./devStore.js");
var email = require("./email.js");

/**
 * @returns {Promise<{dev_persisted: boolean, persisted: boolean, persist_method: string}>}
 */
async function persist(business, lead, leadId, timestamp) {
  var devResult = devStore.appendLead(business.id, leadId, timestamp, lead);
  var prodResult = await email.persistLead(business, lead, leadId, timestamp);

  return {
    dev_persisted: devResult.persisted,
    persisted: prodResult.persisted,
    persist_method: prodResult.method,
  };
}

module.exports = { persist: persist };
