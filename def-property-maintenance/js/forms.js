/*
 * DEF Property Maintenance — form handling
 *
 * Client-side validation and success-state UI are unchanged from the
 * original prototype. What's new: the Request Service form and the plain
 * Contact form (the two forms carrying [data-lead-form]) now ATTEMPT a real
 * submission to the shared lead-api backend (../lead-api/) before falling
 * back to this prototype's original demo-only success state.
 *
 * Today that fallback is what actually runs on every submission, because
 * js/lead-submit-config.js still points at a placeholder URL — lead-api has
 * not been deployed anywhere yet. See the "LIVE (dormant)" / "FALLBACK
 * (currently active)" branches inside handleLeadSubmission() below.
 *
 * Every other form-ish widget on this site (the Security Assessment, the AI
 * Concierge) is untouched and remains fully local/simulated — this file
 * only ever looks at elements carrying [data-demo-form].
 */
(function () {
  "use strict";

  function showError(row, message) {
    row.classList.add("has-error");
    var errorEl = row.querySelector(".error-text");
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearError(row) {
    row.classList.remove("has-error");
  }

  function validateField(field) {
    var row = field.closest(".form-row");
    if (!row) {
      return true;
    }

    // Checkboxes (the required consent checkbox, plus the optional
    // existing-tech/desired-tech chip checkboxes) are validated on
    // checked state, not on .value — a checkbox's .value is a fixed
    // string regardless of whether it's checked.
    if (field.type === "checkbox") {
      if (field.hasAttribute("required") && !field.checked) {
        showError(row, row.dataset.errorRequired || "This field is required.");
        return false;
      }
      clearError(row);
      return true;
    }

    var value = field.value.trim();

    if (field.hasAttribute("required") && value === "") {
      showError(row, row.dataset.errorRequired || "This field is required.");
      return false;
    }

    if (field.type === "email" && value !== "") {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        showError(row, "Enter a valid email address.");
        return false;
      }
    }

    clearError(row);
    return true;
  }

  // ---------------------------------------------------------------------
  // Lead API wiring
  // ---------------------------------------------------------------------

  // The lead-api endpoint is still a placeholder until lead-api is deployed
  // and js/lead-submit-config.js is updated with a real URL. Checking for
  // that exact placeholder (rather than just "is it set") means this code
  // never attempts a fetch against a URL that is known in advance to be
  // fake.
  var PLACEHOLDER_MARKER = "REPLACE-WITH-DEPLOYED-LEAD-API-URL";

  function isRealEndpointConfigured() {
    return !!(
      window.LEAD_API_CONFIG &&
      typeof window.LEAD_API_CONFIG.endpoint === "string" &&
      window.LEAD_API_CONFIG.endpoint.indexOf(PLACEHOLDER_MARKER) === -1 &&
      /^https?:\/\//.test(window.LEAD_API_CONFIG.endpoint)
    );
  }

  function getBusinessId() {
    return (window.LEAD_API_CONFIG && window.LEAD_API_CONFIG.businessId) ||
      "def-property-maintenance";
  }

  function fieldValue(form, selector) {
    var el = form.querySelector(selector);
    return el ? el.value.trim() : "";
  }

  function selectedOptionText(form, selector) {
    var el = form.querySelector(selector);
    if (!el || el.selectedIndex < 0) {
      return "";
    }
    var option = el.options[el.selectedIndex];
    return option ? option.text.trim() : "";
  }

  // Returns the visible label text for every checked checkbox with the
  // given [name] inside form, e.g. ["Cameras", "Alarm system"].
  function checkedCheckboxLabels(form, name) {
    var labels = [];
    var checked = form.querySelectorAll('input[type="checkbox"][name="' + name + '"]:checked');
    checked.forEach(function (checkbox) {
      var label = checkbox.closest("label");
      labels.push(label ? label.textContent.trim() : checkbox.value);
    });
    return labels;
  }

  // Common fields + honeypot + timing, shared by every lead form.
  function baseLeadPayload(form, sourcePage) {
    return {
      business_id: getBusinessId(),
      source_page: sourcePage,
      website_url: fieldValue(form, 'input[name="website_url"]'), // honeypot
      form_rendered_at: Number(fieldValue(form, 'input[name="form_rendered_at"]')) || null,
      consent: !!form.querySelector('input[name="consent"]:checked'),
    };
  }

  // DEF's urgency enum ("not-urgent" / "soon" / "urgent") only describes
  // what the customer picked — it must never imply DEF offers faster or
  // emergency handling for "urgent", which this prototype does not offer.
  var URGENCY_MAP = {
    emergency: "urgent",
    soon: "soon",
    flexible: "not-urgent",
    exploring: "not-urgent",
  };

  function buildRequestServicePayload(form) {
    var payload = baseLeadPayload(form, "request-service.html");

    payload.name = fieldValue(form, "#full-name");
    payload.email = fieldValue(form, "#email");
    payload.phone = fieldValue(form, "#phone");

    var inquiryTypeLabel = selectedOptionText(form, "#service-type");
    var requestedServiceLabel = selectedOptionText(form, "#category");
    var propertyTypeLabel = selectedOptionText(form, "#property-type");
    var address = fieldValue(form, "#address");
    var urgencyRaw = fieldValue(form, "#urgency");
    var urgencyLabel = selectedOptionText(form, "#urgency");
    var existingTech = checkedCheckboxLabels(form, "existing-tech");
    var desiredTech = checkedCheckboxLabels(form, "desired-tech");
    var preferredDate = fieldValue(form, "#preferred-date");
    var notes = fieldValue(form, "#notes");

    payload.inquiry_type = inquiryTypeLabel; // broad service category
    payload.requested_service = requestedServiceLabel; // specific category
    payload.property_type = propertyTypeLabel;
    // No dedicated "service area" selector exists on this form yet — the
    // property address/location field is the closest match to DEF's
    // service_area field, so it's mapped there (and repeated in full below
    // in `message` for a complete, unambiguous record).
    payload.service_area = address;
    payload.urgency = URGENCY_MAP[urgencyRaw] || "not-urgent";
    // property_concern is capped at 200 chars server-side (sanitize.truncate
    // — never a hard rejection); the full, untruncated description always
    // also goes into `message` below.
    payload.property_concern = notes;
    payload.preferred_timing = preferredDate;

    var messageLines = [
      "Service type: " + (inquiryTypeLabel || "Not specified"),
      "Category: " + (requestedServiceLabel || "Not specified"),
      "Property type: " + (propertyTypeLabel || "Not specified"),
      "Property address / location: " + (address || "Not specified"),
      "Urgency selected by customer: " + (urgencyLabel || "Not specified") +
        " — DEF does not offer 24/7 or emergency response; this selection does not trigger expedited handling.",
      "Existing technology on property: " + (existingTech.length ? existingTech.join(", ") : "None specified"),
      "Technology customer wants to explore: " + (desiredTech.length ? desiredTech.join(", ") : "None specified"),
      "Preferred date: " + (preferredDate || "Not specified"),
      "",
      "Project description:",
      notes,
    ];
    payload.message = messageLines.join("\n");

    return payload;
  }

  function buildContactPayload(form) {
    var payload = baseLeadPayload(form, "contact.html");

    payload.name = fieldValue(form, "#contact-name");
    payload.email = fieldValue(form, "#contact-email");
    payload.message = fieldValue(form, "#contact-message");
    // This form only asks for name/email/message; it's a general inquiry
    // rather than a specific service request, so inquiry_type is a fixed,
    // honest label rather than something read off a field that doesn't exist.
    payload.inquiry_type = "general";

    return payload;
  }

  function buildLeadPayload(form) {
    var kind = form.dataset.leadForm;
    if (kind === "request-service") {
      return buildRequestServicePayload(form);
    }
    if (kind === "contact") {
      return buildContactPayload(form);
    }
    return null;
  }

  function setDemoSuccessCopy(successPanel) {
    if (!successPanel) return;
    var demoCopy = successPanel.querySelector("[data-demo-success-copy]");
    var liveCopy = successPanel.querySelector("[data-live-success-copy]");
    if (demoCopy) demoCopy.hidden = false;
    if (liveCopy) liveCopy.hidden = true;
  }

  function setLiveSuccessCopy(successPanel, serverMessage) {
    if (!successPanel) return;
    var demoCopy = successPanel.querySelector("[data-demo-success-copy]");
    var liveCopy = successPanel.querySelector("[data-live-success-copy]");
    var messageEl = successPanel.querySelector("[data-live-message]");
    if (messageEl) {
      messageEl.textContent = serverMessage ||
        "Thanks — your request has been received.";
    }
    if (demoCopy) demoCopy.hidden = true;
    if (liveCopy) liveCopy.hidden = false;
  }

  function finishSubmission(form, successPanel) {
    form.classList.add("is-submitted");
    if (successPanel) {
      successPanel.classList.add("is-visible");
      successPanel.setAttribute("tabindex", "-1");
      successPanel.focus();

      var journeyStep = successPanel.querySelector("[data-advance-step]");
      if (journeyStep) {
        markJourneyProgress(form);
      }
    }
  }

  function attemptRealSubmission(payload) {
    return fetch(window.LEAD_API_CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(function (response) {
      return response
        .json()
        .catch(function () {
          return {};
        })
        .then(function (data) {
          return { ok: response.ok, data: data };
        });
    });
  }

  function handleLeadSubmission(form, successPanel, payload) {
    if (isRealEndpointConfigured()) {
      // ---- LIVE branch (dormant until lead-api is deployed) ----
      // Once js/lead-submit-config.js points at a real, deployed lead-api
      // URL, this is the path that runs: a real POST, and on success the
      // server's own confirmation message is shown instead of demo copy.
      attemptRealSubmission(payload)
        .then(function (result) {
          if (result.ok) {
            setLiveSuccessCopy(successPanel, result.data && result.data.message);
          } else {
            // A real, configured endpoint responded but rejected the
            // submission (validation error, rate limit, etc.) — fall back
            // to the demo success state rather than surfacing a raw error,
            // per spec. (The payload is built to pass real validation —
            // see js/lead-submit-config.js / README — so this is an
            // unexpected-case safety net, not the normal path.)
            setDemoSuccessCopy(successPanel);
          }
          finishSubmission(form, successPanel);
        })
        .catch(function () {
          // Network error / endpoint unreachable: same graceful fallback.
          setDemoSuccessCopy(successPanel);
          finishSubmission(form, successPanel);
        });
      return;
    }

    // ---- FALLBACK branch (this is what actually runs right now) ----
    // window.LEAD_API_CONFIG.endpoint is still the placeholder string, so
    // no network request is attempted at all. This reproduces the
    // prototype's original demo-only behavior exactly.
    setDemoSuccessCopy(successPanel);
    finishSubmission(form, successPanel);
  }

  // Stamp form_rendered_at once, when the form is initialized (i.e. when
  // the page loads) — never at submit time. lead-api rejects submissions
  // made less than 3 seconds after this timestamp as likely bots.
  function stampFormRenderedAt(form) {
    var field = form.querySelector('input[name="form_rendered_at"]');
    if (field) {
      field.value = String(Date.now());
    }
  }

  function initDemoForm(form) {
    var fields = form.querySelectorAll("input, select, textarea");

    if (form.dataset.leadForm) {
      stampFormRenderedAt(form);
    }

    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var isValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) {
          firstError.focus();
        }
        return;
      }

      var successPanel = document.getElementById(form.dataset.successTarget || "");

      if (form.dataset.leadForm) {
        // Request Service / Contact: attempt a real lead-api submission,
        // with the original demo success state as a graceful fallback.
        var payload = buildLeadPayload(form);
        handleLeadSubmission(form, successPanel, payload);
        return;
      }

      // Any other [data-demo-form] (none exist today beyond the two
      // above, but kept for safety): unchanged original demo-only
      // "submission" — no network request, no storage write.
      finishSubmission(form, successPanel);
    });

    // Allow a "start over" control inside the success panel to reset the demo.
    var resetButtons = form.parentElement
      ? form.parentElement.querySelectorAll("[data-demo-reset]")
      : [];
    resetButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        form.reset();
        form.classList.remove("is-submitted");
        fields.forEach(function (field) {
          var row = field.closest(".form-row");
          if (row) {
            clearError(row);
          }
        });
        if (form.dataset.leadForm) {
          stampFormRenderedAt(form);
        }
        var successPanel = document.getElementById(form.dataset.successTarget || "");
        if (successPanel) {
          successPanel.classList.remove("is-visible");
          setDemoSuccessCopy(successPanel);
        }
        var previewGrid = form.querySelector("[data-photo-preview]");
        if (previewGrid) {
          previewGrid.innerHTML = "";
        }
        resetJourneyProgress();
        var firstField = form.querySelector("input, select, textarea");
        if (firstField) {
          firstField.focus();
        }
      });
    });
  }

  function markJourneyProgress(form) {
    // Submitting the demo intake form conceptually completes "Request
    // Service" and "Intake", and hands off to "Review" as the next stage.
    var steps = document.querySelectorAll(".journey-step");
    steps.forEach(function (step, index) {
      step.classList.remove("is-active", "is-done");
      if (index === 0 || index === 1) {
        step.classList.add("is-done");
      } else if (index === 2) {
        step.classList.add("is-active");
      }
    });
  }

  function resetJourneyProgress() {
    var steps = document.querySelectorAll(".journey-step");
    steps.forEach(function (step, index) {
      step.classList.remove("is-active", "is-done");
      if (index === 0) {
        step.classList.add("is-active");
      }
    });
  }

  // Hand-off from the Demo AI Concierge (js/concierge.js): if it linked here
  // with answers in the URL's query string, prefill the matching fields on
  // this page. This is same-site navigation only — nothing is fetched or
  // posted anywhere, and nothing is written to storage.
  function prefillFromConciergeHandoff() {
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      return;
    }
    if (!params || Array.from(params.keys()).length === 0) {
      return;
    }

    var fieldIds = ["full-name", "email", "phone", "address", "category", "notes"];
    var filledAny = false;
    fieldIds.forEach(function (id) {
      if (!params.has(id)) {
        return;
      }
      var field = document.getElementById(id);
      if (field) {
        field.value = params.get(id);
        filledAny = true;
      }
    });

    if (!filledAny) {
      return;
    }

    var formCard = document.querySelector(".form-card");
    if (formCard && formCard.parentNode) {
      var note = document.createElement("div");
      note.className = "notice notice-accent";
      note.style.marginBottom = "1.5rem";
      note.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" /></svg>' +
        '<p style="margin:0;">These details were carried over from the <strong>Demo AI Concierge</strong> ' +
        "conversation. Review and edit anything below before submitting — this is still a demo form and " +
        "nothing will be sent.</p>";
      formCard.parentNode.insertBefore(note, formCard);
    }
  }

  // Local-only photo preview for the Request Service form's optional photo
  // field. Uses FileReader to read the chosen files straight into <img
  // src="data:..."> thumbnails in the DOM — files are never appended to a
  // FormData, never fetched/XHR'd anywhere (including to lead-api), and
  // vanish on reload since nothing is written to storage. Matches the
  // "local preview only" pattern used elsewhere in this prototype's demo
  // forms.
  function initPhotoUpload(input) {
    var wrap = input.closest(".upload-drop") || document;
    var previewGrid = wrap.querySelector("[data-photo-preview]");
    if (!previewGrid) return;

    input.addEventListener("change", function () {
      previewGrid.innerHTML = "";
      var files = Array.prototype.slice.call(input.files || []).slice(0, 12);
      files.forEach(function (file) {
        if (!file.type || file.type.indexOf("image/") !== 0) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          var item = document.createElement("div");
          item.className = "upload-preview-item";
          var img = document.createElement("img");
          img.src = e.target.result;
          img.alt = "Local preview of " + file.name + " — not uploaded anywhere.";
          item.appendChild(img);
          previewGrid.appendChild(item);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  function init() {
    var forms = document.querySelectorAll("[data-demo-form]");
    forms.forEach(initDemoForm);
    prefillFromConciergeHandoff();

    var photoInputs = document.querySelectorAll("[data-photo-upload]");
    photoInputs.forEach(initPhotoUpload);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
