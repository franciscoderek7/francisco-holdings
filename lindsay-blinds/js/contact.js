/*
 * Lindsay Blinds prototype — contact form.
 *
 * Client-side validation and UX are unchanged. On submit, this now
 * ATTEMPTS a real submission to the shared lead-api backend via
 * window.submitLead() (see js/lead-submit.js + js/lead-submit-config.js).
 * Since that backend is not deployed anywhere yet, this always falls back
 * to the same local "demo success" behavior that has always been here —
 * see the submit handler below for exactly where that fallback happens.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var successBox = document.getElementById("contactSuccess");
    var submitBtn = form.querySelector('button[type="submit"]');

    // Lead-api timing field: MUST be set on page/form load, not at submit
    // time — the backend rejects submissions filled in under 3s as likely
    // bots (see ../lead-api/lib/spam.js isTimingSuspicious).
    var renderedAtField = document.getElementById("contactFormRenderedAt");
    if (renderedAtField) renderedAtField.value = String(Date.now());

    var fields = [
      { id: "contactName", errorId: "contactNameError", message: "Please enter your name." },
      {
        id: "contactEmail",
        errorId: "contactEmailError",
        message: "Please enter a valid email address.",
        validate: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
        }
      },
      { id: "contactMessage", errorId: "contactMessageError", message: "Please enter a message." },
      {
        id: "contactConsent",
        errorId: "contactConsentError",
        message: "Please confirm you agree before sending.",
        isCheckbox: true,
        validate: function (value, input) {
          return !!(input && input.checked);
        }
      }
    ];

    function clearErrors() {
      fields.forEach(function (f) {
        var errorEl = document.getElementById(f.errorId);
        if (errorEl) errorEl.textContent = "";
      });
    }

    function validate() {
      var valid = true;
      clearErrors();

      fields.forEach(function (f) {
        var input = document.getElementById(f.id);
        var errorEl = document.getElementById(f.errorId);
        if (!input) return;
        var value = input.value || "";
        var ok = f.isCheckbox
          ? f.validate(value, input)
          : value.trim().length > 0 && (!f.validate || f.validate(value));
        if (!ok) {
          valid = false;
          if (errorEl) errorEl.textContent = f.message;
        }
      });

      return valid;
    }

    /* ---------------------------------------------------------------
     * Build the JSON payload for the shared lead-api backend, mapping
     * this simple form onto the common fields defined in
     * ../lead-api/lib/schema.js (no Lindsay-specific fields apply to
     * the plain contact form — those are only collected by the
     * consultation wizard).
     * ------------------------------------------------------------- */
    function buildLeadPayload() {
      return {
        name: (document.getElementById("contactName").value || "").trim(),
        email: (document.getElementById("contactEmail").value || "").trim(),
        phone: (document.getElementById("contactPhone").value || "").trim(),
        message: (document.getElementById("contactMessage").value || "").trim(),
        source_page: "contact.html",
        inquiry_type: "contact_form",
        consent: !!document.getElementById("contactConsent").checked
      };
    }

    function showSuccess(result) {
      form.hidden = true;
      if (!successBox) return;

      if (result && result.demo === false) {
        // LIVE branch: lead-api actually accepted this submission (only
        // possible once lead-submit-config.js points at a real deployed
        // endpoint) — show the real server message instead of the demo
        // copy, which would otherwise be inaccurate.
        successBox.textContent =
          result.message || "Your message has been received. Marc will follow up with you soon.";
      }

      successBox.hidden = false;
      successBox.setAttribute("tabindex", "-1");
      successBox.focus();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validate()) {
        var firstError = form.querySelector(".field-error:not(:empty)");
        if (firstError) {
          var relatedInput = form.querySelector("#" + firstError.id.replace("Error", ""));
          if (relatedInput) relatedInput.focus();
        }
        return;
      }

      var honeypotField = document.getElementById("contactWebsiteUrl");
      var formRenderedAt = renderedAtField ? Number(renderedAtField.value) : Date.now();
      var honeypotValue = honeypotField ? honeypotField.value : "";
      var payload = buildLeadPayload();

      if (submitBtn) submitBtn.disabled = true;

      // Attempts a real POST to the lead-api backend when window.submitLead
      // is available (js/lead-submit.js); always resolves (never rejects),
      // falling back to the exact same demo success state below when the
      // endpoint is still a placeholder or the request fails — which is
      // the ONLY thing that can happen right now, since lead-api is BUILT
      // but NOT DEPLOYED. See js/lead-submit.js for the full branch logic.
      var submitPromise =
        typeof window.submitLead === "function"
          ? window.submitLead(payload, honeypotValue, formRenderedAt)
          : Promise.resolve({ ok: true, demo: true, payload: payload });

      submitPromise
        .then(function (result) {
          showSuccess(result);
        })
        .catch(function () {
          // Defensive only — window.submitLead is designed to never reject.
          showSuccess({ demo: true });
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });
})();
