/**
 * The fixed allow-list of businesses this API will ever accept leads for.
 * business_id values are hardcoded here — a request naming anything else is
 * rejected outright, before any other processing happens.
 *
 * Isolation model: each business's notification/archive recipients come from
 * their OWN environment variables. There is no code path that reads one
 * business's recipient config while handling another's lead, and no
 * endpoint anywhere returns stored lead data (this API only ever accepts
 * submissions — see api/lead.js). Misconfiguring one business's env vars
 * cannot leak data into another business's flow.
 */
"use strict";

const BUSINESSES = {
  "northern-forge": {
    label: "Northern Forge Windows, Blinds & Doors",
    notifyEnvVar: "NORTHERN_FORGE_NOTIFY_EMAIL",
    archiveEnvVar: "NORTHERN_FORGE_ARCHIVE_EMAIL", // optional
    allowedOriginEnvVar: "NORTHERN_FORGE_ALLOWED_ORIGIN",
  },
  "def-property-maintenance": {
    label: "DEF Property Maintenance & Security",
    notifyEnvVar: "DEF_NOTIFY_EMAIL",
    archiveEnvVar: "DEF_ARCHIVE_EMAIL",
    allowedOriginEnvVar: "DEF_ALLOWED_ORIGIN",
  },
  "lindsay-blinds": {
    label: "Lindsay Blinds",
    notifyEnvVar: "LINDSAY_NOTIFY_EMAIL",
    archiveEnvVar: "LINDSAY_ARCHIVE_EMAIL",
    allowedOriginEnvVar: "LINDSAY_ALLOWED_ORIGIN",
  },
};

function getBusiness(businessId) {
  if (typeof businessId !== "string") return null;
  return Object.prototype.hasOwnProperty.call(BUSINESSES, businessId)
    ? BUSINESSES[businessId]
    : null;
}

function isKnownBusiness(businessId) {
  return getBusiness(businessId) !== null;
}

module.exports = { BUSINESSES, getBusiness, isKnownBusiness };
