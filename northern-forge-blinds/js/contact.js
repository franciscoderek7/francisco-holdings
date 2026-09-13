/*
 * Northern Forge Windows, Blinds & Doors — prototype site
 * contact.js: the contact form.
 *
 * Client-side validation and the on-page confirmation UI behave exactly as
 * they always have in this prototype. What's new: on a valid submit, this
 * now ALSO attempts a real POST to the shared lead-api backend (see
 * /home/user/francisco-holdings/lead-api/), using the config in
 * js/lead-submit-config.js.
 *
 * Two branches, clearly separated below:
 *   - FALLBACK BRANCH (ACTIVE RIGHT NOW): lead-api is not deployed
 *     anywhere yet, so js/lead-submit-config.js still holds the
 *     placeholder endpoint URL. Every submission takes this branch and
 *     shows the exact same "Demo message sent" confirmation this
 *     prototype has always shown — nothing is actually sent anywhere.
 *   - LIVE BRANCH (DORMANT until lead-api is deployed and the config's
 *     `endpoint` is updated to a real URL): shows the real message the
 *     server returns instead of the demo copy.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var statusBox = document.getElementById("contact-status");
    var successPanel = document.getElementById("contact-success");
    var successHeading = document.getElementById("contact-success-heading");
    var successMessage = document.getElementById("contact-success-message");
    var restartBtn = document.getElementById("contact-restart");
    var renderedAtInput = document.getElementById("contact-form-rendered-at");

    // Record the real page-load time for the bot-timing check lead-api
    // performs server-side (spam.isTimingSuspicious in lead-api/lib/spam.js
    // rejects submissions sent less than 3 seconds after this timestamp).
    // Deliberately set here at load time, not read at submit time.
    if (renderedAtInput) renderedAtInput.value = String(Date.now());

    var DEMO_SUCCESS_HEADING = "Demo message “sent”";
    var DEMO_SUCCESS_MESSAGE = "This is a prototype confirmation only — no message was actually delivered anywhere.";

    function fieldValue(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }

    function setError(field, message) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.add("has-error");
      var errorEl = wrapper.querySelector(".field-error");
      if (errorEl) errorEl.textContent = message;
    }

    function clearAllErrors() {
      form.querySelectorAll(".has-error").forEach(function (el) {
        el.classList.remove("has-error");
      });
    }

    function validate() {
      var valid = true;
      clearAllErrors();

      ["contact-name", "contact-email", "contact-message"].forEach(function (id) {
        var field = document.getElementById(id);
        if (!field) return;
        if (!field.value || !field.value.trim()) {
          valid = false;
          setError(field, "This field is required.");
        }
      });

      var emailField = document.getElementById("contact-email");
      if (emailField && emailField.value.trim()) {
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
        if (!emailOk) {
          valid = false;
          setError(emailField, "Enter an email address in the form name@example.com.");
        }
      }

      // Consent must be checked before this becomes a real submission —
      // lead-api also requires `consent: true` server-side.
      var consentField = document.getElementById("contact-consent");
      if (consentField && !consentField.checked) {
        valid = false;
        setError(consentField, "Please check this box to continue.");
      }

      return valid;
    }

    // Map this form's fields onto the exact key names lead-api's
    // "northern-forge" schema expects (see lead-api/lib/schema.js). This
    // form only collects name/email/message, so most northern-forge-
    // specific fields (product_interest, room_or_property, etc.) are
    // simply omitted — every one of them is optional in the schema.
    function buildLeadPayload() {
      var honeypotEl = form.querySelector('input[name="website_url"]');

      return {
        business_id: (window.LEAD_API_CONFIG && window.LEAD_API_CONFIG.businessId) || "northern-forge",
        name: fieldValue("contact-name"),
        email: fieldValue("contact-email"),
        message: fieldValue("contact-message"),
        // Only an email address is collected on this form, so that's the
        // one confirmed way to reach this visitor back.
        preferred_contact_method: "email",
        source_page: "contact.html",
        inquiry_type: "Contact form message",
        consent: !!(document.getElementById("contact-consent") && document.getElementById("contact-consent").checked),
        // Spam-detection fields lead-api's lib/spam.js checks for:
        website_url: honeypotEl ? honeypotEl.value : "",
        form_rendered_at: renderedAtInput ? Number(renderedAtInput.value) : Date.now()
      };
    }

    // Attempts a real submission to the shared lead-api backend. Resolves
    // to { real: false } whenever nothing was actually sent (placeholder
    // endpoint still configured, network error, or a non-2xx response) —
    // callers should treat that exactly like today's demo-only behavior.
    // Resolves to { real: true, message } only on an actual 2xx response
    // from a deployed backend.
    function attemptLeadSubmission(payload) {
      var cfg = window.LEAD_API_CONFIG || {};
      var isPlaceholder = !cfg.endpoint || cfg.endpoint.indexOf("REPLACE-WITH-DEPLOYED-LEAD-API-URL") !== -1;
      if (isPlaceholder) {
        // FALLBACK BRANCH (ACTIVE): nothing is deployed yet, so don't even
        // attempt the network call.
        return Promise.resolve({ real: false });
      }
      // LIVE BRANCH (DORMANT until a real endpoint is configured):
      return fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (response) {
        if (!response.ok) return { real: false };
        return response.json().then(function (data) {
          return {
            real: true,
            message: (data && data.message) || "Your request has been received."
          };
        }).catch(function () {
          return { real: false };
        });
      }).catch(function () {
        // Network error / endpoint unreachable — fall back to demo copy.
        return { real: false };
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validate()) {
        statusBox.hidden = false;
        statusBox.className = "form-status form-status--error";
        statusBox.textContent = "Please fix the highlighted fields below — this is a demo form, nothing has been sent.";
        var firstError = form.querySelector(".has-error input, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      statusBox.hidden = true;

      var payload = buildLeadPayload();

      attemptLeadSubmission(payload).then(function (result) {
        if (result.real) {
          // LIVE BRANCH: show the real server message.
          if (successHeading) successHeading.textContent = "Message received";
          if (successMessage) successMessage.textContent = result.message;
        } else {
          // FALLBACK BRANCH (ACTIVE RIGHT NOW): identical to this
          // prototype's original, always-local demo behavior.
          if (successHeading) successHeading.textContent = DEMO_SUCCESS_HEADING;
          if (successMessage) successMessage.textContent = DEMO_SUCCESS_MESSAGE;
        }

        form.hidden = true;
        successPanel.hidden = false;
        successPanel.setAttribute("tabindex", "-1");
        successPanel.focus();
      });
    });

    if (restartBtn) {
      restartBtn.addEventListener("click", function () {
        form.reset();
        clearAllErrors();
        statusBox.hidden = true;
        successPanel.hidden = true;
        form.hidden = false;
        // A fresh "page load" for timing purposes, since the form is being
        // filled out again from scratch.
        if (renderedAtInput) renderedAtInput.value = String(Date.now());
        var firstField = form.querySelector("input, textarea");
        if (firstField) firstField.focus();
      });
    }
  });
})();
