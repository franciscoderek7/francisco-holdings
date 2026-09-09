/*
 * DEF Property Maintenance — prototype
 * "Demo AI Concierge" — a scripted, decision-tree chat experience.
 *
 * IMPORTANT: this is NOT a real AI. There is no model, no API call, and no
 * network request anywhere in this file — every assistant line below is a
 * hard-coded string, and every branch is a fixed lookup table keyed off the
 * same seven service categories and status badges used elsewhere on this
 * site. It exists purely to demonstrate the *shape* of an AI-guided intake
 * flow for feedback.
 *
 * Guardrails enforced everywhere in this file (do not remove if extending):
 *   - Never state or imply a service category is bookable/active — always
 *     reflect its real badge status (Potential / Coming Soon / TBC).
 *   - Never invent a price, quote, or estimate.
 *   - Never promise a response time, appointment, or schedule.
 *   - Never send, store, or transmit anything the visitor types. The only
 *     "hand-off" is a same-site link with the answers in the URL, read back
 *     by js/forms.js on request-service.html to prefill that page's form.
 */
(function () {
  "use strict";

  var CATEGORIES = [
    { id: "property-maintenance", name: "Property Maintenance", status: "tbc", statusLabel: "Availability TBC" },
    { id: "seasonal-property-care", name: "Seasonal Property Care", status: "coming-soon", statusLabel: "Coming Soon" },
    { id: "small-repairs", name: "Small Repairs", status: "potential", statusLabel: "Potential Service" },
    { id: "exterior-maintenance", name: "Exterior Maintenance", status: "potential", statusLabel: "Potential Service" },
    { id: "cottage-property-services", name: "Cottage / Property Services", status: "coming-soon", statusLabel: "Coming Soon" },
    { id: "turnover-services", name: "Turnover Services", status: "potential", statusLabel: "Potential Service" },
    { id: "vendor-coordination", name: "Vendor Coordination", status: "tbc", statusLabel: "Availability TBC" }
  ];

  var STATUS_RESPONSES = {
    potential: function (name) {
      return name + " is shown as a <strong>Potential Service</strong> in this prototype — an idea under consideration, not yet planned for launch. I can still note your interest so Dylan sees the demand.";
    },
    "coming-soon": function (name) {
      return name + " is marked <strong>Coming Soon</strong> — planned for future activation, but it isn't bookable yet. I can capture your interest now for when it goes live.";
    },
    tbc: function (name) {
      return name + "'s availability is <strong>To Be Confirmed</strong> — Dylan hasn't decided whether or when this will be offered. I'll note it either way.";
    }
  };

  var PROPERTY_TYPES = [
    "Primary residence",
    "Rental or managed property",
    "Cottage or seasonal property",
    "Commercial property",
    "Other"
  ];

  var URGENCIES = [
    "Emergency — needs attention right away",
    "Soon — within the next few weeks",
    "Flexible — no rush",
    "Just exploring ideas"
  ];

  var SIM_DELAY = 500;
  var instanceCount = 0;

  var BOT_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="4" y="5" width="16" height="12" rx="3" /><path d="M9 10h.01M15 10h.01" /><path d="M8 17v2M16 17v2" /><path d="M12 3v2" />' +
    "</svg>";

  var INFO_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />' +
    "</svg>";

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function initConcierge(root) {
    instanceCount += 1;
    var uid = "cc" + instanceCount;

    root.innerHTML = "";
    root.classList.add("concierge-ready");

    var header = document.createElement("div");
    header.className = "concierge-header";
    header.innerHTML =
      '<span class="concierge-icon" aria-hidden="true">' + BOT_ICON + "</span>" +
      "<div>" +
      "<h2>Demo AI Concierge</h2>" +
      '<span class="badge badge-tbc">Simulated — not a live AI service</span>' +
      "</div>";
    root.appendChild(header);

    var disclaimer = document.createElement("div");
    disclaimer.className = "notice notice-accent concierge-disclaimer";
    disclaimer.innerHTML =
      INFO_ICON +
      '<p style="margin:0;">This concierge is <strong>scripted for this prototype</strong> — it is not ' +
      "connected to a real AI service. It will never invent service availability, quote a price, or promise " +
      "a schedule, and nothing you type here is sent, saved, or transmitted anywhere.</p>";
    root.appendChild(disclaimer);

    var log = document.createElement("div");
    log.className = "concierge-log";
    log.setAttribute("role", "log");
    log.setAttribute("aria-live", "polite");
    log.setAttribute("aria-label", "Concierge conversation");
    root.appendChild(log);

    var inputArea = document.createElement("div");
    inputArea.className = "concierge-input-area";
    root.appendChild(inputArea);

    var state = { answers: {} };

    function scrollLog() {
      log.scrollTop = log.scrollHeight;
    }

    function addMessage(role, content, isPlainText) {
      var msg = document.createElement("div");
      msg.className = "concierge-msg concierge-msg-" + role;
      var bubble = document.createElement("div");
      bubble.className = "concierge-bubble";
      if (isPlainText) {
        bubble.textContent = content;
      } else {
        bubble.innerHTML = content;
      }
      msg.appendChild(bubble);
      log.appendChild(msg);
      scrollLog();
      return msg;
    }

    function addMessageNode(role, node) {
      var msg = document.createElement("div");
      msg.className = "concierge-msg concierge-msg-" + role;
      var bubble = document.createElement("div");
      bubble.className = "concierge-bubble";
      bubble.appendChild(node);
      msg.appendChild(bubble);
      log.appendChild(msg);
      scrollLog();
    }

    function addAssistant(html, then) {
      var typing = document.createElement("div");
      typing.className = "concierge-msg concierge-msg-assistant concierge-typing";
      typing.innerHTML =
        '<div class="concierge-bubble concierge-dots" aria-hidden="true"><span></span><span></span><span></span></div>';
      log.appendChild(typing);
      scrollLog();
      window.setTimeout(function () {
        if (typing.parentNode) {
          typing.parentNode.removeChild(typing);
        }
        addMessage("assistant", html, false);
        if (then) {
          then();
        }
      }, SIM_DELAY);
    }

    function clearInputArea() {
      inputArea.innerHTML = "";
    }

    function focusFirst() {
      var el = inputArea.querySelector("button, input, textarea, select, a[href]");
      if (el) {
        el.focus();
      }
    }

    function renderChoices(choices, onPick) {
      clearInputArea();
      var wrap = document.createElement("div");
      wrap.className = "concierge-choices";
      choices.forEach(function (choice) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "concierge-choice";
        btn.innerHTML = choice.html || escapeHtml(choice.label);
        btn.addEventListener("click", function () {
          onPick(choice);
        });
        wrap.appendChild(btn);
      });
      inputArea.appendChild(wrap);
      focusFirst();
    }

    function renderTextStep(opts, onSubmit) {
      clearInputArea();
      var form = document.createElement("form");
      form.className = "concierge-form";
      form.noValidate = true;

      var row = document.createElement("div");
      row.className = "form-row";

      var fieldId = uid + "-" + opts.id;
      var label = document.createElement("label");
      label.setAttribute("for", fieldId);
      label.textContent = opts.label;
      row.appendChild(label);

      var field;
      if (opts.type === "textarea") {
        field = document.createElement("textarea");
        field.rows = 3;
      } else {
        field = document.createElement("input");
        field.type = opts.type || "text";
      }
      field.id = fieldId;
      field.name = opts.id;
      if (opts.placeholder) {
        field.placeholder = opts.placeholder;
      }
      if (opts.required) {
        field.required = true;
      }
      row.appendChild(field);

      var error = document.createElement("p");
      error.className = "error-text";
      error.setAttribute("role", "alert");
      error.textContent = opts.errorText || "Please fill in this field.";
      row.appendChild(error);

      form.appendChild(row);

      var submit = document.createElement("button");
      submit.type = "submit";
      submit.className = "btn btn-primary concierge-submit";
      submit.textContent = opts.submitLabel || "Continue";
      form.appendChild(submit);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var value = field.value.trim();
        if (opts.required && value === "") {
          row.classList.add("has-error");
          field.focus();
          return;
        }
        row.classList.remove("has-error");
        onSubmit(value);
      });

      inputArea.appendChild(form);
      focusFirst();
    }

    function stepStart() {
      clearInputArea();
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-primary";
      btn.textContent = "Start the demo conversation";
      btn.addEventListener("click", function () {
        addMessage("visitor", "I need help maintaining my property.", true);
        addAssistant("Absolutely. What type of property do you need help with?", stepPropertyType);
      });
      inputArea.appendChild(btn);
    }

    function stepPropertyType() {
      renderChoices(
        PROPERTY_TYPES.map(function (t) {
          return { label: t };
        }),
        function (choice) {
          state.answers.propertyType = choice.label;
          addMessage("visitor", choice.label, true);
          addAssistant(
            "Thanks. Which service are you interested in? These are the same categories and honest statuses shown across this site.",
            stepCategory
          );
        }
      );
    }

    function stepCategory() {
      var choices = CATEGORIES.map(function (c) {
        return {
          label: c.name + " (" + c.statusLabel + ")",
          html:
            escapeHtml(c.name) +
            ' <span class="badge badge-' + c.status + '">' + escapeHtml(c.statusLabel) + "</span>",
          value: c
        };
      });
      choices.push({ label: "Not sure yet", value: null });

      renderChoices(choices, function (choice) {
        addMessage("visitor", choice.label, true);
        if (choice.value) {
          state.answers.categoryId = choice.value.id;
          state.answers.categoryName = choice.value.name;
          addAssistant(STATUS_RESPONSES[choice.value.status](choice.value.name), function () {
            addAssistant("Where is the property located? A town or area is fine.", stepLocation);
          });
        } else {
          state.answers.categoryId = "not-sure";
          state.answers.categoryName = "Not sure yet";
          addAssistant(
            "No problem — Dylan can help figure out the right fit once he reviews your details. I'll note this as unconfirmed for now.",
            function () {
              addAssistant("Where is the property located? A town or area is fine.", stepLocation);
            }
          );
        }
      });
    }

    function stepLocation() {
      renderTextStep(
        {
          id: "location",
          label: "Property location (town or area)",
          required: true,
          errorText: "Let me know roughly where the property is."
        },
        function (value) {
          state.answers.location = value;
          addMessage("visitor", value, true);
          addAssistant("Got it. How urgent is this for you?", stepUrgency);
        }
      );
    }

    function stepUrgency() {
      renderChoices(
        URGENCIES.map(function (u) {
          return { label: u };
        }),
        function (choice) {
          state.answers.urgency = choice.label;
          addMessage("visitor", choice.label, true);
          addAssistant(
            "Understood — just so it's clear, this demo can't make scheduling commitments or promise a response time, whatever the urgency.",
            function () {
              addAssistant("Tell me a little about the project — what's going on?", stepDetails);
            }
          );
        }
      );
    }

    function stepDetails() {
      renderTextStep(
        {
          id: "details",
          type: "textarea",
          label: "Project details",
          required: true,
          placeholder: "Describe what you're hoping to have looked at…",
          submitLabel: "Continue",
          errorText: "A short description helps Dylan understand the request."
        },
        function (value) {
          state.answers.details = value;
          addMessage("visitor", value, true);
          addAssistant("Last step — how can Dylan's team reach you about this?", stepContact);
        }
      );
    }

    function stepContact() {
      clearInputArea();
      var form = document.createElement("form");
      form.className = "concierge-form";
      form.noValidate = true;

      function makeRow(idSuffix, labelText, type, required) {
        var fieldId = uid + "-" + idSuffix;
        var row = document.createElement("div");
        row.className = "form-row";
        var lab = document.createElement("label");
        lab.setAttribute("for", fieldId);
        lab.innerHTML = escapeHtml(labelText) + (required ? ' <span class="required-mark">*</span>' : "");
        row.appendChild(lab);
        var field = document.createElement("input");
        field.type = type;
        field.id = fieldId;
        field.name = idSuffix;
        if (required) {
          field.required = true;
        }
        row.appendChild(field);
        var error = document.createElement("p");
        error.className = "error-text";
        error.setAttribute("role", "alert");
        error.textContent = type === "email" ? "Enter a valid email address." : "This field is required.";
        row.appendChild(error);
        form.appendChild(row);
        return { row: row, field: field };
      }

      var nameField = makeRow("name", "Your name", "text", true);
      var emailField = makeRow("email", "Email", "email", true);
      var phoneField = makeRow("phone", "Phone (optional)", "tel", false);

      var submit = document.createElement("button");
      submit.type = "submit";
      submit.className = "btn btn-primary concierge-submit";
      submit.textContent = "Review my request";
      form.appendChild(submit);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;

        [nameField, emailField].forEach(function (f) {
          if (f.field.value.trim() === "") {
            f.row.classList.add("has-error");
            valid = false;
          } else {
            f.row.classList.remove("has-error");
          }
        });

        var emailVal = emailField.field.value.trim();
        if (emailVal !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          emailField.row.classList.add("has-error");
          valid = false;
        }

        if (!valid) {
          var firstErr = form.querySelector(".has-error input");
          if (firstErr) {
            firstErr.focus();
          }
          return;
        }

        state.answers.name = nameField.field.value.trim();
        state.answers.email = emailField.field.value.trim();
        state.answers.phone = phoneField.field.value.trim();

        addMessage("visitor", state.answers.name + " · " + state.answers.email, true);
        addAssistant("Here's a summary of what you told me:", stepSummary);
      });

      inputArea.appendChild(form);
      focusFirst();
    }

    function buildRequestUrl() {
      var params = new URLSearchParams();
      if (state.answers.name) {
        params.set("full-name", state.answers.name);
      }
      if (state.answers.email) {
        params.set("email", state.answers.email);
      }
      if (state.answers.phone) {
        params.set("phone", state.answers.phone);
      }
      if (state.answers.location) {
        params.set("address", state.answers.location);
      }
      if (state.answers.categoryId && state.answers.categoryId !== "not-sure") {
        params.set("category", state.answers.categoryId);
      }
      var noteParts = [];
      if (state.answers.propertyType) {
        noteParts.push("Property type: " + state.answers.propertyType + ".");
      }
      if (state.answers.urgency) {
        noteParts.push("Urgency: " + state.answers.urgency + ".");
      }
      if (state.answers.details) {
        noteParts.push(state.answers.details);
      }
      if (noteParts.length) {
        params.set("notes", noteParts.join(" "));
      }
      var query = params.toString();
      return "request-service.html" + (query ? "?" + query : "") + "#request-form";
    }

    function stepSummary() {
      var list = document.createElement("dl");
      var rows = [
        ["Property type", state.answers.propertyType],
        ["Service interest", state.answers.categoryName],
        ["Location", state.answers.location],
        ["Urgency", state.answers.urgency],
        ["Details", state.answers.details],
        [
          "Contact",
          state.answers.name +
            " (" +
            state.answers.email +
            (state.answers.phone ? ", " + state.answers.phone : "") +
            ")"
        ]
      ];
      rows.forEach(function (r) {
        var dt = document.createElement("dt");
        dt.textContent = r[0];
        var dd = document.createElement("dd");
        dd.textContent = r[1] || "—";
        list.appendChild(dt);
        list.appendChild(dd);
      });
      var summaryWrap = document.createElement("div");
      summaryWrap.className = "concierge-summary";
      summaryWrap.appendChild(list);
      addMessageNode("assistant", summaryWrap);

      addAssistant(
        "This conversation is <strong>simulated</strong> for this prototype. Nothing you typed was sent, saved, " +
          "or transmitted anywhere, and no availability, price, or schedule was promised. In a real version, this " +
          "would hand off to Dylan's team as a new lead.",
        function () {
          clearInputArea();

          var link = document.createElement("a");
          link.className = "btn btn-primary concierge-submit";
          link.href = buildRequestUrl();
          link.textContent = "Continue to Quote Request →";
          inputArea.appendChild(link);

          var restart = document.createElement("button");
          restart.type = "button";
          restart.className = "btn btn-outline";
          restart.textContent = "Start over";
          restart.addEventListener("click", function () {
            log.innerHTML = "";
            state.answers = {};
            stepStart();
          });
          inputArea.appendChild(restart);

          focusFirst();
        }
      );
    }

    stepStart();
  }

  function init() {
    var roots = document.querySelectorAll("[data-concierge]");
    roots.forEach(function (root) {
      initConcierge(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
