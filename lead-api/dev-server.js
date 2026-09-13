/**
 * Minimal local development server for lead-api.
 *
 * This is NOT a production deployment mechanism -- there is no Vercel,
 * Netlify, or other hosting involved here. It exists so the real
 * api/lead.js handler can be exercised over a real HTTP request/response
 * cycle on localhost, for genuine end-to-end testing (server-side
 * validation, spam checks, dev-only persistence, real JSON responses)
 * without needing any deployment credentials.
 *
 * Usage:
 *   LEAD_DEV_PERSIST=1 node dev-server.js [port]
 *
 * (LEAD_DEV_PERSIST=1 turns on lib/devStore.js's local file persistence --
 * see that file's header comment for why it's opt-in and dev-only.)
 *
 * Uses only Node's built-in `http` module -- no new dependency for
 * something this small.
 */
"use strict";

var http = require("http");
var handler = require("./api/lead.js");

var PORT = Number(process.argv[2]) || 3300;

function collectBody(req) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    var total = 0;
    var MAX_BYTES = 200 * 1024; // 200KB is generous for a contact form

    req.on("data", function (chunk) {
      total += chunk.length;
      if (total > MAX_BYTES) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", function () {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

/** Adapts Node's raw (req, res) to the Vercel-style (req, res) shape
 * api/lead.js expects: req.body pre-parsed, res.status().json()/.end(). */
function adapt(rawReq, rawRes) {
  rawRes.status = function (code) {
    rawRes.statusCode = code;
    return rawRes;
  };
  rawRes.setHeader = rawRes.setHeader.bind(rawRes);
  rawRes.json = function (payload) {
    rawRes.setHeader("Content-Type", "application/json");
    rawRes.end(JSON.stringify(payload));
    return rawRes;
  };
  var originalEnd = rawRes.end.bind(rawRes);
  rawRes.end = function (data) {
    return originalEnd(data);
  };
  return rawRes;
}

var server = http.createServer(function (req, res) {
  if (req.url !== "/api/lead") {
    res.statusCode = 404;
    res.end("Not found. This dev server only serves POST /api/lead.");
    return;
  }

  adapt(req, res);

  collectBody(req)
    .then(function (raw) {
      var body = {};
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch (e) {
          res.status(400).json({ ok: false, error: "Invalid JSON body." });
          return;
        }
      }
      req.body = body;
      return handler(req, res);
    })
    .catch(function (err) {
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, error: err && err.message }));
    });
});

server.listen(PORT, "127.0.0.1", function () {
  console.log(
    "[lead-api dev-server] listening on http://127.0.0.1:" +
      PORT +
      "/api/lead" +
      (process.env.LEAD_DEV_PERSIST === "1"
        ? " (dev persistence ON -> .dev-data/)"
        : " (dev persistence OFF -- set LEAD_DEV_PERSIST=1 to enable)")
  );
});

module.exports = server;
