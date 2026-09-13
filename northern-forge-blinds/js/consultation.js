/*
 * Northern Forge — prototype site
 * consultation.js: the standard consultation intake form.
 *
 * Client-side validation and the on-page confirmation UI behave exactly as
 * they always have in this prototype. What's new: on a valid submit, this
 * now ALSO attempts a real POST to the shared lead-api backend (see
 * /home/user/francisco-holdings/lead-api/), using the config in
 * js/lead-submit-config.js.
 *
 * Three outcomes, clearly separated below:
 *   - DEMO FALLBACK (ACTIVE RIGHT NOW): lead-api is not deployed
 *     anywhere yet, so js/lead-submit-config.js still holds the
 *     placeholder endpoint URL. Every submission takes this branch and
 *     shows the exact same "Demo submission received" confirmation this
 *     prototype has always shown — nothing is actually sent anywhere.
 *   - LIVE SUCCESS (DORMANT until lead-api is deployed and the config's
 *     `endpoint` is updated to a real URL): shows the real message the
 *     server returns instead of the demo copy.
 *   - LIVE FAILURE (DORMANT until deployed): once a real endpoint is
 *     configured, a non-2xx response or network error is a genuine
 *     failure and must NEVER be shown as success — the form stays
 *     visible and an honest failure message appears in the existing
 *     status box instead.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("consultation-form");
    if (!form) return;

    var statusBox = document.getElementById("consultation-status");
    var successPanel = document.getElementById("consultation-success");
    var successHeading = document.getElementById("consultation-success-heading");
    var successMessage = document.getElementById("consultation-success-message");
    var summaryList = document.getElementById("consultation-summary");
    var restartBtn = document.getElementById("consultation-restart");
    var renderedAtInput = document.getElementById("consultation-form-rendered-at");

    // Record the real page-load time for the bot-timing check lead-api
    // performs server-side (spam.isTimingSuspicious in lead-api/lib/spam.js
    // rejects submissions sent less than 3 seconds after this timestamp).
    // Deliberately set here at load time, not read at submit time.
    if (renderedAtInput) renderedAtInput.value = String(Date.now());

    var DEMO_SUCCESS_HEADING = "Demo submission received";
    var DEMO_SUCCESS_MESSAGE = "In a real version of this site, Northern Forge would follow up using the details below. Nothing has actually been sent — this is a prototype confirmation screen only.";

    function setError(field, message) {
      var wrapper = field.closest(".field") || field.closest("fieldset");
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

    function fieldValue(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }

    function validate() {
      var valid = true;
      clearAllErrors();

      // Product interest: at least one checkbox checked
      var categoryChecked = form.querySelector('input[name="category"]:checked');
      var categoryFieldset = document.getElementById("category-fieldset");
      if (!categoryChecked) {
        valid = false;
        categoryFieldset.classList.add("has-error");
        var catErr = categoryFieldset.querySelector(".field-error");
        if (catErr) catErr.textContent = "Choose at least one product interest to continue.";
      }

      // Required text fields
      ["name", "email", "room"].forEach(function (id) {
        var field = document.getElementById(id);
        if (!field) return;
        if (!field.value || !field.value.trim()) {
          valid = false;
          setError(field, "This field is required.");
        }
      });

      // Basic email shape check (demo only, not exhaustive)
      var emailField = document.getElementById("email");
      if (emailField && emailField.value.trim()) {
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
        if (!emailOk) {
          valid = false;
          setError(emailField, "Enter an email address in the form name@example.com.");
        }
      }

      // Consent must be checked before this becomes a real submission —
      // lead-api also requires `consent: true` server-side, but this
      // client-side check keeps the existing UX pattern (inline error,
      // focus management) consistent with every other required field here.
      var consentField = document.getElementById("consultation-consent");
      if (consentField && !consentField.checked) {
        valid = false;
        setError(consentField, "Please check this box to continue.");
      }

      return valid;
    }

    function buildSummary(data) {
      summaryList.innerHTML = "";
      data.forEach(function (row) {
        var dt = document.createElement("dt");
        dt.textContent = row[0];
        var dd = document.createElement("dd");
        dd.textContent = row[1] || "—";
        summaryList.appendChild(dt);
        summaryList.appendChild(dd);
      });
    }

    // Map this form's fields onto the exact key names lead-api's
    // "northern-forge" schema expects (see lead-api/lib/schema.js).
    // Fields with no clean schema equivalent (property type, project type,
    // window/door requirements, budget) are folded into `message`, each on
    // its own labeled line, so nothing the visitor entered is lost.
    function buildLeadPayload() {
      var categories = Array.prototype.map.call(
        form.querySelectorAll('input[name="category"]:checked'),
        function (el) { return el.value; }
      ).join(", ");

      var propertyType = fieldValue("property-type");
      var projectType = fieldValue("project-type");
      var windowDoorReqs = fieldValue("window-door-reqs");
      var budget = fieldValue("budget");
      var notes = fieldValue("notes");

      var messageLines = [];
      if (propertyType) messageLines.push("Property type: " + propertyType);
      if (projectType) messageLines.push("Project type: " + projectType);
      if (windowDoorReqs) messageLines.push("Window/door requirements: " + windowDoorReqs);
      if (budget) messageLines.push("Budget (placeholder range): " + budget);
      if (notes) messageLines.push("Additional notes: " + notes);

      var phone = fieldValue("phone");
      var email = fieldValue("email");
      // No explicit "how should we reach you" field exists on this form —
      // infer a reasonable default from which contact fields were filled
      // in, rather than leaving it unset.
      var preferredContact = "email";
      if (phone && email) preferredContact = "either";
      else if (phone) preferredContact = "phone";

      var installPref = fieldValue("install-pref");
      var installationInterest; // left undefined ("not sure yet"/blank) on purpose
      if (installPref === "Professional installation") installationInterest = true;
      else if (installPref === "DIY / self-install") installationInterest = false;

      // The standard form never asks manual-vs-motorized directly (that's
      // only asked inside the Concierge demo, which doesn't submit on its
      // own). The one place this form implies it: choosing "Motorization"
      // as a product interest. Anything else is left unset rather than
      // guessed, since `operation` is optional in the schema.
      var operation;
      if (categories.indexOf("Motorization") !== -1) operation = "motorized";

      var honeypotEl = form.querySelector('input[name="website_url"]');

      return {
        business_id: (window.LEAD_API_CONFIG && window.LEAD_API_CONFIG.businessId) || "northern-forge",
        name: fieldValue("name"),
        email: email,
        phone: phone,
        message: messageLines.join("\n"),
        preferred_contact_method: preferredContact,
        preferred_timing: fieldValue("timeline"),
        source_page: "consultation.html",
        inquiry_type: "Consultation request",
        consent: !!(document.getElementById("consultation-consent") && document.getElementById("consultation-consent").checked),
        product_interest: categories,
        room_or_property: fieldValue("room"),
        privacy_preference: fieldValue("privacy"),
        light_control: fieldValue("light"),
        style: fieldValue("style"),
        operation: operation,
        installation_interest: installationInterest,
        // Spam-detection fields lead-api's lib/spam.js checks for:
        website_url: honeypotEl ? honeypotEl.value : "",
        form_rendered_at: renderedAtInput ? Number(renderedAtInput.value) : Date.now()
      };
    }

    // A REAL, configured endpoint that never responds must still resolve
    // to an honest failure rather than leave the visitor waiting forever.
    var LEAD_REQUEST_TIMEOUT_MS = 15000;

    // Attempts a real submission to the shared lead-api backend.
    //   { real: false }                 -- placeholder endpoint still
    //                                      configured; treat exactly like
    //                                      today's demo-only behavior.
    //   { real: true, message }         -- an actual 2xx response from a
    //                                      deployed backend, in the shape
    //                                      lead-api actually returns.
    //   { real: false, failed: true, error } -- a REAL, configured
    //                                      endpoint was reached but
    //                                      genuinely failed (non-2xx,
    //                                      network error, timeout, or a
    //                                      malformed/unexpected response
    //                                      body). This must never be
    //                                      shown as demo success.
    function attemptLeadSubmission(payload) {
      var cfg = window.LEAD_API_CONFIG || {};
      var isPlaceholder = !cfg.endpoint || cfg.endpoint.indexOf("REPLACE-WITH-DEPLOYED-LEAD-API-URL") !== -1;
      if (isPlaceholder) {
        // DEMO FALLBACK (ACTIVE): nothing is deployed yet, so don't even
        // attempt the network call.
        return Promise.resolve({ real: false });
      }
      // LIVE BRANCHES (DORMANT until a real endpoint is configured):
      var controller = typeof AbortController === "function" ? new AbortController() : null;
      var timeoutId = controller
        ? window.setTimeout(function () { controller.abort(); }, LEAD_REQUEST_TIMEOUT_MS)
        : null;

      return fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      }).then(function (response) {
        return response.json().catch(function () { return null; }).then(function (data) {
          if (!response.ok) {
            return { real: false, failed: true, error: (data && data.error) || "The request could not be submitted." };
          }
          if (!data || data.ok !== true) {
            // 2xx but not the shape lead-api actually returns -- an
            // unexpected/malformed response, never assumed to be success.
            return { real: false, failed: true, error: "Received an unexpected response from the server." };
          }
          return {
            real: true,
            message: data.message || "Your request has been received."
          };
        });
      }).catch(function (err) {
        // Network error / endpoint unreachable / timed out against a REAL
        // configured endpoint — a genuine failure, reported honestly.
        return {
          real: false,
          failed: true,
          error: err && err.name === "AbortError"
            ? "The request timed out. Please try again, or contact us directly."
            : "Could not reach the server. Please try again, or contact us directly."
        };
      }).then(function (result) {
        if (timeoutId) window.clearTimeout(timeoutId);
        return result;
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validate()) {
        statusBox.hidden = false;
        statusBox.className = "form-status form-status--error";
        statusBox.textContent = "Please fix the highlighted fields below — this is a demo form, nothing has been sent.";
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea, .has-error");
        if (firstError) {
          var focusable = firstError.matches("input,select,textarea") ? firstError : firstError.querySelector("input,select,textarea");
          if (focusable) focusable.focus();
        }
        return;
      }

      statusBox.hidden = true;

      var categories = Array.prototype.map.call(
        form.querySelectorAll('input[name="category"]:checked'),
        function (el) { return el.value; }
      ).join(", ");

      var data = [
        ["Product interest", categories],
        ["Property type", fieldValue("property-type")],
        ["Project type", fieldValue("project-type")],
        ["Room / location", fieldValue("room")],
        ["Window / door requirements", fieldValue("window-door-reqs")],
        ["Privacy requirements", fieldValue("privacy")],
        ["Light requirements", fieldValue("light")],
        ["Style", fieldValue("style")],
        ["Budget (placeholder ranges)", fieldValue("budget")],
        ["Installation preference", fieldValue("install-pref")],
        ["Timeline", fieldValue("timeline")],
        ["Additional notes", fieldValue("notes")],
        ["Name", fieldValue("name")],
        ["Phone", fieldValue("phone")],
        ["Email", fieldValue("email")]
      ];
      buildSummary(data);

      var payload = buildLeadPayload();

      attemptLeadSubmission(payload).then(function (result) {
        if (result.failed) {
          // LIVE FAILURE: a real, configured lead-api endpoint was
          // reached but genuinely failed. Never show the success screen
          // for this — keep the form visible so the visitor can retry.
          statusBox.hidden = false;
          statusBox.className = "form-status form-status--error";
          statusBox.textContent =
            result.error || "Your request could not be submitted. Please try again, or contact us directly.";
          statusBox.setAttribute("tabindex", "-1");
          statusBox.focus();
          return;
        }

        if (result.real) {
          // LIVE SUCCESS: show the real server message.
          if (successHeading) successHeading.textContent = "Request received";
          if (successMessage) successMessage.textContent = result.message;
        } else {
          // DEMO FALLBACK (ACTIVE RIGHT NOW): identical to this
          // prototype's original, always-local demo behavior.
          if (successHeading) successHeading.textContent = DEMO_SUCCESS_HEADING;
          if (successMessage) successMessage.textContent = DEMO_SUCCESS_MESSAGE;
        }

        statusBox.hidden = true;
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
        var firstField = form.querySelector("input, select, textarea");
        if (firstField) firstField.focus();
      });
    }
  });
})();
