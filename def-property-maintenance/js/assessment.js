/*
 * DEF Property Maintenance & Security — prototype
 * Security Assessment demo — a multi-step form that produces a simulated
 * "DEF Property Protection Profile" entirely in the browser.
 *
 * IMPORTANT: this is NOT a real assessment. There is no fetch/XHR call
 * anywhere in this file, no data is stored, and the "profile" is generated
 * by a small, fixed set of if/else rules run against the visitor's own
 * answers — never a price, never a promise of availability or installation.
 */
(function () {
  "use strict";

  var TOTAL_STEPS = 5;

  var LAYER_INFO = {
    1: { name: "Visibility", desc: "Lighting, signage, and visible cameras." },
    2: { name: "Perimeter", desc: "Fence lines, gates, driveway coverage, ground/perimeter sensing." },
    3: { name: "Entry", desc: "Doors, windows, locks, and door/window sensors." },
    4: { name: "Interior", desc: "Indoor motion detection, glass-break, and environmental sensors." },
    5: { name: "Verification", desc: "Cameras, AI analytics, and correlating events before acting on them." },
    6: { name: "Automation", desc: "Lights, locks, alerts, and routines once something is detected." },
    7: { name: "Response", desc: "Owner notification, and monitoring/escalation only as future options." }
  };

  function val(form, name) {
    var el = form.elements[name];
    return el ? el.value : "";
  }

  function checked(form, name) {
    var nodes = form.querySelectorAll('input[name="' + name + '"]:checked');
    return Array.prototype.map.call(nodes, function (n) {
      return n.value;
    });
  }

  function buildRecommendedLayers(answers) {
    var layers = [1, 3, 7]; // Visibility, Entry, Response are baseline every time.

    var wantsPerimeter =
      answers.features.indexOf("driveway") > -1 ||
      answers.features.indexOf("long-driveway") > -1 ||
      answers.features.indexOf("gate") > -1 ||
      answers.features.indexOf("fencing") > -1 ||
      answers.features.indexOf("outbuildings") > -1 ||
      answers.setting === "rural";
    if (wantsPerimeter) layers.push(2);

    var wantsInterior =
      answers.concerns.indexOf("break-ins") > -1 ||
      answers.concerns.indexOf("fire-co") > -1 ||
      answers.concerns.indexOf("water") > -1 ||
      answers.features.indexOf("pets") > -1;
    if (wantsInterior) layers.push(4);

    var wantsVerification =
      answers.concerns.indexOf("break-ins") > -1 ||
      answers.concerns.indexOf("package-theft") > -1 ||
      answers.concerns.indexOf("away-monitoring") > -1 ||
      answers.current.indexOf("cameras") === -1;
    if (wantsVerification) layers.push(5);

    if (answers.automation.length > 0) layers.push(6);

    layers.sort(function (a, b) {
      return a - b;
    });
    return layers;
  }

  function buildSuggestedCategories(answers) {
    var set = {};
    function add(name) {
      set[name] = true;
    }

    if (answers.concerns.indexOf("break-ins") > -1 || answers.current.indexOf("cameras") === -1) {
      add("Video Surveillance");
    }
    if (answers.concerns.indexOf("break-ins") > -1 || answers.features.indexOf("pets") === -1) {
      add("Motion Detection");
    }
    if (
      answers.features.indexOf("driveway") > -1 ||
      answers.features.indexOf("long-driveway") > -1 ||
      answers.features.indexOf("gate") > -1 ||
      answers.features.indexOf("fencing") > -1 ||
      answers.setting === "rural"
    ) {
      add("Ground / Perimeter Sensing");
    }
    add("Door & Window Protection");
    if (answers.concerns.indexOf("break-ins") > -1) {
      add("Glass Break Detection");
    }
    if (answers.features.indexOf("garage") > -1 || answers.features.indexOf("gate") > -1) {
      add("Smart Access Control");
    }
    if (answers.concerns.indexOf("package-theft") > -1) {
      add("Video Doorbells");
    }
    if (answers.current.indexOf("lighting") === -1 || answers.automation.indexOf("lighting") > -1) {
      add("Smart Lighting Security");
    }
    if (answers.concerns.indexOf("water") > -1 || answers.concerns.indexOf("fire-co") > -1) {
      add("Environmental Protection");
    }
    if (answers.features.indexOf("pets") > -1) {
      add("Pet & Property Safety");
    }
    if (answers.automation.length > 0) {
      add("Smart Property Automation");
    }

    return Object.keys(set);
  }

  function label(map, value) {
    return map[value] || value;
  }

  var PROPERTY_TYPE_LABELS = {
    residential: "Residential (primary home)",
    rental: "Rental or managed property",
    cottage: "Cottage / seasonal property",
    commercial: "Commercial property",
    other: "Other"
  };

  var SETTING_LABELS = { urban: "Urban", suburban: "Suburban", rural: "Rural" };

  var BUDGET_LABELS = {
    "not-sure": "Not sure yet",
    modest: "Modest / starter setup",
    mid: "Mid-range",
    comprehensive: "Comprehensive",
    "prefer-not-say": "Prefer not to say"
  };

  var FEATURE_LABELS = {
    driveway: "Driveway",
    "long-driveway": "Long / rural driveway",
    garage: "Garage",
    gate: "Gate(s)",
    fencing: "Fencing",
    outbuildings: "Outbuildings / detached garage",
    pets: "Pets on the property"
  };

  var CURRENT_LABELS = {
    cameras: "Cameras",
    alarm: "Alarm system",
    lighting: "Exterior lighting",
    "access-control": "Access control / smart locks",
    none: "None yet"
  };

  var CONCERN_LABELS = {
    "break-ins": "Break-ins / intrusion",
    "package-theft": "Package theft",
    water: "Water / environmental damage",
    "fire-co": "Fire / CO safety",
    perimeter: "Perimeter / trespassing",
    "pet-safety": "Pet safety / containment",
    "away-monitoring": "Monitoring while away"
  };

  var AUTOMATION_LABELS = {
    lighting: "Automated lighting",
    locks: "Smart locks",
    notifications: "Owner notifications",
    recording: "Automatic camera recording",
    "pet-alerts": "Pet boundary alerts"
  };

  function listOrNone(values, map) {
    if (!values.length) return "None selected";
    return values.map(function (v) { return label(map, v); }).join(", ");
  }

  function renderOutput(container, answers) {
    var layers = buildRecommendedLayers(answers);
    var categories = buildSuggestedCategories(answers);

    var html = "";

    html += '<div class="concierge-summary" style="margin-bottom:1.25rem;"><dl>';
    html += "<dt>Property type</dt><dd>" + label(PROPERTY_TYPE_LABELS, answers.propertyType) + "</dd>";
    html += "<dt>Setting</dt><dd>" + label(SETTING_LABELS, answers.setting) + "</dd>";
    html += "<dt>Entrances</dt><dd>" + (answers.entrances || "—") + "</dd>";
    html += "<dt>Features</dt><dd>" + listOrNone(answers.features, FEATURE_LABELS) + "</dd>";
    html += "<dt>Current technology</dt><dd>" + listOrNone(answers.current, CURRENT_LABELS) + "</dd>";
    html += "<dt>Major concerns</dt><dd>" + listOrNone(answers.concerns, CONCERN_LABELS) + "</dd>";
    html += "<dt>Desired automation</dt><dd>" + listOrNone(answers.automation, AUTOMATION_LABELS) + "</dd>";
    html += "<dt>Budget range noted</dt><dd>" + label(BUDGET_LABELS, answers.budget) + " (not a quote)</dd>";
    html += "</dl></div>";

    html += "<h3 style=\"font-size:0.95rem;\">Recommended layers (of DEF's 7-layer model)</h3>";
    html += '<div class="layers" style="margin-bottom:1.25rem;">';
    layers.forEach(function (n) {
      var info = LAYER_INFO[n];
      html +=
        '<div class="layer-row"><span class="layer-num is-fixed" aria-hidden="true">' +
        n +
        '</span><div><h3>' + info.name + '</h3><p>' + info.desc + '</p></div></div>';
    });
    html += "</div>";

    html += "<h3 style=\"font-size:0.95rem;\">Technology categories worth exploring</h3>";
    html += '<div class="chip-list" style="margin-bottom:1.25rem;">';
    if (categories.length) {
      categories.forEach(function (c) {
        html += '<span class="chip">' + c + "</span>";
      });
    } else {
      html += '<span class="chip">No specific category stood out from these answers</span>';
    }
    html += "</div>";

    html +=
      '<div class="notice notice-accent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" /></svg>' +
      '<p style="margin:0;"><strong>This profile is simulated.</strong> It was generated by a small set of if/else rules in this page\'s own JavaScript, run only against the answers above — nothing was sent anywhere, no professional assessed this property, and no price, schedule, or installation availability is implied. See the <a href="security.html">Security</a> and <a href="smart-property.html">Smart Property</a> pages for what each category actually means.</p></div>';

    container.innerHTML = html;
  }

  function initAssessment() {
    var form = document.getElementById("assessmentForm");
    if (!form) return;

    var steps = Array.prototype.slice.call(form.querySelectorAll(".assess-step"));
    var backBtn = form.querySelector("[data-assess-back]");
    var nextBtn = form.querySelector("[data-assess-next]");
    var submitBtn = form.querySelector("[data-assess-submit]");
    var fill = document.querySelector("[data-progress-fill]");
    var progressEl = document.querySelector("[data-progress]");
    var successPanel = document.getElementById("assessment-success");
    var outputEl = document.getElementById("assessmentOutput");
    var formCard = form.closest(".form-card");

    var current = 1;

    function showStep(n) {
      steps.forEach(function (step) {
        step.hidden = Number(step.dataset.step) !== n;
      });
      backBtn.hidden = n === 1;
      nextBtn.hidden = n === TOTAL_STEPS;
      submitBtn.hidden = n !== TOTAL_STEPS;
      var pct = Math.round((n / TOTAL_STEPS) * 100);
      if (fill) fill.style.width = pct + "%";
      if (progressEl) progressEl.setAttribute("aria-valuenow", String(pct));
      var heading = steps[n - 1].querySelector("h3");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    }

    backBtn.addEventListener("click", function () {
      if (current > 1) {
        current -= 1;
        showStep(current);
      }
    });

    nextBtn.addEventListener("click", function () {
      if (current < TOTAL_STEPS) {
        current += 1;
        showStep(current);
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameField = form.elements["name"];
      var emailField = form.elements["email"];
      var valid = true;

      [nameField, emailField].forEach(function (field) {
        var row = field.closest(".form-row");
        if (field.value.trim() === "") {
          row.classList.add("has-error");
          valid = false;
        } else {
          row.classList.remove("has-error");
        }
      });

      var emailVal = emailField.value.trim();
      if (emailVal !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        emailField.closest(".form-row").classList.add("has-error");
        valid = false;
      }

      if (!valid) {
        var firstErr = form.querySelector(".has-error input");
        if (firstErr) firstErr.focus();
        return;
      }

      var answers = {
        propertyType: val(form, "propertyType"),
        propertyStyle: val(form, "propertyStyle"),
        propertySize: val(form, "propertySize"),
        setting: val(form, "setting"),
        entrances: val(form, "entrances"),
        features: checked(form, "features"),
        current: checked(form, "current"),
        concerns: checked(form, "concerns"),
        automation: checked(form, "automation"),
        budget: val(form, "budget"),
        name: val(form, "name"),
        email: val(form, "email")
      };

      renderOutput(outputEl, answers);

      if (formCard) {
        var heading = formCard.querySelector("h2");
        if (heading) heading.parentNode.style.display = "none";
      }
      form.style.display = "none";
      var pm = document.querySelector(".progress-meter");
      if (pm) pm.style.display = "none";
      successPanel.classList.add("is-visible");
      successPanel.setAttribute("tabindex", "-1");
      successPanel.focus();
    });

    var resetBtn = document.querySelector("[data-assess-reset]");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        form.style.display = "";
        var pm = document.querySelector(".progress-meter");
        if (pm) pm.style.display = "";
        successPanel.classList.remove("is-visible");
        var intro = document.querySelector(".form-card > p.footer-note");
        if (intro) intro.parentNode.style.display = "";
        current = 1;
        showStep(current);
        form.querySelector("h3").focus();
      });
    }

    showStep(current);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAssessment);
  } else {
    initAssessment();
  }
})();
