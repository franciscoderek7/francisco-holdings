/**
 * Per-business lead field schema. Drives both validation (lib/validate.js)
 * and the notification email body (lib/email.js), so adding a field only
 * means editing this file.
 *
 * Field types:
 *  - "text"  short free text (name, phone, city, etc.)
 *  - "email" validated as an email address
 *  - "phone" light validation only (formats vary too much to be strict)
 *  - "longtext" free text, longer max length (message/description)
 *  - "enum"  must be one of `options` if provided at all
 *
 * `required: true` fields must be present and non-empty or the submission
 * is rejected with a 400. Everything else is optional — per the task's
 * "collect only what is necessary" instruction, nothing is required beyond
 * what a business actually needs to act on the lead.
 */
"use strict";

const COMMON_FIELDS = {
  name: { type: "text", required: true, maxLength: 120 },
  phone: { type: "phone", required: false, maxLength: 40 },
  email: { type: "email", required: true, maxLength: 200 },
  message: { type: "longtext", required: false, maxLength: 2000 },
  preferred_contact_method: {
    type: "enum",
    required: false,
    options: ["phone", "email", "either"],
  },
  preferred_timing: { type: "text", required: false, maxLength: 200 },
  source_page: { type: "text", required: false, maxLength: 200 },
  inquiry_type: { type: "text", required: false, maxLength: 60 },
  consent: { type: "boolean", required: true },
};

const SCHEMAS = {
  "northern-forge": {
    ...COMMON_FIELDS,
    product_interest: { type: "text", required: false, maxLength: 100 },
    room_or_property: { type: "text", required: false, maxLength: 100 },
    privacy_preference: { type: "text", required: false, maxLength: 100 },
    light_control: { type: "text", required: false, maxLength: 100 },
    style: { type: "text", required: false, maxLength: 100 },
    colour: { type: "text", required: false, maxLength: 100 },
    operation: {
      type: "enum",
      required: false,
      options: ["manual", "motorized", "not-sure"],
    },
    installation_interest: { type: "boolean", required: false },
  },
  "def-property-maintenance": {
    ...COMMON_FIELDS,
    property_type: { type: "text", required: false, maxLength: 100 },
    requested_service: { type: "text", required: false, maxLength: 150 },
    property_concern: { type: "text", required: false, maxLength: 200 },
    urgency: {
      type: "enum",
      required: false,
      options: ["not-urgent", "soon", "urgent"],
    },
    service_area: { type: "text", required: false, maxLength: 150 },
  },
  "lindsay-blinds": {
    ...COMMON_FIELDS,
    product_interest: { type: "text", required: false, maxLength: 100 },
    room: { type: "text", required: false, maxLength: 100 },
    window_type: { type: "text", required: false, maxLength: 100 },
    privacy: { type: "text", required: false, maxLength: 100 },
    light_control: { type: "text", required: false, maxLength: 100 },
    style: { type: "text", required: false, maxLength: 100 },
    colour: { type: "text", required: false, maxLength: 100 },
    budget: { type: "text", required: false, maxLength: 100 },
    installation_interest: { type: "boolean", required: false },
  },
};

function getSchema(businessId) {
  return Object.prototype.hasOwnProperty.call(SCHEMAS, businessId)
    ? SCHEMAS[businessId]
    : null;
}

module.exports = { SCHEMAS, getSchema };
