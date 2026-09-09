/*
 * Lindsay Blinds prototype — consultation wizard + mock AI assistant.
 *
 * Everything here is client-side only:
 *  - No fetch/XHR/WebSocket calls.
 *  - The "AI assistant" is a scripted, canned chat flow — not a live model.
 *  - The multi-step form only shows/hides DOM state; "submit" never sends
 *    or stores data anywhere.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
   * Step 1 pre-selection via ?need=... query param (used by
   * products.html deep links, e.g. consultation.html?need=blinds)
   * ------------------------------------------------------------- */
  function preselectFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var need = params.get("need");
    if (!need) return;
    var input = document.getElementById("need-" + need);
    if (input) {
      input.checked = true;
    }
  }

  /* ---------------------------------------------------------------
   * AI Consultation Assistant — scripted mock chat.
   * Explicitly never: claims to be Marc, quotes prices, promises
   * dates, or confirms availability. Copy is fixed/canned.
   * ------------------------------------------------------------- */
  var NEED_LABELS = {
    blinds: "blinds",
    shades: "shades",
    shutters: "shutters",
    motorized: "motorized coverings",
    unsure: "figuring out what fits your space"
  };

  function initAiWidget() {
    var chat = document.getElementById("aiChat");
    var replies = document.getElementById("chatQuickReplies");
    if (!chat || !replies) return;

    function addMessage(text, from) {
      var msg = document.createElement("div");
      msg.className = "chat-msg " + from;
      msg.textContent = text;
      chat.appendChild(msg);
      chat.scrollTop = chat.scrollHeight;
    }

    function firstRoundReply(need, label) {
      replies.innerHTML = "";
      addMessage(label, "user");

      var response =
        "Thanks — " + label.toLowerCase() + " is good to know. I can't quote " +
        "prices, confirm exact availability, or promise a date here — Marc " +
        "will cover all of that once he reviews your details. Want to jump " +
        "into the quick consultation form below so he has what he needs?";
      window.setTimeout(function () {
        addMessage(response, "bot");
        var goBtn = document.createElement("button");
        goBtn.type = "button";
        goBtn.textContent = "Take me to the form ↓";
        goBtn.addEventListener("click", function () {
          var wizard = document.getElementById("wizard");
          if (need) {
            var input = document.getElementById("need-" + need);
            if (input) input.checked = true;
          }
          if (wizard) {
            wizard.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
        replies.appendChild(goBtn);
      }, 350);
    }

    replies.addEventListener("click", function (event) {
      var btn = event.target.closest("button[data-reply]");
      if (!btn || btn.disabled) return;
      var need = btn.getAttribute("data-need");
      var label = NEED_LABELS[need] || btn.getAttribute("data-reply");
      // Disable the whole first round of quick replies once one is picked.
      Array.prototype.forEach.call(replies.querySelectorAll("button[data-reply]"), function (b) {
        b.disabled = true;
      });
      firstRoundReply(need, btn.getAttribute("data-reply"));
    });
  }

  /* ---------------------------------------------------------------
   * Multi-step wizard
   * ------------------------------------------------------------- */
  var TOTAL_STEPS = 4;

  function initWizard() {
    var form = document.getElementById("consultForm");
    var wizard = document.getElementById("wizard");
    if (!form || !wizard) return;

    var currentStep = 1;
    var steps = form.querySelectorAll(".wizard-step");
    var progressItems = document.querySelectorAll("#progressList li");
    var btnBack = document.getElementById("btnBack");
    var btnNext = document.getElementById("btnNext");
    var btnSubmit = document.getElementById("btnSubmit");
    var successScreen = document.getElementById("successScreen");

    function showStep(stepNum) {
      steps.forEach(function (stepEl) {
        var isActive = Number(stepEl.getAttribute("data-step")) === stepNum;
        stepEl.classList.toggle("is-active", isActive);
      });
      progressItems.forEach(function (item) {
        var n = Number(item.getAttribute("data-step"));
        item.classList.toggle("is-active", n === stepNum);
        item.classList.toggle("is-done", n < stepNum);
      });
      btnBack.disabled = stepNum === 1;
      btnNext.hidden = stepNum === TOTAL_STEPS;
      btnSubmit.hidden = stepNum !== TOTAL_STEPS;
      if (stepNum === TOTAL_STEPS) {
        buildSummary();
      }
      var heading = wizard.querySelector('.wizard-step[data-step="' + stepNum + '"] h3');
      if (heading) heading.setAttribute("tabindex", "-1");
      if (heading) heading.focus({ preventScroll: true });
    }

    function setFieldError(fieldId, hasError) {
      var field = document.getElementById(fieldId);
      if (!field) return;
      field.classList.toggle("has-error", hasError);
    }

    function clearErrorsForStep(stepEl) {
      stepEl.querySelectorAll(".field, [id^='field-']").forEach(function (f) {
        f.classList.remove("has-error");
      });
    }

    function validateStep(stepNum) {
      var stepEl = form.querySelector('.wizard-step[data-step="' + stepNum + '"]');
      var valid = true;
      var firstInvalid = null;

      function fail(fieldId, focusEl) {
        valid = false;
        setFieldError(fieldId, true);
        if (!firstInvalid) firstInvalid = focusEl;
      }

      clearErrorsForStep(stepEl);

      if (stepNum === 1) {
        var needChecked = form.querySelector('input[name="need"]:checked');
        var optionsWrap = document.getElementById("needOptions");
        var errNeed = document.getElementById("err-need");
        if (!needChecked) {
          valid = false;
          errNeed.style.display = "block";
          optionsWrap.style.outline = "2px solid var(--color-error)";
          optionsWrap.style.borderRadius = "12px";
          firstInvalid = form.querySelector('input[name="need"]');
        } else {
          errNeed.style.display = "none";
          optionsWrap.style.outline = "none";
        }
      }

      if (stepNum === 2) {
        var numWindows = document.getElementById("numWindows");
        var timeframe = document.getElementById("timeframe");
        var propertyType = form.querySelector('input[name="propertyType"]:checked');
        var projectType = form.querySelector('input[name="projectType"]:checked');

        if (!numWindows.value || Number(numWindows.value) < 1) {
          fail("field-windows", numWindows);
        }
        if (!timeframe.value) {
          fail("field-timeframe", timeframe);
        }
        if (!propertyType) {
          fail("field-property", document.getElementById("prop-home"));
        }
        if (!projectType) {
          fail("field-projecttype", document.getElementById("proj-new"));
        }
      }

      if (stepNum === 3) {
        var fullName = document.getElementById("fullName");
        var phone = document.getElementById("phone");
        var email = document.getElementById("email");
        var location = document.getElementById("location");
        var contactMethod = form.querySelector('input[name="contactMethod"]:checked');
        var prefTime = document.getElementById("prefTime");

        var phonePattern = /^[0-9+()\-.\s]{7,}$/;
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!fullName.value.trim()) {
          fail("field-name", fullName);
        }
        if (!phone.value.trim() || !phonePattern.test(phone.value.trim())) {
          fail("field-phone", phone);
        }
        if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
          fail("field-email", email);
        }
        if (!location.value.trim()) {
          fail("field-location", location);
        }
        if (!contactMethod) {
          fail(null, document.getElementById("cm-phone"));
          document.getElementById("err-contactmethod").style.display = "block";
        } else {
          document.getElementById("err-contactmethod").style.display = "none";
        }
        if (!prefTime.value) {
          fail("field-preftime", prefTime);
        }
      }

      if (!valid && firstInvalid) {
        firstInvalid.focus();
      }
      return valid;
    }

    btnNext.addEventListener("click", function () {
      if (!validateStep(currentStep)) return;
      if (currentStep < TOTAL_STEPS) {
        currentStep += 1;
        showStep(currentStep);
      }
    });

    btnBack.addEventListener("click", function () {
      if (currentStep > 1) {
        currentStep -= 1;
        showStep(currentStep);
      }
    });

    function fieldValue(sel) {
      var el = form.querySelector(sel);
      return el && el.value ? el.value : "";
    }

    function checkedValue(name) {
      var el = form.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : "";
    }

    var NEED_TEXT = {
      blinds: "Blinds",
      shades: "Shades",
      shutters: "Shutters",
      motorized: "Motorized window coverings",
      repair: "Repair / service",
      unsure: "Not sure — help me choose"
    };
    var PROPERTY_TEXT = { home: "Home", cottage: "Cottage", business: "Business" };
    var PROJECT_TEXT = {
      "new-construction": "New construction",
      renovation: "Renovation",
      replacement: "Replacement"
    };
    var TIMEFRAME_TEXT = {
      asap: "As soon as possible",
      "1-3-months": "1–3 months",
      "3-6-months": "3–6 months",
      exploring: "Just exploring options"
    };
    var CONTACT_TEXT = { phone: "Phone call", text: "Text message", email: "Email" };
    var PREFTIME_TEXT = {
      morning: "Weekday mornings",
      afternoon: "Weekday afternoons",
      evening: "Weekday evenings",
      weekend: "Weekends"
    };

    function buildSummary() {
      var list = document.getElementById("summaryList");
      if (!list) return;
      var need = checkedValue("need");
      var rows = [
        ["What you need", NEED_TEXT[need] || "—"],
        ["Number of windows", fieldValue("#numWindows") || "—"],
        ["Property type", PROPERTY_TEXT[checkedValue("propertyType")] || "—"],
        ["Project type", PROJECT_TEXT[checkedValue("projectType")] || "—"],
        ["Timeframe", TIMEFRAME_TEXT[fieldValue("#timeframe")] || "—"],
        ["Name", fieldValue("#fullName") || "—"],
        ["Phone", fieldValue("#phone") || "—"],
        ["Email", fieldValue("#email") || "—"],
        ["Preferred contact method", CONTACT_TEXT[checkedValue("contactMethod")] || "—"],
        ["Preferred consultation time", PREFTIME_TEXT[fieldValue("#prefTime")] || "—"],
        ["Location / community", fieldValue("#location") || "—"],
        ["Photos attached", String(selectedFiles.length) + (selectedFiles.length === 1 ? " file" : " files")]
      ];
      list.innerHTML = "";
      rows.forEach(function (pair) {
        var dt = document.createElement("dt");
        dt.textContent = pair[0];
        var dd = document.createElement("dd");
        dd.textContent = pair[1];
        list.appendChild(dt);
        list.appendChild(dd);
      });
    }

    /* ------------------------- Step 4: photo preview ------------------ */
    var selectedFiles = [];
    var photoInput = document.getElementById("photoUpload");
    var uploadPreview = document.getElementById("uploadPreview");

    if (photoInput) {
      photoInput.addEventListener("change", function () {
        selectedFiles = Array.prototype.slice.call(photoInput.files || []);
        uploadPreview.innerHTML = "";
        selectedFiles.forEach(function (file) {
          var chip = document.createElement("div");
          chip.className = "file-chip";

          if (file.type && file.type.indexOf("image/") === 0 && window.FileReader) {
            var img = document.createElement("img");
            img.style.width = "100%";
            img.alt = "Local preview of " + file.name + " (not uploaded anywhere)";
            var reader = new FileReader();
            reader.onload = function (e) {
              img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            chip.appendChild(img);
          }

          var name = document.createElement("div");
          name.textContent = file.name;
          chip.appendChild(name);
          uploadPreview.appendChild(chip);
        });
      });
    }

    /* ------------------------------ Submit ----------------------------- */
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      // Deliberately no fetch/XHR here — this is a static prototype.
      // Re-validate every step defensively before showing "success".
      var allValid = [1, 2, 3].every(function (s) {
        return validateStep(s);
      });
      if (!allValid) {
        // Send the user back to whichever earlier step failed.
        for (var s = 1; s <= 3; s++) {
          if (!validateStep(s)) {
            currentStep = s;
            showStep(currentStep);
            break;
          }
        }
        return;
      }
      wizard.querySelector(".progress").hidden = true;
      form.hidden = true;
      successScreen.hidden = false;
      successScreen.querySelector("h2").focus({ preventScroll: true });
      successScreen.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    var btnStartOver = document.getElementById("btnStartOver");
    if (btnStartOver) {
      btnStartOver.addEventListener("click", function () {
        form.reset();
        selectedFiles = [];
        uploadPreview.innerHTML = "";
        currentStep = 1;
        successScreen.hidden = true;
        form.hidden = false;
        wizard.querySelector(".progress").hidden = false;
        showStep(currentStep);
        wizard.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    showStep(currentStep);
  }

  document.addEventListener("DOMContentLoaded", function () {
    preselectFromQuery();
    initAiWidget();
    initWizard();
  });
})();
