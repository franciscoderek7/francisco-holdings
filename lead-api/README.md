# FH Lead API — shared lead-capture backend

A single, small serverless backend that gives **Northern Forge Windows, Blinds & Doors**, **DEF
Property Maintenance & Security**, and **Lindsay Blinds** real lead capture — server-side
validation, spam protection, email notification, and an explicit business-isolation model — while
keeping the three businesses' websites and data completely separate.

**Status: BUILT — NOT CONFIGURED — NOT DEPLOYED.** Every line of this code is real and tested (see
`test/run.js`, 14/14 passing against the actual handler, not a reimplementation). Nothing here has
been deployed anywhere, and no email has ever actually been sent, because that requires three
things this session does not have and did not invent: a hosting target, an email-provider API key,
and the businesses' real notification email addresses.

## Why this exists

The three sites' forms previously showed a local "success" message without sending or storing
anything anywhere — not a real lead system. This closes that gap: `WEBSITE → REAL LEAD CAPTURE →
PERSISTENT RECORD → CUSTOMER CONFIRMATION → HUMAN NOTIFICATION → HUMAN FOLLOW-UP`. Nothing here
performs autonomous financial activity, creates contracts, or makes consequential decisions — it
only accepts, validates, records, and notifies. A human reviews and acts on every lead.

## Business isolation — how it's actually enforced, not just claimed

- `lib/businesses.js` is a **hardcoded allow-list** of exactly three `business_id` values. A
  request naming anything else is rejected before any other processing happens.
- Every downstream step — which fields are expected (`lib/schema.js`), which email address gets
  notified, which address gets archived, which origin is allowed to call this endpoint — is looked
  up from **that business's own environment variables only**. There is no code path anywhere in
  this project that reads one business's config while handling another's submission.
- This API has **no read/list/admin endpoint at all** — `api/lead.js` only ever accepts a new
  submission (`POST`) and returns success/failure. There is nothing to expose, because nothing is
  exposed by design. A future admin view (see "Not built yet" below) would need its own
  authenticated, business-scoped endpoint — not this one.
- The automated business-isolation test in `test/run.js` submits to two different businesses
  concurrently and asserts they never produce the same lead ID or interfere with each other.

## Architecture

```
Website form (client-side validation, UX only)
        |
        | POST /api/lead   { business_id, ...fields, honeypot, form_rendered_at }
        v
api/lead.js
  1. Resolve business_id against the hardcoded allow-list (reject unknown)
  2. Honeypot check -> if tripped, respond 200 and do nothing else (never tip off bots)
  3. Rate-limit check (best-effort, per IP)
  4. Timing check -> too-fast submissions treated as bots
  5. Server-side schema validation (lib/validate.js) -- the real source of truth
  6. Duplicate-submission check (same business+email+message within 30s -> reuse the first lead_id)
  7. Generate lead_id (UUID) + timestamp, set status = NEW
  8. Send notification email (lib/email.js, Resend) to that business's configured recipient
  9. Optionally forward to LEAD_STORE_WEBHOOK_URL (lib/email.js persistLead)
 10. Respond with a generic, honest confirmation message
```

## Required lead fields

Common to all three (see `lib/schema.js` for exact types/limits): `name` (required), `email`
(required), `phone`, `message`, `preferred_contact_method`, `preferred_timing`, `source_page`,
`inquiry_type`, `consent` (required — see "Privacy/consent" below). Plus per business:

- **Northern Forge:** `product_interest`, `room_or_property`, `privacy_preference`,
  `light_control`, `style`, `colour`, `operation` (manual/motorized/not-sure),
  `installation_interest`
- **DEF:** `property_type`, `requested_service`, `property_concern`, `urgency`, `service_area`
- **Lindsay:** `product_interest`, `room`, `window_type`, `privacy`, `light_control`, `style`,
  `colour`, `budget`, `installation_interest`

Nothing beyond this list is collected, per the "collect only what is necessary" instruction.

## Lead status model

`NEW → REVIEWING → CONTACTED → QUOTE_REQUESTED → QUOTED → WON → LOST → COMPLETED`. Every lead is
created as `NEW`. **No code anywhere transitions a lead's status automatically** — this enum exists
so a human-operated tool can do that later (see "Not built yet"). That tool does not exist yet.

## Persistence — why there's no database

No database was invented here, because I have no real credentials for one (no Supabase/Firebase/
Airtable account, nothing). Two deliberate choices instead:

1. **The notification email itself is the durable record** by default — it lands in the business
   owner's inbox, searchable and permanent, with zero infrastructure to run or pay for. This is a
   legitimate, common pattern for a small business's first real lead system.
2. **`LEAD_STORE_WEBHOOK_URL`** (optional): if set, every accepted lead is also POSTed as JSON to
   that URL. Point this at a Zapier/Make webhook feeding a spreadsheet, Airtable, or a real
   database, once one of those exists. This keeps the choice of "real" persistence layer with
   Derek/the business owners rather than assumed by this code.

**What was deliberately avoided:** committing lead data (which is customer PII) into this Git
repository as a storage mechanism. Git history is effectively permanent and these repos are public
— that would be a real privacy problem (no way to honor a deletion request, PII visible to anyone
who clones the repo). Don't do this even if it seems convenient later.

