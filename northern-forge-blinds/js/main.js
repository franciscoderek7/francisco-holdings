/*
 * Northern Forge Blinds — prototype site
 * main.js: mobile nav toggle + current-page nav highlighting.
 * No network calls, no dependencies, no ES modules (safe for file://).
 */
(function () {
  "use strict";

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-nav-panel]");
    if (!toggle || !panel) return;

    function closeNav() {
      toggle.setAttribute("aria-expanded", "false");
      if (window.matchMedia("(max-width: 59.99em)").matches) {
        panel.hidden = true;
      }
    }

    function openNav() {
      toggle.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    }

    // Start collapsed on small screens, expanded (via CSS) on large screens.
    var mq = window.matchMedia("(min-width: 60em)");
    function syncForViewport() {
      if (mq.matches) {
        panel.hidden = false;
        toggle.setAttribute("aria-expanded", "false");
      } else {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
    }
    syncForViewport();
    if (mq.addEventListener) {
      mq.addEventListener("change", syncForViewport);
    } else if (mq.addListener) {
      mq.addListener(syncForViewport);
    }

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeNav();
      } else {
        openNav();
      }
    });

    panel.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (link && !mq.matches) {
        closeNav();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNav();
        toggle.focus();
      }
    });
  }

  function markCurrentPage() {
    var links = document.querySelectorAll("[data-nav-panel] a[href]");
    var here = (window.location.pathname.split("/").pop() || "index.html");
    links.forEach(function (link) {
      var target = link.getAttribute("href").split("/").pop();
      if (target === here || (here === "" && target === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    markCurrentPage();
  });
})();
