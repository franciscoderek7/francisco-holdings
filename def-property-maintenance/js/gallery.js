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
    { title: "Multi-vendor coordination", category: "Vendor Coordination", status: "badge-tbc", statusLabel: "Availability TBC", pattern: "vendor" },
    { title: "Camera placement concept", category: "Security Technology", status: "badge-showcase", statusLabel: "Technology Showcase", pattern: "camera" },
    { title: "Perimeter sensing concept", category: "Security Technology", status: "badge-assessment", statusLabel: "Assessment Required", pattern: "perimeter" },
    { title: "Smart access concept", category: "Security Technology", status: "badge-showcase", statusLabel: "Technology Showcase", pattern: "lock" },
    { title: "Property-status dashboard concept", category: "Smart Property", status: "badge-showcase", statusLabel: "Technology Showcase", pattern: "dashboard" },
    { title: "Automation chain concept", category: "Smart Property", status: "badge-showcase", statusLabel: "Technology Showcase", pattern: "automation" },
    { title: "Wireless containment concept", category: "Pet Containment", status: "badge-showcase", statusLabel: "Technology Showcase", pattern: "pet" },
    { title: "Smart collar concept", category: "Pet Containment", status: "badge-showcase", statusLabel: "Technology Showcase", pattern: "collar" },
    { title: "Before / after illustration", category: "Before & After", status: "badge-showcase", statusLabel: "Technology Showcase", pattern: "before-after" }
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
    } else if (pattern === "camera") {
      body =
        '<rect x="70" y="110" width="150" height="85" rx="14" fill="#fffaf3" stroke="' + line + '" stroke-width="4"/>' +
        '<circle cx="235" cy="152" r="34" fill="none" stroke="' + accent + '" stroke-width="7"/>' +
        '<circle cx="235" cy="152" r="12" fill="' + accent + '"/>';
    } else if (pattern === "perimeter") {
      body =
        '<path d="M60 240 L340 240" stroke="' + line + '" stroke-width="4" stroke-dasharray="10 10"/>' +
        '<circle cx="90" cy="240" r="9" fill="' + accent + '"/><circle cx="200" cy="240" r="9" fill="' + accent + '"/><circle cx="310" cy="240" r="9" fill="' + accent + '"/>' +
        '<path d="M90 240v-90M200 240v-140M310 240v-90" stroke="' + accent + '" stroke-width="4" stroke-linecap="round"/>';
    } else if (pattern === "lock") {
      body =
        '<rect x="130" y="140" width="140" height="110" rx="14" fill="#fffaf3" stroke="' + line + '" stroke-width="4"/>' +
        '<path d="M160 140v-30a40 40 0 0 1 80 0v30" fill="none" stroke="' + accent + '" stroke-width="8" stroke-linecap="round"/>' +
        '<circle cx="200" cy="195" r="12" fill="' + accent + '"/>';
    } else if (pattern === "dashboard") {
      body =
        '<rect x="60" y="60" width="280" height="180" rx="10" fill="#122320" stroke="' + line + '" stroke-width="4"/>' +
        '<g fill="none" stroke="' + accent + '" stroke-width="5" stroke-linecap="round">' +
        '<line x1="90" y1="100" x2="310" y2="100"/><line x1="90" y1="140" x2="260" y2="140"/><line x1="90" y1="180" x2="290" y2="180"/>' +
        "</g>" +
        '<circle cx="320" cy="100" r="6" fill="#6fdc9e"/><circle cx="270" cy="140" r="6" fill="#6fdc9e"/><circle cx="300" cy="180" r="6" fill="#6fdc9e"/>';
    } else if (pattern === "automation") {
      body =
        '<circle cx="90" cy="150" r="26" fill="none" stroke="' + accent + '" stroke-width="7"/>' +
        '<path d="M116 150h60" stroke="' + line + '" stroke-width="6" stroke-linecap="round"/>' +
        '<rect x="176" y="120" width="60" height="60" rx="10" fill="none" stroke="' + accent + '" stroke-width="7"/>' +
        '<path d="M236 150h60" stroke="' + line + '" stroke-width="6" stroke-linecap="round"/>' +
        '<circle cx="310" cy="150" r="26" fill="none" stroke="' + line + '" stroke-width="7"/>';
    } else if (pattern === "pet") {
      body =
        '<rect x="70" y="90" width="260" height="140" rx="70" fill="none" stroke="' + accent + '" stroke-width="6" stroke-dasharray="4 12"/>' +
        '<circle cx="200" cy="160" r="18" fill="' + line + '"/>';
    } else if (pattern === "collar") {
      body =
        '<circle cx="200" cy="150" r="70" fill="none" stroke="' + accent + '" stroke-width="10"/>' +
        '<circle cx="200" cy="220" r="14" fill="' + line + '"/>';
    } else if (pattern === "before-after") {
      body =
        '<rect x="50" y="70" width="140" height="160" fill="#e4ded0" stroke="' + line + '" stroke-width="4"/>' +
        '<rect x="210" y="70" width="140" height="160" fill="#fffaf3" stroke="' + accent + '" stroke-width="4"/>' +
        '<path d="M200 60v180" stroke="' + line + '" stroke-width="4" stroke-dasharray="6 8"/>' +
        '<path d="M80 190h80M240 160h80M240 190h60" stroke="' + accent + '" stroke-width="6" stroke-linecap="round"/>';
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
