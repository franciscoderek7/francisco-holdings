/*
 * Northern Forge Windows, Blinds & Doors — prototype site
 * lead-submit-config.js: configuration for the shared FH Lead API backend
 * (see /home/user/francisco-holdings/lead-api/). This file intentionally
 * contains NO secrets — the lead-api backend never expects an API key or
 * credential from the browser; it is a plain JSON POST endpoint.
 *
 * STATUS: the lead-api backend is BUILT but NOT DEPLOYED anywhere yet, so
 * `endpoint` below is still the placeholder string. Until a real URL
 * replaces it, every form submission on this site falls back to the
 * existing local demo "success" behavior — see js/consultation.js and
 * js/contact.js for the fallback logic.
 *
 * To go live once lead-api is deployed (e.g. to Vercel):
 *   1. Deploy lead-api/ (see lead-api/README.md "Deployment").
 *   2. Replace the `endpoint` value below with the real deployed URL,
 *      e.g. "https://fh-lead-api.vercel.app/api/lead".
 *   3. Leave `businessId` exactly as "northern-forge" — it must match the
 *      key in lead-api/lib/businesses.js exactly (case-sensitive).
 */
window.LEAD_API_CONFIG = {
  endpoint: "https://REPLACE-WITH-DEPLOYED-LEAD-API-URL/api/lead", // placeholder — update once lead-api is deployed
  businessId: "northern-forge",
};
