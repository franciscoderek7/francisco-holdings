/*
 * Northern Forge Blinds — prototype site
 * concierge.js: "AI Blinds Concierge" — a scripted, chat-style guided
 * experience for consultation.html.
 *
 * IMPORTANT — this is a fully simulated demo:
 *   - There is no AI model, no API call, and no network request of any
 *     kind (no fetch, no XHR, no WebSocket). Every question, option, and
 *     the final "recommendation" are pre-written in this file and picked
 *     with plain if/else logic based on button clicks.
 *   - It never quotes a real price, promises an installation date, or
 *     confirms product availability. Those guardrails are enforced in the
 *     copy below, not by any external moderation layer.
 *   - Nothing typed or clicked here is sent, stored, or logged anywhere —
 *     it only lives in page memory for the current visit.
 */
(function () {
  "use strict";

  var STEPS = [
    {
      id: "room",
      question: "Which room should we start with?",
      options: ["Living room", "Bedroom", "Kitchen", "Bathroom", "Home office", "Other / multiple rooms"]
    },
    {
      id: "windowType",
      question: "What kind of window (or windows) are we covering?",
      options: ["Standard single window", "Wide window or multiple windows", "Sliding glass door", "Bay or angled window", "Not sure yet"]
    },
    {
      id: "light",
      question: "How do you want to manage daylight in that space?",
      options: ["Block it out completely", "Soften or filter it", "Let in as much light as possible", "Depends on the time of day"]
    },
    {
      id: "privacy",
      question: "How much privacy do you need there?",
      options: ["Full privacy, all the time", "Privacy in the evenings only", "Not a big concern"]
    },
    {
      id: "style",
      question: "Which style feels closest to what you have in mind?",
      options: ["Clean & minimal", "Warm & traditional", "Bold & architectural", "Not sure — open to suggestions"]
    },
    {
      id: "budget",
      question: "Roughly where do you want to land on cost? (Placeholder ranges only — no real prices in this demo.)",
      options: ["Keep it cost-conscious", "Mid-range / balanced", "Premium, top-of-line", "Not sure yet"]
    },
    {
      id: "operation",
      question: "Manual or motorized operation?",
      options: ["Manual (cord or wand)", "Motorized (remote or app)", "Not sure — I'd like to compare both"]
    },
    {
      id: "install",
      question: "Last one — what about installation?",
      options: ["I'll want professional installation", "I might install it myself", "Not sure yet"]
    }
  ];

  var OPENING_LINE = "Let's find the right blinds for your space.";
  var INTRO_LINE = "I'll ask a few quick questions, then put together a demo recommendation — pick an option below to answer.";

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-concierge]");
    if (!root) return;

    var log = document.getElementById("concierge-log");
    var activeBlock = document.getElementById("concierge-active");
    var progressEl = document.getElementById("concierge-progress");
    var questionEl = document.getElementById("concierge-question");
    var optionsEl = document.getElementById("concierge-options");
    var backBtn = document.getElementById("concierge-back");
    var summaryPanel = document.getElementById("concierge-summary");
    var summaryList = document.getElementById("concierge-summary-list");
    var restartBtn = document.getElementById("concierge-restart");
    var bookLink = document.getElementById("concierge-book");

    var stepIndex = 0;
    var answers = {};

    function addBubble(text, who) {
      var bubble = document.createElement("p");
      bubble.className = "concierge__bubble concierge__bubble--" + who;
      bubble.textContent = text;
      log.appendChild(bubble);
      log.scrollTop = log.scrollHeight;
    }

    function renderStep() {
      var step = STEPS[stepIndex];
      progressEl.textContent = "Question " + (stepIndex + 1) + " of " + STEPS.length;
      questionEl.textContent = step.question;
      optionsEl.innerHTML = "";
      step.options.forEach(function (label) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "concierge__option";
        btn.textContent = label;
        btn.addEventListener("click", function () {
          handleAnswer(step, label);
        });
        optionsEl.appendChild(btn);
      });
      backBtn.hidden = stepIndex === 0;
      var firstOption = optionsEl.querySelector(".concierge__option");
      if (firstOption) firstOption.focus();
    }

    function handleAnswer(step, label) {
      answers[step.id] = label;
      addBubble(label, "user");
      stepIndex += 1;
      if (stepIndex < STEPS.length) {
        var nextStep = STEPS[stepIndex];
        addBubble(nextStep.question, "bot");
        renderStep();
      } else {
        showSummary();
      }
    }

    function computeRecommendation() {
      var categories = [];
      if (answers.style === "Bold & architectural" || answers.windowType === "Bay or angled window") {
        categories.push("Shutters");
      } else if (
        answers.privacy !== "Not a big concern" &&
        (answers.light === "Block it out completely" || answers.light === "Soften or filter it")
      ) {
        categories.push("Shades");
      } else {
        categories.push("Blinds");
      }
      if (answers.operation === "Motorized (remote or app)" || answers.operation === "Not sure — I'd like to compare both") {
        categories.push("Motorization");
      }
      return categories;
    }

    function showSummary() {
      activeBlock.hidden = true;
      var categories = computeRecommendation();
      var categoryText = categories.join(" + ");

      var introBubble = "Based on what you've told me, a " + categoryText + " direction looks like a reasonable demo starting point for your " + answers.room.toLowerCase() + ". Here's the full summary:";
      addBubble(introBubble, "bot");

      summaryList.innerHTML = "";
      var rows = [
        ["Room", answers.room],
        ["Window type", answers.windowType],
        ["Light control", answers.light],
        ["Privacy needs", answers.privacy],
        ["Style preference", answers.style],
        ["Budget range (placeholder)", answers.budget],
        ["Operation", answers.operation],
        ["Installation", answers.install],
        ["Demo recommendation", categoryText]
      ];
      rows.forEach(function (row) {
        var dt = document.createElement("dt");
        dt.textContent = row[0];
        var dd = document.createElement("dd");
        dd.textContent = row[1] || "—";
        summaryList.appendChild(dt);
        summaryList.appendChild(dd);
      });

      // Pre-select the matching category checkbox(es) on the standard form below,
      // purely as a client-side convenience — still no network call of any kind.
      categories.forEach(function (value) {
        var checkbox = document.querySelector('#consultation-form input[name="category"][value="' + value + '"]');
        if (checkbox) checkbox.checked = true;
      });

      summaryPanel.hidden = false;
      summaryPanel.setAttribute("tabindex", "-1");
      summaryPanel.focus();
    }

    function reset() {
      stepIndex = 0;
      answers = {};
      log.innerHTML = "";
      summaryPanel.hidden = true;
      activeBlock.hidden = false;
      addBubble(OPENING_LINE, "bot");
      addBubble(INTRO_LINE, "bot");
      addBubble(STEPS[0].question, "bot");
      renderStep();
    }

    backBtn.addEventListener("click", function () {
      if (stepIndex === 0) return;
      stepIndex -= 1;
      // The log always ends with [... bot question we're leaving, user's
      // prior answer already came before it] — drop the trailing bot
      // question bubble; the earlier question bubble for this step is
      // already in the log from before, so no need to re-add it.
      for (var i = 0; i < 2 && log.lastElementChild; i++) {
        log.removeChild(log.lastElementChild);
      }
      delete answers[STEPS[stepIndex].id];
      renderStep();
    });

    restartBtn.addEventListener("click", reset);

    if (bookLink) {
      bookLink.addEventListener("click", function () {
        // Smooth-scroll only; still a same-page anchor link, no navigation call.
        var form = document.getElementById("consultation-form");
        if (form) {
          window.setTimeout(function () {
            var firstField = form.querySelector("input, select, textarea");
            if (firstField) firstField.focus();
          }, 400);
        }
      });
    }

    reset();
  });
})();
