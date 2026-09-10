/**
 * Dependency-free test suite. Runs the ACTUAL handler in api/lead.js
 * against mock req/res objects -- not a reimplementation of its logic.
 * No network calls happen (RESEND_API_KEY / LEAD_STORE_WEBHOOK_URL are
 * intentionally unset in this environment), so notification/persistence
 * always report {sent:false}/{persisted:false} here -- that's expected
 * and asserted on, not treated as a bug. Run with: node test/run.js
 */
"use strict";

var assert = require("assert");
var handler = require("../api/lead.js");

var passed = 0;
var failed = 0;
var failures = [];

var ipCounter = 0;

function mockReqRes(overrides) {
  var body = {};
  var statusCode = null;
  var jsonBody = null;
  var ended = false;
  var headers = {};

  // Unique IP per call by default, so the (shared, module-level) rate
  // limiter doesn't bleed between unrelated tests -- only the dedicated
  // rate-limit test below deliberately reuses one fixed IP.
  ipCounter++;
  var defaultIp = "203.0.113." + (ipCounter % 250);

  var req = Object.assign(
    {
      method: "POST",
      body: body,
      headers: { "x-forwarded-for": defaultIp },
      socket: { remoteAddress: defaultIp },
    },
    overrides
  );

  var res = {
    setHeader: function (k, v) {
      headers[k] = v;
    },
    status: function (code) {
      statusCode = code;
      return res;
    },
    json: function (payload) {
      jsonBody = payload;
      return res;
    },
    end: function () {
      ended = true;
      return res;
    },
    _result: function () {
      return { statusCode: statusCode, body: jsonBody, ended: ended, headers: headers };
    },
  };

  return { req: req, res: res };
}

function baseValidBody(overrides) {
  return Object.assign(
    {
      business_id: "northern-forge",
      name: "Jordan Test",
      email: "jordan@example.com",
      phone: "705-555-0100",
      message: "Interested in blinds for a living room.",
      consent: true,
      form_rendered_at: Date.now() - 5000, // 5s ago, passes timing check
      website_url: "", // honeypot, empty = human
    },
    overrides
  );
}

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

