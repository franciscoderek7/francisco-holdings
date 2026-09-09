/*
 * DEF Property Maintenance — prototype
 * Demo-only form handling. Every form on this site is intercepted here:
 * we validate on the client, then show a success state in the DOM.
 * Nothing is sent over the network and nothing is written to storage —
 * there is no fetch/XHR call anywhere in this file, by design.
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

  function initDemoForm(form) {
    var fields = form.querySelectorAll("input, select, textarea");

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

      // Demo-only "submission": no network request, no storage write.
      // We simply flip visible DOM state to a success panel.
      form.classList.add("is-submitted");

      var successPanel = document.getElementById(form.dataset.successTarget || "");
      if (successPanel) {
        successPanel.classList.add("is-visible");
        successPanel.setAttribute("tabindex", "-1");
        successPanel.focus();

        // Advance the visual journey indicator, if this page has one.
        var journeyStep = successPanel.querySelector("[data-advance-step]");
        if (journeyStep) {
          markJourneyProgress(form);
        }
      }
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
        var successPanel = document.getElementById(form.dataset.successTarget || "");
        if (successPanel) {
          successPanel.classList.remove("is-visible");
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

  function init() {
    var forms = document.querySelectorAll("[data-demo-form]");
    forms.forEach(initDemoForm);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
