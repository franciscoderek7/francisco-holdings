/*
 * Lindsay Blinds prototype — lead-submission endpoint configuration.
 *
 * This points at the shared FH Lead API (see ../../lead-api/README.md in
 * this workspace) — a separate, standalone backend that is currently
 * BUILT — NOT CONFIGURED — NOT DEPLOYED. Nothing has been hosted anywhere
 * yet, so the endpoint below is still a clearly-marked placeholder.
 *
 * Until a real URL replaces the placeholder, every submission on this site
 * automatically falls back to the existing local "demo success" behavior —
 * see js/lead-submit.js. No visitor-facing behavior changes because of this
 * file by itself.
 */
window.LEAD_API_CONFIG = {
  endpoint: "https://REPLACE-WITH-DEPLOYED-LEAD-API-URL/api/lead", // placeholder — update once lead-api is deployed
  businessId: "lindsay-blinds",
};
