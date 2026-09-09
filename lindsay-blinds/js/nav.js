/*
 * Lindsay Blinds prototype — shared site chrome behaviour.
 * Mobile hamburger nav (keyboard accessible) + active-link marking.
 * No network calls. No data collection.
 */
(function () {
  "use strict";

  function initNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");
    var backdrop = document.getElementById("navBackdrop");

    if (!toggle || !nav) return;

    function openNav() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      if (backdrop) backdrop.classList.add("is-open");
      var firstLink = nav.querySelector("a");
      if (firstLink) firstLink.focus();
    }

    function closeNav(returnFocus) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      if (backdrop) backdrop.classList.remove("is-open");
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeNav(false);
      } else {
        openNav();
      }
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        closeNav(true);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNav(true);
      }
    });

    nav.addEventListener("click", function (event) {
      var target = event.target;
      if (target && target.tagName === "A" && window.matchMedia("(max-width: 899px)").matches) {
        closeNav(false);
      }
    });

    // Collapse mobile nav automatically if the viewport grows past the
    // breakpoint while it is open, so state never gets stuck.
    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 900px)").matches) {
        closeNav(false);
      }
    });
  }

  function markActiveLink() {
    var current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (current === "") current = "index.html";
    var links = document.querySelectorAll(".primary-nav a, .footer-nav a");
    links.forEach(function (link) {
      var href = (link.getAttribute("href") || "").toLowerCase();
      if (href === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    markActiveLink();
  });
})();
