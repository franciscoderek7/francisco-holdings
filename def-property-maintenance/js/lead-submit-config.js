/*
 * DEF Property Maintenance — lead-capture wiring config
 *
 * This is the ONLY place the deployed lead-api URL needs to be updated once
 * lead-api (../lead-api/) is actually deployed somewhere. Everything else in
 * js/forms.js reads from this object.
 *
 * Status: BUILT — NOT CONFIGURED — NOT DEPLOYED. The endpoint below is a
 * placeholder string, not a real URL. Until it is replaced, js/forms.js
 * detects the placeholder and always falls back to this site's existing
 * demo success behavior — no network request is attempted against a fake
 * host.
 */
window.LEAD_API_CONFIG = {
  // Replace with the real deployed lead-api URL, e.g.
  // "https://lead-api-xyz.vercel.app/api/lead", once lead-api is deployed
  // and Dylan has authorized going live. Until then this exact placeholder
  // string is what js/forms.js checks for to decide whether to attempt a
  // real submission at all.
  endpoint: "https://REPLACE-WITH-DEPLOYED-LEAD-API-URL/api/lead",
  businessId: "def-property-maintenance",
};