## Deployment (not done — here's exactly how, once authorized)

This is a standard Vercel-style serverless function (`module.exports = async (req, res) => {}` in
`api/`). To deploy:

1. `vercel` (or connect this `lead-api/` directory as its own Vercel project via the dashboard —
   it's self-contained, not nested inside any of the three site directories).
2. In the Vercel project's Settings → Environment Variables, set everything listed in
   `.env.example` — **none of these have been set anywhere in this session**, because I don't have
   real values for any of them (a real Resend account + API key, and Dylan's/Marc's real
   notification email addresses).
3. Update each site's lead-submission config (see each site's own
   `js/lead-submit-config.js`) with the deployed function's real URL — currently a placeholder
   string, clearly marked, in all three sites.
4. Once deployed AND configured, run a real end-to-end test (submit a real form on each site, see
   a real email arrive) before telling any business owner this is live. Until that happens, treat
   this as **not production ready**, regardless of how complete the code is.

**This session did not deploy anything** — no Vercel/hosting credentials exist here, and deploying
without them is impossible, not just declined. Per the standing instruction, it would not have been
deployed even if credentials existed, without explicit authorization first.

## Security

- **No secrets in frontend code, anywhere.** `RESEND_API_KEY` and every recipient email address
  are read from `process.env` only, inside files that run exclusively server-side (`api/`, `lib/`).
  Verified by grepping all three site directories (`northern-forge-blinds/`,
  `def-property-maintenance/`, `lindsay-blinds/`) for `RESEND`, `api_key`, `apikey`, and similar —
  zero hits (see each site's lead-submission wiring; it only ever sends fetch requests to a
  configured URL, never a key).
- `.env.example` documents every variable with **empty values** — nothing resembling a real key,
  password, or token is committed anywhere in this project. `.gitignore` excludes `.env*` (except
  `.env.example`) so a real `.env.local` used for local testing can never be accidentally committed.
- Every free-text field is length-capped and sanitized (`lib/sanitize.js`) before it's ever used in
  an email body or (if a webhook is configured) forwarded onward — control characters stripped,
  HTML-encoded where relevant, defense-in-depth against a lead's own submitted text being
  misinterpreted downstream.
- No lead data is stored in any public directory. No endpoint returns previously submitted lead
  data to anyone, public or authenticated — there is no such endpoint at all yet.

## Hardening still needed before this sees real production traffic

Honest limitations, not hidden ones:

- **Rate limiting and duplicate-detection are in-memory and per-instance.** Serverless platforms
  run multiple cold-started instances with no shared memory, so a determined abuser spread across
  instances could exceed the intended limits. For real hardening: a shared store like Upstash Redis
  (a few minutes to wire in, needs its own account/credentials — **ACCESS REQUIRED**, not built).
- **No CAPTCHA/Turnstile.** The honeypot + timing heuristics catch unsophisticated bots, not a
  determined attacker. Adding Cloudflare Turnstile or hCaptcha is a reasonable next step once this
  gets real traffic and real spam.
- **CORS defaults to `*`** until each business's real deployed site origin is known (see
  `.env.example`'s `*_ALLOWED_ORIGIN` variables) — tighten this once each site has a real domain.

## Not built yet (out of scope for this round, by design)

- Any UI or API to view, search, or change a lead's status. The status enum exists; nothing
  transitions it automatically, and nothing lets a human do it through this project yet. This was
  explicitly out of scope ("a human can eventually control these statuses").
- Payment processing, contract generation, or any other consequential automated action — never in
  scope, per the standing rule against autonomous financial/contractual activity.

## Privacy / consent

Every submission requires an explicit `consent` checkbox (present in each site's form) before the
server accepts it. The notification email states plainly whether consent was confirmed. **No legal
claims are made anywhere in this project** — the notice text used on each site is a plain factual
statement ("submitted information is used to respond to your inquiry"), not a privacy policy. A
real privacy policy, terms of use, and any jurisdiction-specific consent/marketing-communication
requirements (e.g. CASL in Canada) need actual legal review before this goes live — flagging this
explicitly rather than drafting legal language myself.

## Testing

```
cd lead-api
node test/run.js
```

14 tests, all passing, run directly against the real `api/lead.js` handler (mock `req`/`res`
objects, no reimplementation of the logic under test): valid submission, missing name, invalid
email, invalid phone, missing consent, oversized input, malicious script-tag input, unknown
business_id, honeypot, timing-based bot detection, duplicate-submission handling, business
isolation under concurrent submissions from two different businesses, rate limiting, and the
honest "accepted but not notified" behavior when no email/recipient config exists (which is this
project's actual current state).

**Not testable without deployment:** the real Resend API call succeeding, a real email actually
arriving, and real end-to-end behavior on a live domain. These remain unverified until deployed and
configured — do not treat the passing test suite as proof of that.

## Deployment readiness

**DEPLOYMENT BLOCKED — AUTHORIZATION REQUIRED.** Even once a hosting target and email credentials
exist, this should not be deployed without an explicit go-ahead — see `.env.example` for the full
list of what's needed first.
