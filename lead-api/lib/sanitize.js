/**
 * Minimal, dependency-free text sanitization for lead fields. Nothing here
 * is ever rendered as HTML anywhere in this system (notification emails are
 * sent as plain text -- see lib/email.js), but fields are sanitized anyway
 * as defense-in-depth: this data may end up in an admin UI, a database, or
 * a spreadsheet later, none of which should have to re-discover this.
 */
"use strict";

/**
 * Strip control/non-printable characters (charCode < 32, excluding plain
 * space, or charCode 127) by filtering char-by-char -- deliberately avoids
 * regex control-character escapes, which are easy to mistranscribe.
 */
function stripControlChars(value) {
  var out = "";
  for (var i = 0; i < value.length; i++) {
    var code = value.charCodeAt(i);
    var isNewlineOrTab = code === 9 || code === 10 || code === 13;
    var isControl = (code < 32 && !isNewlineOrTab) || code === 127;
    if (!isControl) out += value[i];
  }
  return out;
}

/** Strip control characters and collapse excess whitespace. */
function cleanText(value) {
  if (typeof value !== "string") return "";
  return stripControlChars(value).replace(/\s+/g, " ").trim();
}

/** HTML-encode so this can never be misinterpreted as markup downstream. */
function encodeForHtml(value) {
  return cleanText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(value, maxLength) {
  var s = cleanText(value);
  return s.length > maxLength ? s.slice(0, maxLength) : s;
}

module.exports = { cleanText, encodeForHtml, truncate };
