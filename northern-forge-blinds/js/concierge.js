/*
 * Northern Forge — prototype site
 * concierge.js: "Northern Forge Concierge" — an upgraded, scripted,
 * chat-style guided experience for consultation.html covering the full
 * windows / blinds / shades / shutters / doors / motorization scope.
 *
 * IMPORTANT — this is a fully simulated demo, not a live AI system:
 *   - There is no AI model, no API call, and no network request of any
 *     kind (no fetch, no XHR, no WebSocket). Every question, option, and
 *     the final "recommendation" are pre-written in this file and picked
 *     with plain if/else logic based on button clicks.
 *   - "Contextual" follow-ups below are template strings that splice in the
 *     visitor's own prior answers — there is no natural-language
 *     understanding involved.
 *   - It never quotes a real price, promises an installation date, or
 *     confirms product availability. Those guardrails are enforced in the
 *     copy below, not by any external moderation layer.
 *   - Nothing typed or clicked here is sent, stored, or logged anywhere —
 *     it only lives in page memory for the current visit.
 */
(function () {
  "use strict";

  // Each step's `question` may be a string or a function(answers) => string,
  // used to build a contextual follow-up that references what the visitor
  // already said. Still 100% scripted template logic — no NLP.
  var STEPS = [
    {
      id: "interest",
      question: function () {
        return "What are you primarily interested in exploring today?";
      },
      options: ["Windows", "Blinds & Shades", "Shutters", "Doors", "Motorized / smart control", "Not sure — I'd like guidance"]
    },
    {
      id: "room",
      question: function (a) {
        return "Good — " + a.interest.toLowerCase() + ". Which room or area should we focus on first?";
      },
      options: ["Living room", "Bedroom", "Kitchen", "Bathroom", "Home office", "Entryway / exterior", "Whole-home / multiple areas"]
    },
    {
      id: "opening",
      question: function (a) {
        return "For the " + a.room.toLowerCase() + " — what kind of opening are we working with?";
      },
      options: ["Standard single window", "Wide window or multiple windows", "Sliding glass door", "Bay or angled window", "Exterior entry door", "Not sure yet"]
    },
    {
      id: "light",
      question: function (a) {
        return "Next, light: how do you want to manage daylight in that space?";
      },
      options: ["Block it out completely", "Soften or filter it", "Let in as much light as possible", "Depends on the time of day"]
    },
    {
      id: "privacy",
      question: function (a) {
        if (a.light === "Block it out completely") {
          return "Since you'd like to block light out completely there, how much privacy do you need as well?";
        }
        return "And privacy — how much do you need in that space?";
      },
      options: ["Full privacy, all the time", "Privacy in the evenings only", "Some privacy, open otherwise", "Not a big concern"]
    },
    {
      id: "style",
      question: function () {
        return "Which style direction feels closest to what you have in mind?";
      },
      options: ["Clean & minimal", "Warm & traditional", "Bold & architectural", "Not sure — open to suggestions"]
    },
    {
      id: "budget",
      question: function () {
        return "Roughly where do you want to land on cost? (Placeholder ranges only — this demo never quotes a real price.)";
      },
      options: ["Keep it cost-conscious", "Mid-range / balanced", "Premium, top-of-line", "Not sure yet"]
    },
    {
      id: "operation",
      question: function (a) {
        if (a.interest === "Doors") {
          return "For a door, would you want any motorized or smart-lock style features, or fully manual?";
        }
        return "Manual operation, or motorized (remote / app-controlled)?";
      },
      options: ["Manual (cord or wand)", "Motorized (remote or app)", "Not sure — I'd like to compare both"]
    },
    {
      id: "install",
      question: function () {
        return "Last one — what about installation?";
      },
      options: ["I'll want professional installation", "I might install it myself", "Not sure yet"]
    }
  ];

  var OPENING_LINE = "Hi — I'm the Northern Forge Concierge (demo). I'll walk through a few quick questions about your project, then put together a demo recommendation with the reasoning behind it.";
  var INTRO_LINE = "Nothing you tell me here is sent, stored, or analyzed by a real AI service — pick an option below to get started.";

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-concierge]");
    if (!root) return;

    var log = document.getElementById("concierge-log");
    var activeBlock = document.getElementById("concierge-active");
    var progressFill = document.getElementById("concierge-progress-fill");
    var progressLabel = document.getElementById("concierge-progress-label");
    var questionEl = document.getElementById("concierge-question");
    var optionsEl = document.getElementById("concierge-options");
    var backBtn = document.getElementById("concierge-back");
    var summaryPanel = document.getElementById("concierge-summary");
    var summaryWhy = document.getElementById("concierge-summary-why");
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

    function updateProgress(current, total) {
      var pct = Math.round((current / total) * 100);
      if (progressFill) progressFill.style.width = pct + "%";
      if (progressLabel) progressLabel.textContent = "Step " + current + " of " + total;
    }

    function renderStep() {
      var step = STEPS[stepIndex];
      var qText = typeof step.question === "function" ? step.question(answers) : step.question;
      updateProgress(stepIndex + 1, STEPS.length);
      questionEl.textContent = qText;
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
        var nextQ = typeof nextStep.question === "function" ? nextStep.question(answers) : nextStep.question;
        addBubble(nextQ, "bot");
        renderStep();
      } else {
        showSummary();
      }
    }

    // Pick a product-family recommendation from the scripted answers. This
    // is plain if/else branching over button-click values — not inference.
    function computeRecommendation() {
      var categories = [];

      if (answers.interest === "Doors") {
        categories.push("Doors");
      } else if (answers.interest === "Windows") {
        categories.push("Windows");
      } else if (answers.interest === "Shutters" || answers.style === "Bold & architectural" || answers.opening === "Bay or angled window") {
        categories.push("Shutters");
      } else if (
        answers.privacy !== "Not a big concern" &&
        (answers.light === "Block it out completely" || answers.light === "Soften or filter it")
      ) {
        categories.push("Shades");
      } else {
        categories.push("Blinds");
      }

      if (
        answers.interest === "Motorized / smart control" ||
        answers.operation === "Motorized (remote or app)" ||
        answers.operation === "Not sure — I'd like to compare both"
      ) {
        if (categories.indexOf("Motorization") === -1) categories.push("Motorization");
      }

      return categories;
    }

    function buildExplanation(categories) {
      var lead = categories.join(" + ");
      var reasonParts = [];

      if (answers.privacy && answers.privacy !== "Not a big concern") {
        reasonParts.push("your preference for " + answers.privacy.toLowerCase());
      }
      if (answers.light) {
        reasonParts.push("wanting to " + answers.light.toLowerCase().replace(/^./, function (c) { return c.toLowerCase(); }));
      }

      var reasonText = reasonParts.length
        ? "Based on " + reasonParts.join(" and ") + ", a " + lead + " direction may be a good starting point"
        : "Based on what you've told me, a " + lead + " direction may be a good starting point";

      reasonText += " for your " + (answers.room ? answers.room.toLowerCase() : "space") + " — let's narrow down exact style and operation in a real consultation.";
      return reasonText;
    }

    function showSummary() {
      activeBlock.hidden = true;
      var categories = computeRecommendation();
      var categoryText = categories.join(" + ");
      var explanation = buildExplanation(categories);

      addBubble("Thanks — here's my demo recommendation and the reasoning behind it.", "bot");

      if (summaryWhy) {
        summaryWhy.innerHTML = "<strong>Why this direction (demo reasoning):</strong> " + explanation;
      }

      summaryList.innerHTML = "";
      var rows = [
        ["Primary interest", answers.interest],
        ["Room / area", answers.room],
        ["Opening type", answers.opening],
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

      // Pre-select the matching category checkbox(es) on the standard form
      // below, purely as a client-side convenience — still no network call.
      categories.forEach(function (value) {
        var checkbox = document.querySelector('#consultation-form input[name="category"][value="' + value + '"]');
        if (checkbox) checkbox.checked = true;
      });

      if (progressFill) progressFill.style.width = "100%";
      if (progressLabel) progressLabel.textContent = "Complete";

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
      var firstQ = typeof STEPS[0].question === "function" ? STEPS[0].question(answers) : STEPS[0].question;
      addBubble(firstQ, "bot");
      renderStep();
    }

    backBtn.addEventListener("click", function () {
      if (stepIndex === 0) return;
      stepIndex -= 1;
      // The log always ends with [... bot question we're leaving, user's
      // prior answer already came before it] — drop the trailing bot
      // question bubble and the user's answer bubble for the step we're
      // returning to; that step's own question bubble is already earlier
      // in the log, so no need to re-add it.
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
