/*
 * Lindsay Blinds prototype — shared lead-submission helper.
 *
 * Used by js/consultation.js and js/contact.js so both forms build and
 * attempt-send their payload the same way instead of duplicating this
 * logic. Reads endpoint/business config from js/lead-submit-config.js
 * (window.LEAD_API_CONFIG), which must be loaded first.
 *
 * There are exactly two branches, and only one of them is actually live
 * right now:
 *
 *   FALLBACK (LIVE TODAY): the configured endpoint is still the placeholder
 *   string from lead-submit-config.js, OR the fetch throws/network-errors/
 *   returns a non-2xx response. All of that is expected right now, because
 *   the shared lead-api backend (../../lead-api/) is BUILT but NOT
 *   DEPLOYED anywhere — there is no real URL to reach yet. In this branch
 *   we resolve with { ok:true, demo:true } and the caller shows the exact
 *   same "Prototype / Demo — nothing sent or stored" success state this
 *   site has always shown. Nothing is actually sent anywhere in this
 *   branch (the fetch call itself never even runs when the endpoint is
 *   still the placeholder).
 *
 *   LIVE (DORMANT UNTIL DEPLOYED): once lead-submit-config.js is updated
 *   with a real, deployed lead-api URL, a successful 2xx response resolves
 *   with { ok:true, demo:false, message } carrying the real message the
 *   server returned, so the caller can show that instead of the demo copy.
 *   This branch cannot run today because no real endpoint exists — it is
 *   here so wiring it up later only means changing lead-submit-config.js,
 *   not this file.
 */
(function () {
  "use strict";

  function isPlaceholderEndpoint(endpoint) {
    return (
      !endpoint ||
      typeof endpoint !== "string" ||
      endpoint.indexOf("REPLACE-WITH-DEPLOYED-LEAD-API-URL") !== -1
    );
  }

  /**
   * @param {object} fields         Schema-shaped lead fields (name, email,
   *                                 phone, message, product_interest, ...) —
   *                                 NOT including business_id/website_url/
   *                                 form_rendered_at, which are added here.
   * @param {string} honeypotValue  Current value of the hidden `website_url`
   *                                 input (should be "" for a real visitor).
   * @param {number} formRenderedAt Date.now() captured when the form/page
   *                                 first loaded (NOT at submit time).
   * @returns {Promise<{ok:boolean, demo:boolean, message?:string, payload:object}>}
   */
  window.submitLead = function submitLead(fields, honeypotValue, formRenderedAt) {
    var config = window.LEAD_API_CONFIG || {};
    var payload = Object.assign({}, fields, {
      business_id: config.businessId || "lindsay-blinds",
      website_url: honeypotValue || "",
      form_rendered_at: formRenderedAt,
    });

    if (isPlaceholderEndpoint(config.endpoint)) {
      // ---- FALLBACK branch — this is what actually runs today. ---------
      return Promise.resolve({ ok: true, demo: true, payload: payload });
    }

    // ---- LIVE branch — dormant until lead-api is really deployed. ------
    return fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Lead API responded with status " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        return {
          ok: true,
          demo: false,
          message: data && data.message,
          payload: payload,
        };
      })
      .catch(function () {
        // Network error, non-2xx, endpoint unreachable, CORS not yet
        // configured, etc. — all expected pre-deployment. Fall back to the
        // same demo success behavior rather than showing the visitor an
        // error for something they can't fix.
        return { ok: true, demo: true, payload: payload };
      });
  };
})();
