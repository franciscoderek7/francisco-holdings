/*
 * Northforge Blinds — prototype site
 * contact.js: demo-only contact form.
 * IMPORTANT: This never sends data anywhere. No fetch/XHR. It only
 * validates in the browser and swaps in a success state, for
 * demonstration purposes.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var statusBox = document.getElementById("contact-status");
    var successPanel = document.getElementById("contact-success");
    var restartBtn = document.getElementById("contact-restart");

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

      return valid;
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
      form.hidden = true;
      successPanel.hidden = false;
      successPanel.setAttribute("tabindex", "-1");
      successPanel.focus();
    });

    if (restartBtn) {
      restartBtn.addEventListener("click", function () {
        form.reset();
        clearAllErrors();
        statusBox.hidden = true;
        successPanel.hidden = true;
        form.hidden = false;
        var firstField = form.querySelector("input, textarea");
        if (firstField) firstField.focus();
      });
    }
  });
})();
