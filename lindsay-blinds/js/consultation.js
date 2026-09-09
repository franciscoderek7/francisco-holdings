/*
 * Lindsay Blinds prototype — consultation wizard + demo AI concierge.
 *
 * Everything here is client-side only:
 *  - No fetch/XHR/WebSocket calls anywhere in this file.
 *  - The "AI Concierge" is a scripted, canned chat flow (a small state
 *    machine with fixed questions/answers) — not a live model, and it
 *    cannot go off script. See the big comment above initAiWidget().
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
   * AI Concierge — DEMO / SIMULATED ONLY.
   *
   * This entire widget is a fixed-script JS state machine:
   *  - No fetch/XHR/WebSocket, no real NLP or AI model of any kind.
   *  - Free-text input is matched against a small local keyword list
   *    (see CATEGORY_PATTERNS / ROOM_PATTERNS) purely to pick a
   *    starting branch of the script — it cannot "understand"
   *    anything outside that list, and nothing typed is sent anywhere
   *    or stored after the page is closed.
   *  - The script explicitly never: quotes or estimates a price,
   *    promises an installation date, confirms that a product is in
   *    stock/available, or claims to be Marc or speak on his behalf.
   *  - The closing "Recommended direction" is a plain-language recap
   *    of the visitor's own picks, not a real recommendation engine.
   * ------------------------------------------------------------- */
  var CATEGORY_INFO = {
    blinds: { label: "blinds", display: "Blinds", radioId: "blinds" },
    shades: { label: "shades", display: "Shades", radioId: "shades" },
    shutters: { label: "shutters", display: "Shutters", radioId: "shutters" },
    motorized: { label: "motorized coverings", display: "Motorization", radioId: "motorized" },
    repair: { label: "a repair", display: "Repair / service", radioId: "repair" },
    unsure: { label: "figuring out what fits your space", display: "Not sure yet", radioId: "unsure" }
  };
  var CATEGORY_ORDER = ["blinds", "shades", "shutters", "motorized", "repair", "unsure"];

  // Order matters: more specific words (repair, motorized) are checked
  // before generic ones so "fix my motorized shade" resolves sensibly.
  var CATEGORY_PATTERNS = [
    { key: "repair", pattern: /\brepair|\bfix\b|\bbroken\b|\bstuck\b|stopped working|not working/i },
    { key: "motorized", pattern: /\bmotor|\bremote control|automat|smart (shade|blind)/i },
    { key: "shutters", pattern: /\bshutter/i },
    { key: "shades", pattern: /\bshade/i },
    { key: "blinds", pattern: /\bblind/i }
  ];

  var ROOM_PATTERNS = [
    { label: "Living room", pattern: /living room|family room|great room/i },
    { label: "Bedroom", pattern: /bedroom/i },
    { label: "Kitchen", pattern: /kitchen/i },
    { label: "Bathroom", pattern: /bathroom|\bbath\b/i },
    { label: "Home office", pattern: /office|\bden\b/i },
    { label: "Dining room", pattern: /dining/i },
    { label: "Sunroom", pattern: /sun ?room/i },
    { label: "Cottage", pattern: /cottage/i }
  ];

  var CONCIERGE_STEPS = [
    {
      key: "windowType",
      question: "Good to know. What best describes the window(s) you're covering?",
      options: [
        "Standard-size window(s)",
        "Large or patio-style window(s)",
        "An odd shape — bay, arch, or skylight",
        "Not sure yet"
      ]
    },
    {
      key: "light",
      question: "How much light control are you after in that space?",
      options: [
        "Block out light completely",
        "Soften and diffuse the light",
        "Let light in, just cut the glare",
        "No strong preference"
      ]
    },
    {
      key: "privacy",
      question: "And privacy — how important is that here?",
      options: ["Full privacy, day and night", "Mainly just in the evening", "Not a big concern"]
    },
    {
      key: "style",
      question: "On style, which direction feels closest to you?",
      options: ["Clean and modern", "Classic and traditional", "Warm and textured", "Not sure yet"]
    },
    {
      key: "colour",
      question: "Any colour direction in mind?",
      options: ["Light, neutral tones", "Warm wood tones", "Bold or dark tones", "Still undecided"]
    },
    {
      key: "budget",
      question:
        "Roughly what range are you thinking — just a general direction? " +
        "(I can't quote exact prices, that's Marc's call.)",
      options: [
        "Keep it simple and budget-friendly",
        "Mid-range",
        "Open to premium or motorized options",
        "Not sure — I'd like guidance"
      ]
    },
    {
      key: "install",
      question: "Last question — will you need installation help too?",
      options: [
        "Yes, full installation please",
        "Just product advice for now",
        "I have my own installer",
        "Not sure yet"
      ]
    }
  ];

  function initAiWidget() {
    var chat = document.getElementById("aiChat");
    var replies = document.getElementById("chatQuickReplies");
    var textForm = document.getElementById("aiChatForm");
    var textInput = document.getElementById("aiChatInput");
    var orLabel = document.querySelector(".chat-or");
    if (!chat || !replies) return;

    var ctx = {};
    var stepIndex = -1;

    function addMessage(text, from) {
      var msg = document.createElement("div");
      msg.className = "chat-msg " + from;
      msg.textContent = text;
      chat.appendChild(msg);
      chat.scrollTop = chat.scrollHeight;
      return msg;
    }

    function clearOptions() {
      replies.innerHTML = "";
    }

    function addOption(label, onClick, extraClass) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = extraClass ? extraClass : "";
      btn.textContent = label;
      btn.addEventListener("click", onClick);
      replies.appendChild(btn);
      return btn;
    }

    function disableOptions() {
      Array.prototype.forEach.call(replies.querySelectorAll("button"), function (b) {
        b.disabled = true;
      });
    }

    function hideTextEntry() {
      // Only the opening message is free text; every question after
      // that is answered with a button so the script stays fully
      // deterministic and never has to "interpret" open-ended input.
      if (textForm) textForm.hidden = true;
      if (orLabel) orLabel.hidden = true;
    }

    function renderInitialOptions() {
      CATEGORY_ORDER.forEach(function (key) {
        addOption(CATEGORY_INFO[key].display, function () {
          disableOptions();
          hideTextEntry();
          addMessage(CATEGORY_INFO[key].display, "user");
          ctx.category = key;
          askRoom();
        });
      });
    }

    function askRoom() {
      window.setTimeout(function () {
        addMessage("Which room or area is this for?", "bot");
        clearOptions();
        ["Living room", "Bedroom", "Kitchen", "Bathroom", "Home office", "Other / multiple rooms"].forEach(
          function (label) {
            addOption(label, function () {
              disableOptions();
              addMessage(label, "user");
              ctx.room = label;
              beginGuidedSteps();
            });
          }
        );
      }, 350);
    }

    function askCategoryClarify() {
      window.setTimeout(function () {
        addMessage("No problem — which of these is closest?", "bot");
        clearOptions();
        CATEGORY_ORDER.forEach(function (key) {
          addOption(CATEGORY_INFO[key].display, function () {
            disableOptions();
            addMessage(CATEGORY_INFO[key].display, "user");
            ctx.category = key;
            askRoom();
          });
        });
      }, 300);
    }

    function beginGuidedSteps() {
      stepIndex = 0;
      askStep();
    }

    function askStep() {
      if (stepIndex >= CONCIERGE_STEPS.length) {
        buildSummary();
        return;
      }
      var step = CONCIERGE_STEPS[stepIndex];
      window.setTimeout(function () {
        addMessage(step.question, "bot");
        clearOptions();
        step.options.forEach(function (label) {
          addOption(label, function () {
            disableOptions();
            addMessage(label, "user");
            ctx[step.key] = label;
            stepIndex += 1;
            askStep();
          });
        });
      }, 400);
    }

    function buildSummary() {
      window.setTimeout(function () {
        var info = CATEGORY_INFO[ctx.category] || CATEGORY_INFO.unsure;
        var card = document.createElement("div");
        card.className = "chat-msg bot ai-summary-card";

        var itemsHtml = "";
        function row(label, value) {
          if (!value) return;
          itemsHtml += "<li><strong>" + label + ":</strong> " + value + "</li>";
        }
        row("Looking for", info.display);
        row("Room", ctx.room);
        row("Window", ctx.windowType);
        row("Light control", ctx.light);
        row("Privacy", ctx.privacy);
        row("Style", ctx.style);
        row("Colour", ctx.colour);
        row("Budget direction", ctx.budget);
        row("Installation", ctx.install);

        // Every value inserted above comes from our own fixed option
        // labels (button clicks) or the closed ROOM_PATTERNS/CATEGORY_INFO
        // lists — never from raw, unfiltered visitor text — so this is
        // safe to build as innerHTML.
        card.innerHTML =
          "<h4>Recommended direction</h4>" +
          "<ul>" +
          itemsHtml +
          "</ul>" +
          "<p>This is a suggested starting point only — not a price quote, order, " +
          "or scheduled appointment. Marc reviews every request personally and will " +
          "confirm specifics, pricing and timing with you directly.</p>";
        chat.appendChild(card);
        chat.scrollTop = chat.scrollHeight;

        clearOptions();
        addOption(
          "Request Consultation →",
          function () {
            var wizard = document.getElementById("wizard");
            var radio = document.getElementById("need-" + info.radioId);
            if (radio) radio.checked = true;
            if (wizard) {
              wizard.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          },
          "cta-final"
        );
        addOption(
          "Start over",
          function () {
            resetChat();
          },
          "chat-restart"
        );
      }, 450);
    }

    function resetChat() {
      ctx = {};
      stepIndex = -1;
      chat.innerHTML = "";
      addMessage(
        "Hi again! Tell me a bit about what you're working on (for example, " +
          '"I need blinds for my living room") and I’ll ask a few quick ' +
          "follow-up questions — or pick an option below.",
        "bot"
      );
      clearOptions();
      renderInitialOptions();
      if (textForm) textForm.hidden = false;
      if (orLabel) orLabel.hidden = false;
      if (textInput) textInput.value = "";
    }

    function parseCategory(text) {
      for (var i = 0; i < CATEGORY_PATTERNS.length; i++) {
        if (CATEGORY_PATTERNS[i].pattern.test(text)) return CATEGORY_PATTERNS[i].key;
      }
      return null;
    }

    function parseRoom(text) {
      for (var i = 0; i < ROOM_PATTERNS.length; i++) {
        if (ROOM_PATTERNS[i].pattern.test(text)) return ROOM_PATTERNS[i].label;
      }
      return null;
    }

    function handleFreeText(text) {
      addMessage(text, "user");
      hideTextEntry();
      var category = parseCategory(text);
      var room = parseRoom(text);
      if (room) ctx.room = room;

      if (category) {
        ctx.category = category;
        if (room) {
          window.setTimeout(function () {
            addMessage(
              "Got it — " + CATEGORY_INFO[category].label + " for the " + room.toLowerCase() + ". Let's narrow it down.",
              "bot"
            );
            beginGuidedSteps();
          }, 350);
        } else {
          askRoom();
        }
      } else {
        askCategoryClarify();
      }
    }

    if (textForm && textInput) {
      textForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var value = textInput.value.trim();
        if (!value) return;
        textInput.value = "";
        handleFreeText(value);
      });
    }

    renderInitialOptions();
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
