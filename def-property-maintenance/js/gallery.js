/*
 * DEF Property Maintenance prototype — concept gallery tiles.
 * Generates CSS/SVG placeholder graphics only (no external images, no
 * photos of real work — DEF has no confirmed active services yet).
 * Structured so real project photography can later replace the <svg> in
 * each tile, once a category is actually active, without touching markup.
 */
(function () {
  "use strict";

  var PALETTES = [
    { bg: "#e6edef", accent: "#2c5951", line: "#16302c" },
    { bg: "#ece6d8", accent: "#b0602a", line: "#8a4a20" },
    { bg: "#dcefe2", accent: "#3d746a", line: "#1f423c" },
    { bg: "#f4e3cf", accent: "#b0602a", line: "#8a4a20" }
  ];

  var CONCEPTS = [
    { title: "Routine property check-in", category: "Property Maintenance", status: "badge-tbc", statusLabel: "Availability TBC", pattern: "checklist" },
    { title: "Cottage-season transition", category: "Seasonal Property Care", status: "badge-coming-soon", statusLabel: "Coming Soon", pattern: "seasonal" },
    { title: "Minor fix-it visit", category: "Small Repairs", status: "badge-potential", statusLabel: "Potential Service", pattern: "repair" },
    { title: "Exterior grounds upkeep", category: "Exterior Maintenance", status: "badge-potential", statusLabel: "Potential Service", pattern: "exterior" },
    { title: "Secondary-property visit", category: "Cottage / Property Services", status: "badge-coming-soon", statusLabel: "Coming Soon", pattern: "cottage" },
    { title: "Between-occupancy turnover", category: "Turnover Services", status: "badge-potential", statusLabel: "Potential Service", pattern: "turnover" },
    { title: "Multi-vendor coordination", category: "Vendor Coordination", status: "badge-tbc", statusLabel: "Availability TBC", pattern: "vendor" }
  ];

  function svgFor(pattern, palette) {
    var bg = palette.bg, accent = palette.accent, line = palette.line;
    var body = "";
    if (pattern === "checklist") {
      body =
        '<rect x="90" y="40" width="220" height="220" rx="10" fill="#fffaf3" stroke="' + line + '" stroke-width="4"/>' +
        '<g stroke="' + accent + '" stroke-width="8" stroke-linecap="round">' +
        '<line x1="120" y1="90" x2="280" y2="90"/><line x1="120" y1="130" x2="280" y2="130"/>' +
        '<line x1="120" y1="170" x2="240" y2="170"/>' +
        "</g>" +
        '<circle cx="105" cy="90" r="7" fill="' + accent + '"/><circle cx="105" cy="130" r="7" fill="' + accent + '"/><circle cx="105" cy="170" r="7" fill="none" stroke="' + accent + '" stroke-width="4"/>';
    } else if (pattern === "seasonal") {
      body =
        '<path d="M300 60C220 60 160 120 160 200c110 0 190-70 190-140Z" fill="none" stroke="' + accent + '" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M160 200 240 120" stroke="' + line + '" stroke-width="6" stroke-linecap="round"/>';
    } else if (pattern === "repair") {
      body =
        '<path d="M235 70a55 55 0 0 0-74 68L90 210v50h50l72-72a55 55 0 0 0 68-74l-40 40-29-29 40-40Z" fill="none" stroke="' + accent + '" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>';
    } else if (pattern === "exterior") {
      body =
        '<rect x="70" y="70" width="150" height="90" rx="6" fill="#fffaf3" stroke="' + line + '" stroke-width="4"/>' +
        '<path d="M110 160v60h60" stroke="' + accent + '" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<path d="M170 220h50a30 30 0 0 0 30-30v-60" stroke="' + accent + '" stroke-width="6" stroke-linecap="round" fill="none"/>';
    } else if (pattern === "cottage") {
      body =
        '<path d="M200 50 100 140h35l-60 90h75" stroke="' + accent + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
        '<path d="M200 50l100 90h-35l60 90h-75" stroke="' + line + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
        '<line x1="200" y1="230" x2="200" y2="270" stroke="' + accent + '" stroke-width="7" stroke-linecap="round"/>';
    } else if (pattern === "turnover") {
      body =
        '<path d="M110 180a90 90 0 0 1 154-64l26 26" stroke="' + accent + '" stroke-width="9" stroke-linecap="round" fill="none"/>' +
        '<path d="M290 92v45h-45" stroke="' + accent + '" stroke-width="9" stroke-linecap="round" fill="none"/>' +
        '<path d="M290 150a90 90 0 0 1-154 64l-26-26" stroke="' + line + '" stroke-width="9" stroke-linecap="round" fill="none"/>' +
        '<path d="M110 238v-45h45" stroke="' + line + '" stroke-width="9" stroke-linecap="round" fill="none"/>';
    } else {
      body =
        '<circle cx="130" cy="100" r="26" fill="none" stroke="' + accent + '" stroke-width="7"/>' +
        '<circle cx="270" cy="100" r="26" fill="none" stroke="' + accent + '" stroke-width="7"/>' +
        '<circle cx="200" cy="220" r="26" fill="none" stroke="' + line + '" stroke-width="7"/>' +
        '<path d="M130 126v40M270 126v40M170 205l40-40M230 205l-40-40" stroke="' + line + '" stroke-width="6" stroke-linecap="round"/>';
    }
    return (
      '<svg class="gallery-thumb" viewBox="0 0 400 300" role="img" aria-hidden="true" focusable="false">' +
      '<rect width="400" height="300" fill="' + bg + '"/>' +
      body +
      "</svg>"
    );
  }

  function buildTile(concept, index) {
    var palette = PALETTES[index % PALETTES.length];
    var altText =
      "Concept illustration only — not a photo of completed work. Category: " +
      concept.category + ". Status: " + concept.statusLabel + ".";

    var tile = document.createElement("div");
    tile.className = "gallery-tile reveal";
    tile.style.setProperty("--reveal-delay", (index % 6) * 0.06 + "s");
    tile.innerHTML =
      '<span class="gallery-placeholder-flag">Concept only</span>' +
      "<figure>" +
      svgFor(concept.pattern, palette) +
      '<figcaption class="gallery-caption">' +
      '<span class="badge ' + concept.status + '">' + concept.statusLabel + "</span>" +
      "<h3>" + concept.title + "</h3>" +
      "<p>" + altText + "</p>" +
      "</figcaption>" +
      "</figure>";

    var svg = tile.querySelector("svg");
    if (svg) {
      svg.setAttribute("aria-label", altText);
      svg.removeAttribute("aria-hidden");
    }

    return tile;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("galleryGrid");
    if (!grid) return;
    CONCEPTS.forEach(function (concept, index) {
      grid.appendChild(buildTile(concept, index));
    });
  });
})();