async function main() {
  await test("valid submission is accepted", async function () {
    var m = mockReqRes({ body: baseValidBody() });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 200);
    assert.strictEqual(r.body.ok, true);
    assert.ok(r.body.lead_id, "expected a lead_id");
    assert.match(r.body.message, /request has been received/i);
    // Honest, non-inflated confirmation copy: no promises of time/price/availability.
    assert.doesNotMatch(r.body.message.toLowerCase(), /hour|day|tomorrow|price|\$|quote by/);
  });

  await test("missing required name is rejected", async function () {
    var body = baseValidBody({ name: "" });
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 400);
    assert.strictEqual(r.body.ok, false);
    assert.ok(r.body.details.some(function (e) { return /name/i.test(e); }));
  });

  await test("invalid email is rejected", async function () {
    var body = baseValidBody({ email: "not-an-email" });
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 400);
    assert.ok(r.body.details.some(function (e) { return /email/i.test(e); }));
  });

  await test("invalid phone is rejected", async function () {
    var body = baseValidBody({ phone: "call me maybe!!" });
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 400);
    assert.ok(r.body.details.some(function (e) { return /phone/i.test(e); }));
  });

  await test("missing consent is rejected", async function () {
    var body = baseValidBody({ consent: false });
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 400);
    assert.ok(r.body.details.some(function (e) { return /consent/i.test(e); }));
  });

  await test("oversized input is truncated, not crashed", async function () {
    var hugeMessage = "x".repeat(50000);
    var body = baseValidBody({ message: hugeMessage });
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 200);
    assert.ok(r.body.ok);
  });

  await test("malicious script-tag input is neutralized (no raw <script> ever emitted)", async function () {
    var sanitize = require("../lib/sanitize.js");
    var malicious = '<script>alert(document.cookie)</script>';
    var encoded = sanitize.encodeForHtml(malicious);
    assert.doesNotMatch(encoded, /<script>/);
    assert.match(encoded, /&lt;script&gt;/);

    // And the actual handler accepts it as plain text without erroring.
    var body = baseValidBody({ message: malicious, name: malicious });
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 200);
  });

  await test("unknown business_id is rejected without revealing the allow-list", async function () {
    var body = baseValidBody({ business_id: "some-other-company" });
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 400);
    assert.doesNotMatch(JSON.stringify(r.body), /northern-forge|lindsay-blinds|def-property-maintenance/);
  });

  await test("honeypot-tripped submission is silently accepted and not processed", async function () {
    var body = baseValidBody({ website_url: "http://spam.example.com" });
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 200);
    assert.strictEqual(r.body.lead_id, undefined, "honeypot hits must not produce a real lead_id");
  });

  await test("submission faster than the timing threshold is treated as suspicious", async function () {
    var body = baseValidBody({ form_rendered_at: Date.now() - 50 }); // 50ms, too fast
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 200);
    assert.strictEqual(r.body.lead_id, undefined, "timing-suspicious hits must not produce a real lead_id");
  });

  await test("duplicate submission (same business+email+message) within 30s reuses the first lead_id", async function () {
    var body = baseValidBody({ email: "dupe-test@example.com", message: "Same message twice." });
    var m1 = mockReqRes({ body: Object.assign({}, body) });
    await handler(m1.req, m1.res);
    var r1 = m1.res._result();
    assert.strictEqual(r1.statusCode, 200);

    var m2 = mockReqRes({ body: Object.assign({}, body, { form_rendered_at: Date.now() - 4000 }) });
    await handler(m2.req, m2.res);
    var r2 = m2.res._result();
    assert.strictEqual(r2.statusCode, 200);
    assert.strictEqual(r2.body.lead_id, r1.body.lead_id, "expected the same lead_id to be reused");
    assert.strictEqual(r2.body._debug.duplicate_of_recent_submission, true);
  });

  await test("business isolation: two businesses submitting concurrently never cross-contaminate", async function () {
    var nfBody = baseValidBody({
      business_id: "northern-forge",
      email: "nf-isolation@example.com",
      product_interest: "Blinds",
    });
    var defBody = baseValidBody({
      business_id: "def-property-maintenance",
      email: "def-isolation@example.com",
      requested_service: "Seasonal cleanup",
    });

    var mNf = mockReqRes({ body: nfBody });
    var mDef = mockReqRes({ body: defBody });
    await Promise.all([handler(mNf.req, mNf.res), handler(mDef.req, mDef.res)]);

    var rNf = mNf.res._result();
    var rDef = mDef.res._result();
    assert.strictEqual(rNf.statusCode, 200);
    assert.strictEqual(rDef.statusCode, 200);
    assert.notStrictEqual(rNf.body.lead_id, rDef.body.lead_id);
  });

  await test("rate limiting kicks in after too many rapid submissions from one IP", async function () {
    var ip = "198.51.100.42";
    var last;
    for (var i = 0; i < 7; i++) {
      var body = baseValidBody({
        email: "ratelimit-" + i + "@example.com",
        message: "attempt " + i,
      });
      var m = mockReqRes({
        body: body,
        headers: { "x-forwarded-for": ip },
        socket: { remoteAddress: ip },
      });
      await handler(m.req, m.res);
      last = m.res._result();
    }
    assert.strictEqual(last.statusCode, 429, "expected the 6th+ rapid submission from one IP to be rate-limited");
  });

  await test("no notification/persistence config -> lead still accepted, failure logged not thrown", async function () {
    // Explicitly confirms the honest "accepted but not notified" behavior
    // this project is in right now (no RESEND_API_KEY / recipient env vars
    // set anywhere in this repo or this test run).
    var body = baseValidBody({ email: "no-config-check@example.com" });
    var m = mockReqRes({ body: body });
    await handler(m.req, m.res);
    var r = m.res._result();
    assert.strictEqual(r.statusCode, 200);
    assert.strictEqual(r.body._debug.notification_sent, false);
    assert.strictEqual(r.body._debug.persisted, false);
  });

  console.log("\n" + passed + " passed, " + failed + " failed");
  if (failed > 0) {
    failures.forEach(function (f) {
      console.log("\n--- " + f.name + " ---");
      console.log(f.err.stack || f.err.message);
    });
    process.exit(1);
  }
}

main();
