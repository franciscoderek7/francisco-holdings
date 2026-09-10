/*
 * Northern Forge Windows, Blinds & Doors — prototype site
 * reveal.js: scroll-triggered reveal animations + a contained, rAF-throttled
 * hero parallax accent. Vanilla JS only, no dependencies, no network calls,
 * safe for file:// (no ES modules). Shared by every page.
 *
 * Behaviour is entirely additive: if IntersectionObserver is unavailable, or
 * the visitor has requested reduced motion, everything is simply shown with
 * no animation and no scroll listeners are attached.
 */
(function () {
  "use strict";

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    reduceMotion = false;
  }

  // ---------------------------------------------------------------------
  // 1. Scroll-triggered reveal (fade + slide) for sections/cards/tiles.
  // ---------------------------------------------------------------------
  function initReveal() {
    var selector = [
      ".section-head",
      ".section .hero__grid > *",
      ".card-grid > *",
      ".compare-grid > *",
      ".arch-flow__step",
      ".steps > *",
      ".concierge",
      ".tech-grid > *",
      ".filter-tabs"
    ].join(",");

    var els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      // No motion, or no observer support: just make sure everything is
      // visible immediately. Nothing to animate, nothing to attach.
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  // ---------------------------------------------------------------------
  // 2. One-time "sweep" highlight across the angled section dividers as
  //    each one scrolls into view. Purely decorative, does not move or
  //    resize the divider itself, so it can't introduce seams/overflow.
  // ---------------------------------------------------------------------
  function initDividerSweep() {
    var dividers = document.querySelectorAll(".divider");
    if (!dividers.length || reduceMotion || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("divider--sweep");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    dividers.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---------------------------------------------------------------------
  // 3. Contained, rAF-throttled parallax accent on the homepage hero's
  //    background layer only. Capped magnitude, passive listener, purely
  //    decorative (background gradient behind overflow:hidden hero) so it
  //    cannot affect layout, cause overflow, or block interaction.
  // ---------------------------------------------------------------------
  function initHeroParallax() {
    var hero = document.querySelector(".hero");
    if (!hero || reduceMotion) return;

    var ticking = false;

    function update() {
      var rect = hero.getBoundingClientRect();
      // Only meaningful while the hero is on screen; cheap to compute.
      var shift = rect.top * -0.06;
      if (shift < -24) shift = -24;
      if (shift > 24) shift = 24;
      hero.style.setProperty("--nf-parallax", shift.toFixed(1) + "px");
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  function init() {
    initReveal();
    initDividerSweep();
    initHeroParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
