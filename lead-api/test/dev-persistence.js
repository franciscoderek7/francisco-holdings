/**
 * Tests for the local dev-only persistence layer (lib/devStore.js) and a
 * REAL end-to-end run against dev-server.js over actual HTTP -- not mocked
 * req/res objects. This is what actually proves Step 21's requirement:
 * a real submission creates a real record, readable back afterward, and
 * business isolation holds (a Northern Forge submission never appears in
 * DEF's or Lindsay's file, and vice versa).
 *
 * Run with: node test/dev-persistence.js
 */
"use strict";

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var http = require("http");

var devStore = require("../lib/devStore.js");

var DEV_DATA_DIR = devStore.DEV_DATA_DIR;

function cleanDevData() {
  if (fs.existsSync(DEV_DATA_DIR)) {
    fs.rmSync(DEV_DATA_DIR, { recursive: true, force: true });
  }
}

var passed = 0;
var failed = 0;
var failures = [];

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log("PASS: " + name);
  } catch (err) {
    failed++;
    failures.push({ name: name, err: err });
    console.log("FAIL: " + name + " -- " + err.message);
  }
}

function postJson(port, body) {
  return new Promise(function (resolve, reject) {
    var data = JSON.stringify(body);
    var req = http.request(
      {
        hostname: "127.0.0.1",
        port: port,
        path: "/api/lead",
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
      },
      function (res) {
        var chunks = [];
        res.on("data", function (c) {
          chunks.push(c);
        });
        res.on("end", function () {
          var text = Buffer.concat(chunks).toString("utf8");
          var json;
          try {
            json = JSON.parse(text);
          } catch (e) {
            json = null;
          }
          resolve({ status: res.statusCode, json: json });
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// A unique-ish token per call so tests never collide with the 30-second
// duplicate-submission guard in lib/spam.js when the same business_id is
// submitted more than once across different tests in this file.
var leadBodyCounter = 0;

function leadBody(businessId, extra) {
  leadBodyCounter++;
  var unique = Date.now() + "-" + leadBodyCounter;
  return Object.assign(
    {
      business_id: businessId,
      name: "Isolation Test " + businessId,
      email: businessId.replace(/[^a-z]/g, "") + "+" + unique + "@example.com",
      message: "End-to-end isolation test for " + businessId + " (" + unique + ")",
      consent: true,
      form_rendered_at: Date.now() - 4000,
      website_url: "",
    },
    extra || {}
  );
}

async function main() {
  // --- Unit-level devStore tests ---

  await test("devStore is disabled by default (LEAD_DEV_PERSIST unset)", async function () {
    delete process.env.LEAD_DEV_PERSIST;
    cleanDevData();
    var result = devStore.appendLead("northern-forge", "id-1", new Date().toISOString(), { name: "x" });
    assert.strictEqual(result.persisted, false);
    assert.strictEqual(fs.existsSync(DEV_DATA_DIR), false, "no directory should be created when disabled");
  });

  await test("devStore writes a real record when enabled", async function () {
    process.env.LEAD_DEV_PERSIST = "1";
    cleanDevData();
    var result = devStore.appendLead("def-property-maintenance", "id-2", "2026-01-01T00:00:00.000Z", {
      name: "Jane",
      email: "jane@example.com",
    });
    assert.strictEqual(result.persisted, true);
    var records = devStore.readLeadsForBusiness("def-property-maintenance");
    assert.strictEqual(records.length, 1);
    assert.strictEqual(records[0].lead_id, "id-2");
    assert.strictEqual(records[0].business_id, "def-property-maintenance");
    assert.strictEqual(records[0].lead.name, "Jane");
  });

  await test("devStore keeps each business in its own file (isolation at the storage layer)", async function () {
    process.env.LEAD_DEV_PERSIST = "1";
    cleanDevData();
    devStore.appendLead("northern-forge", "nf-1", new Date().toISOString(), { name: "NF Lead" });
    devStore.appendLead("lindsay-blinds", "lb-1", new Date().toISOString(), { name: "LB Lead" });

    var nfRecords = devStore.readLeadsForBusiness("northern-forge");
    var lbRecords = devStore.readLeadsForBusiness("lindsay-blinds");
    var defRecords = devStore.readLeadsForBusiness("def-property-maintenance");

    assert.strictEqual(nfRecords.length, 1);
    assert.strictEqual(lbRecords.length, 1);
    assert.strictEqual(defRecords.length, 0, "a business with no submissions must have zero records, not leak another's");
    assert.strictEqual(nfRecords[0].lead.name, "NF Lead");
    assert.strictEqual(lbRecords[0].lead.name, "LB Lead");

    var nfFile = fs.readFileSync(path.join(DEV_DATA_DIR, "northern-forge.jsonl"), "utf8");
    assert.doesNotMatch(nfFile, /LB Lead/, "Northern Forge's file must never contain Lindsay's data");
  });

  process.env.LEAD_DEV_PERSIST = "1";
  cleanDevData();

  // --- Real HTTP end-to-end test against dev-server.js ---
  var server = require("../dev-server.js");
  await new Promise(function (resolve) {
    if (server.listening) return resolve();
    server.once("listening", resolve);
  });
  var port = server.address().port;

  await test("real HTTP POST to dev-server.js creates a real, readable lead record", async function () {
    var submitted = leadBody("lindsay-blinds", { room: "living room" });
    var res = await postJson(port, submitted);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.ok, true);
    assert.ok(res.json.lead_id);
    assert.strictEqual(res.json._debug.dev_persisted, true);

    var records = devStore.readLeadsForBusiness("lindsay-blinds");
    var match = records.find(function (r) {
      return r.lead_id === res.json.lead_id;
    });
    assert.ok(match, "the lead_id returned by the real server must be readable back from disk");
    assert.strictEqual(match.lead.email, submitted.email);
  });

  await test("real HTTP: invalid submission is rejected by the real server, not silently accepted", async function () {
    var res = await postJson(port, leadBody("lindsay-blinds", { email: "not-an-email" }));
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.json.ok, false);
  });

  await test("real HTTP: three businesses submitting for real never cross-contaminate on disk", async function () {
    cleanDevData();
    var [nfRes, defRes, lbRes] = await Promise.all([
      postJson(port, leadBody("northern-forge")),
      postJson(port, leadBody("def-property-maintenance")),
      postJson(port, leadBody("lindsay-blinds")),
    ]);
    [nfRes, defRes, lbRes].forEach(function (r) {
      assert.strictEqual(r.status, 200);
      assert.strictEqual(r.json.ok, true);
    });

    var nf = devStore.readLeadsForBusiness("northern-forge");
    var def = devStore.readLeadsForBusiness("def-property-maintenance");
    var lb = devStore.readLeadsForBusiness("lindsay-blinds");

    assert.strictEqual(nf.length, 1);
    assert.strictEqual(def.length, 1);
    assert.strictEqual(lb.length, 1);
    assert.strictEqual(nf[0].business_id, "northern-forge");
    assert.strictEqual(def[0].business_id, "def-property-maintenance");
    assert.strictEqual(lb[0].business_id, "lindsay-blinds");
    // Cross-check: no file contains another business's lead_id.
    var nfFileText = fs.readFileSync(path.join(DEV_DATA_DIR, "northern-forge.jsonl"), "utf8");
    assert.doesNotMatch(nfFileText, new RegExp(def[0].lead_id));
    assert.doesNotMatch(nfFileText, new RegExp(lb[0].lead_id));
  });

  await test("real HTTP: unreachable/failed request path -- server refuses malformed JSON honestly", async function () {
    // Simulates what a real network/backend failure produces: a non-2xx
    // response, never a false 200 success.
    var raw = await new Promise(function (resolve, reject) {
      var req = http.request(
        { hostname: "127.0.0.1", port: port, path: "/api/lead", method: "POST", headers: { "Content-Type": "application/json" } },
        function (res) {
          var chunks = [];
          res.on("data", function (c) {
            chunks.push(c);
          });
          res.on("end", function () {
            resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") });
          });
        }
      );
      req.on("error", reject);
      req.write("{not valid json");
      req.end();
    });
    assert.strictEqual(raw.status, 400);
    var json = JSON.parse(raw.body);
    assert.strictEqual(json.ok, false);
  });

  cleanDevData();
  server.close();
  delete process.env.LEAD_DEV_PERSIST;

  console.log("\n" + passed + " passed, " + failed + " failed");
  if (failed > 0) {
    failures.forEach(function (f) {
      console.log("\n--- " + f.name + " ---");
      console.log(f.err.stack || f.err.message);
    });
    process.exitCode = 1;
  }
}

main();
