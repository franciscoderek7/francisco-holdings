/*
 * Northern Forge — prototype site
 * consultation.js: demo-only consultation form.
 * IMPORTANT: This never sends data anywhere. No fetch/XHR. It only
 * validates in the browser and swaps in a success state, for
 * demonstration purposes. Nothing is stored, even locally.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("consultation-form");
    if (!form) return;

    var statusBox = document.getElementById("consultation-status");
    var successPanel = document.getElementById("consultation-success");
    var summaryList = document.getElementById("consultation-summary");
    var restartBtn = document.getElementById("consultation-restart");

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
        var firstField = form.querySelector("input, select, textarea");
        if (firstField) firstField.focus();
      });
    }
  });
})();
