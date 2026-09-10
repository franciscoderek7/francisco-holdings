/*
 * Lindsay Blinds prototype — demo-only contact form.
 * No network calls. Validates in the browser and swaps in a success
 * state for demonstration purposes only. Nothing is sent or stored.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var successBox = document.getElementById("contactSuccess");

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
      { id: "contactMessage", errorId: "contactMessageError", message: "Please enter a message." }
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
        var ok = value.trim().length > 0 && (!f.validate || f.validate(value));
        if (!ok) {
          valid = false;
          if (errorEl) errorEl.textContent = f.message;
        }
      });

      return valid;
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

      form.hidden = true;
      if (successBox) {
        successBox.hidden = false;
        successBox.setAttribute("tabindex", "-1");
        successBox.focus();
      }
    });
  });
})();
