/**
 * Server-side validation, driven by lib/schema.js. This is the source of
 * truth -- client-side validation on each site is UX only. Every field is
 * validated here regardless of what the frontend already checked, because
 * the frontend cannot be trusted.
 */
"use strict";

var sanitize = require("./sanitize.js");

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+[.][^\s@]+$/;
var PHONE_ALLOWED_PATTERN = /^[0-9()+\-.\s]{7,40}$/;

function validateField(name, def, rawValue) {
  var errors = [];
  var present =
    rawValue !== undefined && rawValue !== null && rawValue !== "";

  if (def.type === "boolean") {
    var boolValue = rawValue === true || rawValue === "true";
    if (def.required && !boolValue) {
      errors.push(name + " is required.");
    }
    return { value: boolValue, errors: errors };
  }

  if (!present) {
    if (def.required) errors.push(name + " is required.");
    return { value: "", errors: errors };
  }

  if (typeof rawValue !== "string") {
    errors.push(name + " must be text.");
    return { value: "", errors: errors };
  }

  var cleaned = sanitize.truncate(rawValue, def.maxLength || 500);

  if (def.required && cleaned.length === 0) {
    errors.push(name + " is required.");
  }

  if (def.type === "email" && cleaned.length > 0 && !EMAIL_PATTERN.test(cleaned)) {
    errors.push(name + " must be a valid email address.");
  }

  if (def.type === "phone" && cleaned.length > 0 && !PHONE_ALLOWED_PATTERN.test(cleaned)) {
    errors.push(name + " must be a valid phone number.");
  }

  if (def.type === "enum" && cleaned.length > 0 && def.options && def.options.indexOf(cleaned) === -1) {
    errors.push(name + " must be one of: " + def.options.join(", ") + ".");
  }

  return { value: cleaned, errors: errors };
}

/**
 * @param {object} schema  from lib/schema.js
 * @param {object} body    parsed request JSON
 * @returns {{ ok: boolean, errors: string[], clean: object }}
 */
function validateLead(schema, body) {
  var errors = [];
  var clean = {};

  if (!body || typeof body !== "object") {
    return { ok: false, errors: ["Request body must be a JSON object."], clean: {} };
  }

  Object.keys(schema).forEach(function (fieldName) {
    var result = validateField(fieldName, schema[fieldName], body[fieldName]);
    clean[fieldName] = result.value;
    errors = errors.concat(result.errors);
  });

  return { ok: errors.length === 0, errors: errors, clean: clean };
}

module.exports = { validateLead, validateField, EMAIL_PATTERN, PHONE_ALLOWED_PATTERN };
