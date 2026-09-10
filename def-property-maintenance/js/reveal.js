/*
 * DEF Property Maintenance — prototype
 * Scroll-triggered reveal animation. Pure vanilla JS + IntersectionObserver,
 * no libraries, no network calls. Fades/slides sections, service cards, and
 * the customer-journey / lead-flow steps into view as the visitor scrolls,
 * with a light stagger so grouped items (a card grid, the journey diagram)
 * "build" in sequence rather than popping in all at once.
 *
 * Progressive enhancement by design:
 *   - No JS at all → every element is simply visible (see .reveal in
 *     css/style.css — the hidden/animated state only exists there inside a
 *     "prefers-reduced-motion: no-preference" query).
 *   - prefers-reduced-motion: reduce → this script does nothing at all.
 *   - No IntersectionObserver support → elements are marked visible
 *     immediately instead of left hidden.
 */
(function () {
  "use strict";

  // Elements revealed as a staggered group, keyed by their shared parent
  // (each parent's matching children are numbered 0, 1, 2… independently).
  var GROUP_SELECTORS = [
    ".card-grid > *",
    ".journey-step",
    ".leadflow-step",
    ".compare-grid > *",
    ".contact-grid > *",
    ".split > *"
  ];

  // Elements revealed individually, no stagger needed.
  var SINGLE_SELECTORS = [
    ".section-head",
    ".form-card",
    ".concierge",
    ".map-placeholder",
    ".notice",
    ".status-key",
    ".service-detail"
  ];

  var STEP_DELAY_MS = 70;
  var MAX_STEP_INDEX = 7;

  function prefersReducedMotion() {
    return !!(
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  // The Demo AI Concierge renders its own chat content dynamically; leave
  // that alone rather than trying to reveal chat bubbles that don't exist
  // yet at page load (the widget's own container is still revealed as a
  // whole via SINGLE_SELECTORS' ".concierge" entry).
  function isInsideConcierge(el) {
    return !!(el.closest && el.closest(".concierge"));
  }

  function markElement(el, delayMs) {
    if (el.classList.contains("reveal")) {
      return false;
    }
    el.classList.add("reveal");
    if (delayMs) {
      el.style.setProperty("--reveal-delay", delayMs + "ms");
    }
    return true;
  }

  function collectTargets() {
    var targets = [];

    GROUP_SELECTORS.forEach(function (selector) {
      var indexByParent = new Map();
      document.querySelectorAll(selector).forEach(function (el) {
        if (isInsideConcierge(el)) {
          return;
        }
        var parent = el.parentElement;
        if (!parent) {
          return;
        }
        var index = indexByParent.get(parent) || 0;
        var delay = Math.min(index, MAX_STEP_INDEX) * STEP_DELAY_MS;
        if (markElement(el, delay)) {
          targets.push(el);
        }
        indexByParent.set(parent, index + 1);
      });
    });

    SINGLE_SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (isInsideConcierge(el)) {
          return;
        }
        if (markElement(el, 0)) {
          targets.push(el);
        }
      });
    });

    return targets;
  }

  function init() {
    if (prefersReducedMotion()) {
      // Nothing to do: .reveal elements are already fully visible by
      // default whenever this media query does not resolve to "no-preference".
      return;
    }

    var targets = collectTargets();
    if (!targets.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
