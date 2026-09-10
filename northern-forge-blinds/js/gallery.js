/*
 * Northern Forge — prototype site
 * gallery.js: category filter tabs for the placeholder project gallery on
 * projects.html. Pure client-side show/hide, no network calls. Every tile
 * this filters is placeholder/concept art, never real project photography —
 * see the "Placeholder" tag and alt text on each tile.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var tabs = document.querySelectorAll("[data-filter-tab]");
    var tiles = document.querySelectorAll("[data-tile-category]");
    if (!tabs.length || !tiles.length) return;

    function applyFilter(category) {
      tiles.forEach(function (tile) {
        var match = category === "all" || tile.getAttribute("data-tile-category") === category;
        tile.hidden = !match;
      });
      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute("data-filter-tab") === category;
        tab.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        applyFilter(tab.getAttribute("data-filter-tab"));
      });
    });

    applyFilter("all");
  });
})();
