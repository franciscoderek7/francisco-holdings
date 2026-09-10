/*
 * Northern Forge — prototype site
 * finder.js: "Northern Forge Product Finder — Demo" — a scripted,
 * click-through recommendation tool for products.html.
 *
 * IMPORTANT — this is a fully simulated demo, not a live AI or inventory
 * system:
 *   - There is no AI model, no API call, and no network request of any
 *     kind (no fetch, no XHR, no WebSocket). Every question, option, and
 *     the final "recommendation" are pre-written in this file and picked
 *     with plain if/else logic based on button clicks.
 *   - It never quotes a real price, promises an installation date, or
 *     confirms product availability or inventory. Those guardrails are
 *     enforced in the copy below.
 *   - Nothing typed or clicked here is sent, stored, or logged anywhere —
 *     it only lives in page memory for the current visit.
 */
(function () {
  "use strict";

  var STEPS = [
    {
      id: "type",
      question: "What are you looking for?",
      options: ["Windows", "Blinds", "Shades", "Doors", "Garage Doors"]
    },
    {
      id: "property",
      question: function (a) {
        return "What room or property type is this " + a.type.toLowerCase() + " project for?";
      },
      options: ["Single room (residential)", "Whole-home / multiple rooms", "Condo or apartment", "New construction", "Not sure yet"]
    },
    {
      id: "privacy",
      question: "What are your privacy requirements?",
      options: ["Full privacy at all times", "Privacy in the evenings only", "Some privacy, open otherwise", "Not a big concern"]
    },
    {
      id: "light",
      question: "What are your light-control requirements?",
      options: ["Block light completely", "Filter / soften light", "Maximize natural light", "Depends on time of day"]
    },
    {
      id: "style",
      question: "Which style fits your space?",
      options: ["Clean & minimal", "Warm & traditional", "Bold & architectural", "Not sure — open to suggestions"]
    },
    {
      id: "colour",
      question: "Any colour direction in mind?",
      options: ["Light neutrals", "Warm wood tones", "Dark / bold tones", "Not sure yet"]
    },
    {
      id: "operation",
      question: "Manual or motorized operation?",
      options: ["Manual", "Motorized", "Open to either"]
    },
    {
      id: "budget",
      question: "Roughly where do you want to land on cost? (Placeholder ranges only — this demo never quotes a real price.)",
      options: ["Cost-conscious", "Mid-range / balanced", "Premium / top-of-line", "Not sure yet"]
    },
    {
      id: "install",
      question: "Will you need installation?",
      options: ["Professional installation", "DIY / self-install", "Not sure yet"]
    }
  ];

  var OPENING_LINE = "This is the Northern Forge Product Finder (demo) — a scripted planning tool, not a live AI or inventory system.";
  var INTRO_LINE = "Answer a few questions and I'll put together a demo product direction — pick an option below to begin.";

  function recommendFamily(a) {
    if (a.type === "Garage Doors") return "Garage Doors";
    if (a.type === "Doors") return "Doors";
    if (a.type === "Windows") return "Windows";
    if (a.style === "Bold & architectural") return "Shutters";
    if (a.privacy !== "Not a big concern" && (a.light === "Block light completely" || a.light === "Filter / soften light")) {
      return "Shades";
    }
    return "Blinds";
  }

  function buildExplanation(a, family) {
    var reasons = [];
    if (a.privacy && a.privacy !== "Not a big concern") reasons.push("your privacy requirements (" + a.privacy.toLowerCase() + ")");
    if (a.light) reasons.push("your light-control requirements (" + a.light.toLowerCase() + ")");
    var base = reasons.length
      ? "Based on " + reasons.join(" and ") + ", " + family + " looks like a reasonable demo direction."
      : family + " looks like a reasonable demo direction based on what you've selected.";
    if (a.operation === "Motorized") {
      base += " Since you're open to motorized operation, this could also pair with the motorization options covered in the Technology Showcase below.";
    }
    return base;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("finder");
    if (!root) return;

    var log = document.getElementById("finder-log");
    var activeBlock = document.getElementById("finder-active");
    var progressFill = document.getElementById("finder-progress-fill");
    var progressLabel = document.getElementById("finder-progress-label");
    var questionEl = document.getElementById("finder-question");
    var optionsEl = document.getElementById("finder-options");
    var backBtn = document.getElementById("finder-back");
    var summaryPanel = document.getElementById("finder-summary");
    var summaryWhy = document.getElementById("finder-summary-why");
    var summaryList = document.getElementById("finder-summary-list");
    var restartBtn = document.getElementById("finder-restart");

    var stepIndex = 0;
    var answers = {};
    // Only move keyboard focus into the widget once the visitor has
    // actually interacted with it (an answer click, Back, or Start Over) —
    // never on the automatic initial render, since focusing an
    // off-screen element there would force the whole page to auto-scroll
    // down to this widget the instant the page loads.
    var autoFocus = false;

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
      if (firstOption && autoFocus) firstOption.focus();
    }

    function handleAnswer(step, label) {
      answers[step.id] = label;
      addBubble(label, "user");
      autoFocus = true;
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

    function showSummary() {
      activeBlock.hidden = true;
      var family = recommendFamily(answers);
      var explanation = buildExplanation(answers, family);

      addBubble("Here's a demo product direction based on your answers.", "bot");
      if (summaryWhy) {
        summaryWhy.innerHTML = "<strong>Why this direction (demo reasoning):</strong> " + explanation;
      }

      summaryList.innerHTML = "";
      var rows = [
        ["Looking for", answers.type],
        ["Room / property type", answers.property],
        ["Privacy requirements", answers.privacy],
        ["Light-control requirements", answers.light],
        ["Style", answers.style],
        ["Colour direction", answers.colour],
        ["Operation", answers.operation],
        ["Budget range (placeholder)", answers.budget],
        ["Installation", answers.install],
        ["Demo product direction", family]
      ];
      rows.forEach(function (row) {
        var dt = document.createElement("dt");
        dt.textContent = row[0];
        var dd = document.createElement("dd");
        dd.textContent = row[1] || "—";
        summaryList.appendChild(dt);
        summaryList.appendChild(dd);
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
      addBubble(STEPS[0].question, "bot");
      renderStep();
    }

    backBtn.addEventListener("click", function () {
      if (stepIndex === 0) return;
      stepIndex -= 1;
      for (var i = 0; i < 2 && log.lastElementChild; i++) {
        log.removeChild(log.lastElementChild);
      }
      delete answers[STEPS[stepIndex].id];
      autoFocus = true;
      renderStep();
    });

    restartBtn.addEventListener("click", function () {
      autoFocus = true;
      reset();
    });

    reset();
  });
})();
