/*
 * DEF Property Maintenance & Security — prototype
 * "DEF AI Property Concierge" — a scripted, decision-tree chat experience.
 *
 * IMPORTANT: this is NOT a real AI. There is no model, no API call, and no
 * network request anywhere in this file — every assistant line below is a
 * hard-coded string, and every branch is a fixed lookup table keyed off the
 * same maintenance + security/technology categories and status badges used
 * elsewhere on this site. The free-text "Property Profile" step runs a
 * small fixed keyword-matching function (parsePropertyDescription) over
 * whatever the visitor typed — never a model call — to fill in traits like
 * rural/driveway/pets/garage and suggest relevant technology categories. It
 * exists purely to demonstrate the *shape* of an AI-guided intake flow for
 * feedback, and is explicitly labeled "simulated" everywhere it appears.
 *
 * Guardrails enforced everywhere in this file (do not remove if extending):
 *   - Never state or imply a service or technology category is bookable,
 *     installed, or active — always reflect its real badge status
 *     (Potential / Coming Soon / TBC / Technology Showcase / Assessment
 *     Required).
 *   - Never invent a price, quote, or estimate.
 *   - Never promise a response time, appointment, schedule, or 24/7 /
 *     emergency response.
 *   - Never state or imply DEF is licensed, bonded, insured, certified, a
 *     security guard company, or a professional monitoring company.
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
    { id: "vendor-coordination", name: "Vendor Coordination", status: "tbc", statusLabel: "Availability TBC" },
    { id: "video-surveillance", name: "Video Surveillance", status: "showcase", statusLabel: "Technology Showcase", href: "security.html#video-surveillance" },
    { id: "motion-detection", name: "Motion Detection", status: "showcase", statusLabel: "Technology Showcase", href: "security.html#motion-detection" },
    { id: "perimeter-sensing", name: "Ground / Perimeter Sensing", status: "assessment", statusLabel: "Assessment Required", href: "security.html#perimeter-sensing" },
    { id: "door-window-protection", name: "Door & Window Protection", status: "showcase", statusLabel: "Technology Showcase", href: "security.html#door-window-protection" },
    { id: "glass-break-detection", name: "Glass Break Detection", status: "showcase", statusLabel: "Technology Showcase", href: "security.html#glass-break-detection" },
    { id: "smart-access-control", name: "Smart Access Control", status: "showcase", statusLabel: "Technology Showcase", href: "security.html#smart-access-control" },
    { id: "video-doorbells", name: "Video Doorbells", status: "showcase", statusLabel: "Technology Showcase", href: "security.html#video-doorbells" },
    { id: "smart-lighting-security", name: "Smart Lighting Security", status: "showcase", statusLabel: "Technology Showcase", href: "security.html#smart-lighting-security" },
    { id: "environmental-protection", name: "Environmental Protection", status: "showcase", statusLabel: "Technology Showcase", href: "smart-property.html#environmental-protection" },
    { id: "pet-property-safety", name: "Pet & Property Safety", status: "showcase", statusLabel: "Technology Showcase", href: "smart-property.html#pet-property-safety" }
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
    },
    showcase: function (name) {
      return name + " is a <strong>Technology Showcase</strong> — an illustration of what DEF could eventually assess, install, or coordinate, not something currently sold, installed, or monitored. DEF is not a licensed security company.";
    },
    assessment: function (name) {
      return name + " is marked <strong>Assessment Required</strong> — it's too site-specific to describe generically, so it would need an actual visit before anything could be said about it.";
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
      "<h2>DEF AI Property Concierge</h2>" +
      '<span class="badge badge-showcase">Simulated — not a live AI service</span>' +
      "</div>";
    root.appendChild(header);

    var disclaimer = document.createElement("div");
    disclaimer.className = "notice notice-accent concierge-disclaimer";
    disclaimer.innerHTML =
      INFO_ICON +
      '<p style="margin:0;">This concierge is <strong>scripted for this prototype</strong> — it is not ' +
      "connected to a real AI service, model, or API. The free-text \"Property Profile\" step below uses " +
      "simple keyword matching on your own words, run entirely in your browser. It will never invent service " +
      "availability, quote a price, promise a schedule, or claim DEF is licensed/insured/a monitoring company, " +
      "and nothing you type here is sent, saved, or transmitted anywhere.</p>";
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

    var state = { answers: {}, profile: {} };

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
            "Now, in your own words — tell me a bit about the property. For example: “I have a rural property with a long driveway, two dogs, a detached garage and no existing security system.”",
            stepFreeText
          );
        }
      );
    }

    // Very small, fixed keyword-matching function — NOT a real NLP/AI model.
    // It only ever looks for a short fixed list of substrings in the
    // visitor's own text and sets booleans on a "profile" object. It never
    // sends the text anywhere, and it never invents a fact the visitor
    // didn't type.
    function parsePropertyDescription(text) {
      var t = (text || "").toLowerCase();
      var has = function (words) {
        return words.some(function (w) {
          return t.indexOf(w) > -1;
        });
      };
      return {
        rural: has(["rural", "farm", "acreage", "acres", "countryside", "no neighbours", "no neighbors"]),
        longDriveway: has(["long driveway", "driveway"]),
        detachedGarage: has(["detached garage", "garage"]),
        pets: has(["dog", "dogs", "cat", "cats", "pet", "pets"]),
        noSecurity: has(["no security", "no alarm", "no existing security", "nothing installed", "no cameras"]),
        gate: has(["gate", "gated"]),
        fencing: has(["fence", "fenced", "fencing"]),
        water: has(["basement", "sump", "well", "flood", "leak"]),
        cottage: has(["cottage", "cabin", "seasonal", "vacation home"]),
        multipleEntrances: has(["multiple doors", "several entrances", "side door", "back door"])
      };
    }

    function stepFreeText() {
      renderTextStep(
        {
          id: "free-description",
          type: "textarea",
          label: "Describe the property (optional — skip if you'd rather not)",
          required: false,
          placeholder: "e.g. Rural property, long driveway, two dogs, detached garage, no existing security system…",
          submitLabel: "Continue",
          errorText: ""
        },
        function (value) {
          state.answers.freeDescription = value;
          state.profile = parsePropertyDescription(value);
          if (value) {
            addMessage("visitor", value, true);
          } else {
            addMessage("visitor", "(skipped)", true);
          }
          stepFollowUp();
        }
      );
    }

    // At most one or two intelligent follow-ups, only for details the free
    // text didn't already cover — never re-asking something already known.
    function stepFollowUp() {
      var p = state.profile || {};
      if (!("noSecurity" in state.answers)) {
        if (p.noSecurity) {
          state.answers.hasExistingSecurity = "No — nothing installed yet";
          return stepFollowUpPriority();
        }
        return renderChoices(
          [
            { label: "Yes, some security is already in place" },
            { label: "No, nothing is installed yet" },
            { label: "Not sure" }
          ],
          function (choice) {
            state.answers.hasExistingSecurity = choice.label;
            addMessage("visitor", choice.label, true);
            addAssistant("Understood — does the property currently have any existing security system?", function () {
              stepFollowUpPriority();
            });
          }
        );
      }
      stepFollowUpPriority();
    }

    function stepFollowUpPriority() {
      addAssistant("Got it. One more thing — what's the biggest priority: the perimeter/outside of the property, the entry points, or keeping an eye on things while you're away?", function () {
        renderChoices(
          [
            { label: "Perimeter / outside the property" },
            { label: "Entry points (doors, windows, garage)" },
            { label: "Monitoring while away" },
            { label: "Not sure yet" }
          ],
          function (choice) {
            state.answers.priority = choice.label;
            addMessage("visitor", choice.label, true);
            stepProfileSummary();
          }
        );
      });
    }

    function suggestedCategoriesFromProfile() {
      var p = state.profile || {};
      var names = [];
      function add(n) {
        if (names.indexOf(n) === -1) names.push(n);
      }
      if (p.rural || p.longDriveway || p.gate || p.fencing) add("Ground / Perimeter Sensing");
      if (p.detachedGarage || p.gate) add("Smart Access Control");
      if (p.noSecurity || state.answers.hasExistingSecurity === "No — nothing installed yet") {
        add("Video Surveillance");
        add("Motion Detection");
      }
      if (p.pets) add("Pet & Property Safety");
      if (p.water) add("Environmental Protection");
      if (state.answers.priority === "Perimeter / outside the property") add("Smart Lighting Security");
      if (state.answers.priority === "Monitoring while away") add("Video Doorbells");
      if (!names.length) add("Door & Window Protection");
      return names;
    }

    function stepProfileSummary() {
      var p = state.profile || {};
      var traits = [];
      if (p.rural) traits.push("Rural property");
      if (p.longDriveway) traits.push("Long driveway");
      if (p.detachedGarage) traits.push("Detached garage");
      if (p.pets) traits.push("Pets on the property");
      if (p.gate || p.fencing) traits.push("Perimeter features (gate/fencing)");
      if (p.water) traits.push("Environmental considerations (basement/water)");
      if (p.cottage) traits.push("Seasonal / cottage property");
      if (!traits.length) traits.push("No specific property traits detected from your description");

      var suggestions = suggestedCategoriesFromProfile();

      var wrap = document.createElement("div");
      wrap.className = "concierge-summary";
      var title = document.createElement("p");
      title.innerHTML = '<strong>Property Profile</strong> <span class="badge badge-showcase">Simulated</span>';
      title.style.marginBottom = "0.5rem";
      wrap.appendChild(title);

      var list = document.createElement("dl");
      var dt1 = document.createElement("dt");
      dt1.textContent = "Detected traits";
      var dd1 = document.createElement("dd");
      dd1.textContent = traits.join(" · ");
      var dt2 = document.createElement("dt");
      dt2.textContent = "Existing security";
      var dd2 = document.createElement("dd");
      dd2.textContent = state.answers.hasExistingSecurity || "Not stated";
      var dt3 = document.createElement("dt");
      dt3.textContent = "Stated priority";
      var dd3 = document.createElement("dd");
      dd3.textContent = state.answers.priority || "Not stated";
      list.appendChild(dt1); list.appendChild(dd1);
      list.appendChild(dt2); list.appendChild(dd2);
      list.appendChild(dt3); list.appendChild(dd3);
      wrap.appendChild(list);

      var chipsLabel = document.createElement("p");
      chipsLabel.style.marginTop = "0.75rem";
      chipsLabel.style.marginBottom = "0.25rem";
      chipsLabel.innerHTML = "<strong>Technology categories worth exploring:</strong>";
      wrap.appendChild(chipsLabel);

      var chips = document.createElement("div");
      chips.className = "chip-list";
      suggestions.forEach(function (name) {
        var chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = name;
        chips.appendChild(chip);
      });
      wrap.appendChild(chips);

      addMessageNode("assistant", wrap);
      state.answers.suggestedCategories = suggestions;

      addAssistant(
        "This Property Profile is <strong>simulated</strong> — built from simple keyword matching on what you typed, run entirely in your browser. It's not a real assessment, it doesn't imply a live AI backend, and it never invents a price, a schedule, or an installation promise. Now — which service are you interested in? These use the same categories and honest statuses shown across the site.",
        stepCategory
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
      if (state.answers.freeDescription) {
        noteParts.push("Property description: " + state.answers.freeDescription);
      }
      if (state.answers.hasExistingSecurity) {
        noteParts.push("Existing security: " + state.answers.hasExistingSecurity + ".");
      }
      if (state.answers.priority) {
        noteParts.push("Priority: " + state.answers.priority + ".");
      }
      if (state.answers.suggestedCategories && state.answers.suggestedCategories.length) {
        noteParts.push("Concierge-suggested categories (simulated): " + state.answers.suggestedCategories.join(", ") + ".");
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
        ["Existing security", state.answers.hasExistingSecurity],
        ["Stated priority", state.answers.priority],
        [
          "Suggested categories",
          state.answers.suggestedCategories && state.answers.suggestedCategories.length
            ? state.answers.suggestedCategories.join(", ")
            : null
        ],
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
            state.profile = {};
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
