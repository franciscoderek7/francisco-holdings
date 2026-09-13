/*
 * Lindsay Blinds prototype — shared lead-submission helper.
 *
 * Used by js/consultation.js and js/contact.js so both forms build and
 * attempt-send their payload the same way instead of duplicating this
 * logic. Reads endpoint/business config from js/lead-submit-config.js
 * (window.LEAD_API_CONFIG), which must be loaded first.
 *
 * There are three possible outcomes, and only one of them is actually live
 * right now:
 *
 *   DEMO FALLBACK (LIVE TODAY): the configured endpoint is still the
 *   placeholder string from lead-submit-config.js. This is expected right
 *   now, because the shared lead-api backend (../../lead-api/) is BUILT
 *   but NOT DEPLOYED anywhere — there is no real URL to reach yet. In this
 *   branch we resolve with { ok:true, demo:true } and the caller shows the
 *   exact same "Prototype / Demo — nothing sent or stored" success state
 *   this site has always shown. No fetch call is ever made in this branch.
 *
 *   LIVE SUCCESS (DORMANT UNTIL DEPLOYED): once lead-submit-config.js is
 *   updated with a real, deployed lead-api URL, a successful 2xx response
 *   resolves with { ok:true, demo:false, message } carrying the real
 *   message the server returned, so the caller can show that instead of
 *   the demo copy.
 *
 *   LIVE FAILURE (DORMANT UNTIL DEPLOYED): once a real endpoint is
 *   configured, a non-2xx response, a network error, or an unreachable
 *   server resolves with { ok:false, demo:false, error } — NEVER falls
 *   back to the demo success state. A visitor must never be told their
 *   request was received when the real, configured backend actually
 *   failed to accept it. Callers must show an honest failure message and
 *   leave the form available to retry.
 *
 * The LIVE branches cannot run today because no real endpoint exists —
 * they are here so wiring one up later only means changing
 * lead-submit-config.js, not this file.
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

  // A REAL, configured endpoint that never responds must still resolve to
  // an honest failure rather than leave the visitor waiting forever.
  var REQUEST_TIMEOUT_MS = 15000;

  /**
   * @param {object} fields         Schema-shaped lead fields (name, email,
   *                                 phone, message, product_interest, ...) —
   *                                 NOT including business_id/website_url/
   *                                 form_rendered_at, which are added here.
   * @param {string} honeypotValue  Current value of the hidden `website_url`
   *                                 input (should be "" for a real visitor).
   * @param {number} formRenderedAt Date.now() captured when the form/page
   *                                 first loaded (NOT at submit time).
   * @returns {Promise<{ok:boolean, demo:boolean, message?:string, error?:string, payload:object}>}
   */
  window.submitLead = function submitLead(fields, honeypotValue, formRenderedAt) {
    var config = window.LEAD_API_CONFIG || {};
    var payload = Object.assign({}, fields, {
      business_id: config.businessId || "lindsay-blinds",
      website_url: honeypotValue || "",
      form_rendered_at: formRenderedAt,
    });

    if (isPlaceholderEndpoint(config.endpoint)) {
      // ---- DEMO FALLBACK branch — this is what actually runs today. ----
      return Promise.resolve({ ok: true, demo: true, payload: payload });
    }

    // ---- LIVE branches — dormant until lead-api is really deployed. ----
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timeoutId = controller
      ? window.setTimeout(function () {
          controller.abort();
        }, REQUEST_TIMEOUT_MS)
      : null;

    return fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined,
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return null;
          })
          .then(function (data) {
            if (!response.ok) {
              // A real, configured endpoint was reached and it rejected
              // this submission (validation error, rate limit, server
              // error, etc.). This is a genuine failure, not the
              // pre-deployment placeholder case — it must never be shown
              // to the visitor as success.
              return {
                ok: false,
                demo: false,
                error: (data && data.error) || "The request could not be submitted.",
                payload: payload,
              };
            }
            if (!data || data.ok !== true) {
              // A 2xx response that isn't the shape lead-api actually
              // returns (unparseable JSON, or missing/false "ok") is an
              // unexpected/malformed response — treated as a genuine
              // failure, never assumed to mean success.
              return {
                ok: false,
                demo: false,
                error: "Received an unexpected response from the server.",
                payload: payload,
              };
            }
            return {
              ok: true,
              demo: false,
              message: data.message,
              payload: payload,
            };
          });
      })
      .catch(function (err) {
        // Network error, unreachable server, CORS misconfiguration, an
        // aborted/timed-out request, etc. against a REAL configured
        // endpoint — a genuine failure, so it must be reported honestly
        // rather than shown as demo success.
        return {
          ok: false,
          demo: false,
          error:
            err && err.name === "AbortError"
              ? "The request timed out. Please try again, or contact us directly."
              : "Could not reach the server. Please try again, or contact us directly.",
          payload: payload,
        };
      })
      .then(function (result) {
        if (timeoutId) window.clearTimeout(timeoutId);
        return result;
      });
  };
})();
