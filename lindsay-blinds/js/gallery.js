/*
 * Lindsay Blinds prototype — gallery placeholder tiles.
 * Generates CSS/SVG placeholder graphics only (no external images).
 * Structured so real project photography can later replace the
 * <svg> in each tile without touching the surrounding markup.
 */
(function () {
  "use strict";

  var PALETTES = [
    { bg: "#efe3cf", accent: "#b2532b", line: "#8a3f20" },
    { bg: "#e9dcc6", accent: "#8a3f20", line: "#b2532b" },
    { bg: "#f4ded0", accent: "#b2532b", line: "#8a3f20" },
    { bg: "#f2e9da", accent: "#8a3f20", line: "#b2532b" }
  ];

  var PROJECTS = [
    { title: "Living room blinds", category: "Blinds", room: "Living room", pattern: "blinds" },
    { title: "Kitchen shutters", category: "Shutters", room: "Kitchen", pattern: "shutters" },
    { title: "Bedroom roller shade", category: "Shades", room: "Bedroom", pattern: "shade" },
    { title: "Motorized great room", category: "Motorization", room: "Great room", pattern: "motor" },
    { title: "Cottage sunroom blinds", category: "Blinds", room: "Sunroom", pattern: "blinds" },
    { title: "Home office shutters", category: "Shutters", room: "Home office", pattern: "shutters" },
    { title: "Dining room cellular shade", category: "Shades", room: "Dining room", pattern: "shade" },
    { title: "Storefront motorized shade", category: "Motorization", room: "Storefront", pattern: "motor" },
    { title: "Basement repair &amp; refresh", category: "Repair", room: "Basement", pattern: "blinds" }
  ];

  function svgFor(pattern, palette) {
    var bg = palette.bg, accent = palette.accent, line = palette.line;
    var body = "";
    if (pattern === "blinds") {
      body =
        '<g stroke="' + accent + '" stroke-width="8" stroke-linecap="round">' +
        '<line x1="40" y1="60" x2="360" y2="60"/><line x1="40" y1="100" x2="360" y2="100"/>' +
        '<line x1="40" y1="140" x2="360" y2="140"/><line x1="40" y1="180" x2="360" y2="180"/>' +
        "</g>" +
        '<rect x="40" y="200" width="320" height="70" fill="' + line + '" opacity="0.25"/>';
    } else if (pattern === "shutters") {
      body =
        '<rect x="60" y="50" width="280" height="200" fill="#fffaf3" stroke="' + line + '" stroke-width="4"/>' +
        '<path d="M60 150h280M200 50v200" stroke="' + line + '" stroke-width="4"/>';
    } else if (pattern === "shade") {
      body =
        '<rect x="60" y="40" width="280" height="16" fill="' + line + '" rx="4"/>' +
        '<rect x="60" y="56" width="280" height="170" fill="#fffaf3" stroke="' + accent + '" stroke-width="2"/>' +
        '<path d="M60 100h280M60 150h280M60 200h280" stroke="' + accent + '" stroke-width="2" opacity="0.5"/>';
    } else {
      body =
        '<rect x="70" y="40" width="260" height="220" rx="10" fill="#fffaf3" stroke="' + accent + '" stroke-width="4"/>' +
        '<circle cx="200" cy="150" r="30" fill="none" stroke="' + accent + '" stroke-width="6"/>' +
        '<path d="M200 118v-16M200 182v16M168 150h-16M232 150h16" stroke="' + accent + '" stroke-width="6" stroke-linecap="round"/>';
    }
    return (
      '<svg class="gallery-thumb" viewBox="0 0 400 300" role="img" aria-hidden="true" focusable="false">' +
      '<rect width="400" height="300" fill="' + bg + '"/>' +
      body +
      "</svg>"
    );
  }

  function buildTile(project, index) {
    var palette = PALETTES[index % PALETTES.length];
    var altText =
      "Placeholder project photo — replace with real installation photography. " +
      "Category: " + project.category + ". Room type: " + project.room + ".";

    var tile = document.createElement("div");
    tile.className = "gallery-tile";
    tile.innerHTML =
      '<span class="placeholder-flag">Placeholder</span>' +
      "<figure>" +
      svgFor(project.pattern, palette) +
      '<figcaption class="gallery-caption">' +
      "<h3>" + project.title + "</h3>" +
      "<p>" + altText + "</p>" +
      "</figcaption>" +
      "</figure>";

    // Keep an accessible, screen-reader-friendly description tied to the
    // graphic itself (the visible caption already repeats it visually).
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
    PROJECTS.forEach(function (project, index) {
      grid.appendChild(buildTile(project, index));
    });
  });
})();
