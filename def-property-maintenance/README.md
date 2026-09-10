# DEF Property Maintenance & Security — Visual Prototype

This directory is a **self-contained, static visual prototype** built for Dylan to review as a
concept for a possible property-services business expansion. It is **not** a live website, has no
backend, sends no data anywhere, and should not be linked from or confused with any production
system.

**Production deployment of this prototype is not authorized.** Nothing here should be pointed at a
real domain, connected to real customers, or represented as an operating business until Dylan has
confirmed the information listed later in this file and made a deliberate decision to launch.

## Business name / status

"DEF Property Maintenance & Security" is a **working name only**, used as a placeholder to give this
concept prototype a consistent identity. It is not confirmed as the real trading or legal name of
any business. No entity currently operates under this name as far as this prototype is concerned.

**"DEF" stands for Don Eric Francisco** — this was supplied as real information, so the About page
notes it as a small, tasteful aside. It is not a claim about any registered trade name.

## Scope: maintenance *and* security/technology

This prototype was originally a property-maintenance concept only. It has since been substantially
expanded to also cover **smart security and property-protection technology** — cameras, sensors,
access control, environmental monitoring, pet containment, and simple automation/dashboard concepts
— as a second, complementary line alongside maintenance. Nothing about that expansion is presented
as an existing capability; see "Demo functionality" and the status-badge system below.

## Current status

- **Stage:** internal concept / design prototype, shared for feedback only.
- **Not deployed:** this directory has never been published to a live domain and is not linked from
  any production system.
- **Not connected to anything real:** no backend, no database, no AI service, no analytics, no
  payment processor, no scheduling tool, no CRM, no security hardware, no monitoring service.
- **No service or technology category is confirmed active.** Every category — the original seven
  maintenance categories and every new security/technology category — carries an explicit status
  badge everywhere it appears, including inside the AI Property Concierge and Security Assessment
  demos described below.

## What this is (and isn't)

- **Is:** a design concept and interaction prototype, meant to gather feedback on structure, tone,
  and visual direction before any real content, pricing, hardware partnerships, or service
  commitments exist.
- **Isn't:** a live booking system, a functioning contact/quote form, a real map, a real AI
  assistant, a real security system, a monitoring service, or a source of truth for Dylan's actual
  business details. Every page carries a "Prototype / Demo" banner and footer note saying so.

## THE single most important rule this prototype follows

**Nowhere on this site does any page state or imply that Dylan/DEF is licensed, bonded, insured,
certified, a security guard company, a professional monitoring company, an alarm monitoring centre,
or authorized to provide any regulated service.** None of that is confirmed, and this is called out
explicitly and repeatedly (About page, Security page, AI Concierge disclaimer, footers). Every new
security/technology feature defaults to a **Technology Showcase** badge — the safe default that
avoids implying an active business capability — unless a different honest status genuinely applies
(Coming Soon, Assessment Required, etc.). Nothing claims 24/7 response, professional monitoring, or
emergency response.

## File list

```
def-property-maintenance/
├── index.html                 Home — hero, DEF AI Property Concierge, traditional-vs-AI contrast,
│                               lead-capture flow, 7 maintenance categories, Security & Property
│                               Protection teaser, "One Company. One Property." differentiator,
│                               customer journey, About/Service Area teasers
├── services.html               Full grid of the 7 maintenance categories + detail sections
│                               (unchanged pattern), with a cross-link into Security & Smart Property
├── security.html                NEW — Smart Security & Property Protection hub: 8 technology
│                               categories (card grid + detail sections, same pattern as
│                               services.html) plus the 7-layer Security Layers model
├── smart-property.html          NEW — Environmental Protection, Pet & Property Safety, Smart
│                               Property Automation (example flow chains), DEF Property Intelligence
│                               (concept-only dashboard mockup), "One Company. One Property." detail,
│                               and the Future Technology Roadmap
├── security-assessment.html     NEW — interactive, demo-only, multi-step Security Assessment that
│                               generates a simulated "DEF Property Protection Profile" referencing
│                               the 7-layer model. No network calls.
├── service-matrix.html          NEW — one table applying all 5 extended status labels across both
│                               the 7 maintenance categories and every security/technology category
├── property-care.html           Detail page: "Property Maintenance" concept (unchanged)
├── seasonal-services.html       Detail page: "Seasonal Property Care" concept (unchanged)
├── projects.html                 Concept gallery — now 14 illustrative CSS/SVG placeholder tiles,
│                               spanning the original 7 maintenance categories plus Security
│                               Technology, Smart Property, Pet Containment, and a Before & After
│                               illustration. Still explicitly "concept only," never a real photo.
├── about.html                    About Dylan / DEF Property Maintenance & Security (conservative,
│                               no invented credentials), including the "DEF" name meaning and an
│                               explicit non-claim about security licensing/monitoring
├── service-area.html            Placeholder service area page with a stylized CSS/SVG graphic
│                               (unchanged)
├── request-service.html          Demo AI Concierge + a substantially expanded, demo-only intake
│                               form (service type, property type, maintenance/security/smart-
│                               property/pet-containment categories, urgency, existing/desired
│                               technology, local-only photo preview, contact info) + customer
│                               journey diagram
├── contact.html                   Placeholder contact details, a new Urgent Request triage section
│                               (routes to a call or Request Service — never a response-time
│                               promise), and the demo contact form
├── css/
│   └── style.css                  Shared stylesheet — original design tokens/components plus the
│                               extended status-badge set, security-layers stack, automation flow
│                               chains, dashboard mockup, service-matrix table, urgent-triage cards,
│                               local photo-upload preview, and the About-page "DEF meaning" aside
├── js/
│   ├── nav.js                      Mobile hamburger nav toggle (unchanged)
│   ├── forms.js                     Demo form validation + success-state handling (no network
│   │                                calls), the Concierge → Request Service URL hand-off, and the
│   │                                new local-only photo preview for the intake form's photo field
│   ├── concierge.js                  DEF AI Property Concierge — now asks a free-text property
│   │                                description, runs a small fixed keyword-matching function to
│   │                                build a simulated "Property Profile," asks 1–2 intelligent
│   │                                follow-ups, and suggests technology categories from the full
│   │                                maintenance + security/technology list — still a scripted
│   │                                decision tree with zero network calls, see below
│   ├── assessment.js                  NEW — drives the Security Assessment demo's multi-step form
│   │                                and generates its simulated "DEF Property Protection Profile"
│   │                                (recommended layers + suggested categories) from a small,
│   │                                fixed set of if/else rules. No network calls.
│   ├── gallery.js                     Generates the projects.html concept tiles (CSS/SVG only),
│   │                                now covering 14 concepts across all categories
│   └── reveal.js                      Shared scroll-reveal animation (IntersectionObserver, no
│                                    dependencies) — see "Visual/motion design notes" below
└── README.md                      This file
```

All 16 pages share the same header navigation, footer, and stylesheet for a consistent feel.

## How to run locally

No build step and no dependencies. Either:

1. **Open directly in a browser:** double-click `index.html` (or open it via `File → Open`). Every
   page works from the `file://` protocol — no ES modules, no bundler, no server required.
2. **Or serve it statically** (optional, e.g. to test more realistically):
   ```bash
   cd def-property-maintenance
   npx serve .
   ```
   Then visit the printed local URL.

There is nothing to install, configure, or connect. No API keys, no database, no analytics.

## How to "build"

There is no build step. There is no `package.json`, no bundler, no compiler, and nothing to
`npm install`. The HTML/CSS/JS in this directory is exactly what ships — editing a file and
reloading the page is the entire workflow.

## How to deploy

**This prototype is not deployed anywhere, and deploying it is not authorized by this pass of
work.** Before it could be, Dylan/Derek would need to make a few deliberate decisions — see
"Production requirements" below for the full list, including the security-specific items (hardware
partnerships, licensing research, possible regulatory compliance) that go well beyond a normal
static-site launch checklist.

## Status-badge system (extended)

The original three-badge system has been extended to five additional statuses to honestly cover
security/technology content without ever implying an active business capability:

| Badge | Meaning | Used for |
|---|---|---|
| `badge-potential` — Potential Service | An idea under consideration, not yet planned for launch. | Some of the 7 maintenance categories |
| `badge-coming-soon` — Coming Soon | Planned for future activation, not bookable yet. | Some of the 7 maintenance categories |
| `badge-tbc` — Availability TBC | Status is Dylan's call. | Some of the 7 maintenance categories |
| `badge-available` — Available — Confirmed | Genuinely active today. | **Not used anywhere in this prototype** — the badge exists in the system for the day something real launches. |
| `badge-showcase` — Technology Showcase | Illustrates a category conceptually; **the default for every new security/technology capability** unless told otherwise. | Nearly all security/smart-property categories |
| `badge-assessment` — Assessment Required | Too site-specific to describe generically; needs an actual visit. | Ground / Perimeter Sensing |
| `badge-business-confirm` — Business Confirmation Required | Needs Dylan's sign-off before it can be claimed at all. | Professional/third-party monitoring partnership, 24/7 emergency response — see `service-matrix.html` |

No category anywhere in this prototype carries "Available — Confirmed." The `service-matrix.html`
page is the single place to see every category's status side by side.

## Demo functionality — everything simulated, listed explicitly

Every interactive feature below runs **entirely in the browser**. None of them make a `fetch`/XHR/
WebSocket call, none write to `localStorage`/`sessionStorage`/cookies, and none persist anything
after the page is reloaded or closed.

1. **DEF AI Property Concierge** (`js/concierge.js`, on `index.html` and `request-service.html`) —
   a fixed decision tree, not a real AI. It now includes a free-text "describe your property" step;
   a small, fixed keyword-matching function (`parsePropertyDescription`) looks for a short list of
   substrings (rural, driveway, pets, garage, gate, fencing, water/basement, "no security", etc.)
   and uses them to render a simulated **Property Profile** (detected traits, existing-security
   follow-up, stated priority, and suggested technology categories from the full maintenance +
   security/technology list). It never invents a fact the visitor didn't imply, never quotes a
   price, never promises a schedule, and never claims DEF is licensed/insured/a monitoring company.
2. **Security Assessment** (`security-assessment.html` + `js/assessment.js`) — a 5-step demo form
   (property basics, access & grounds, current technology, concerns & desired automation, budget &
   contact) that generates a simulated **DEF Property Protection Profile**: recommended layers from
   the 7-layer Security Layers model plus suggested technology categories, computed by a small fixed
   set of if/else rules run against the visitor's own answers. No price is generated.
3. **DEF Property Intelligence dashboard** (`smart-property.html`) — a static UI mockup with fixed
   example values (Security: SECURE, Cameras: 8 ONLINE, etc.), explicitly labeled "CONCEPT
   DEMONSTRATION" in the page and in a visible caption. It is not live data and is not connected to
   any device, sensor, or property.
4. **Smart Property Automation chains** (`smart-property.html`) — four illustrated example
   automation sequences (e.g. "Motion detected → light activates → camera records → owner
   notified → event logged"), explicitly framed as a demonstration of possible automation, not a
   claim that DEF currently operates any of it.
5. **Expanded Request Service form** (`request-service.html`) — collects service type (Property
   Maintenance / Security / Smart Property / Pet Containment / Multiple Services), property type,
   location, category, urgency, existing/desired technology, a project description, an optional
   local-only photo preview (see below), and contact info. Client-side validated, on-page success
   state only — no email, no server call.
6. **Local-only photo preview** (`js/forms.js`, on the Request Service form) — uses `FileReader` to
   render chosen image files as thumbnails directly in the page. Files are never attached to a
   network request, never uploaded, and vanish on reload.
7. **Urgent Request triage** (`contact.html`) — a simple routing UI ("Property damage," "Security
   concern," "Gate/access problem," "Water/environmental issue," "Other") that links to either the
   phone placeholder or the Request Service form. It explicitly does **not** claim 24/7 or emergency
   response, and tells a visitor with a genuine emergency to contact real emergency services instead
   of this site.
8. **Concept gallery** (`projects.html` + `js/gallery.js`) — 14 CSS/SVG placeholder tiles (no photos
   of real work), each carrying its category's real status badge, now spanning maintenance,
   Security Technology, Smart Property, Pet Containment, and a Before & After illustration.
9. **Demo contact / intake forms generally** (`js/forms.js`) — shared client-side validation and
   success-panel logic; no form anywhere in this prototype has an `action` attribute or a
   `fetch`/XHR call.

## Full list of information Dylan must confirm before this could go live

This prototype intentionally invents **none** of the following. Before any version of this site is
made public or connected to real customers, Dylan needs to supply/confirm:

**Business identity & legitimacy**
- Legal/trading business name (confirm "DEF Property Maintenance & Security" is the intended final name)
- Business phone number, email address, physical/mailing address (if shown), business hours
- Any licenses, certifications, insurance, or bonding to disclose (none are currently claimed —
  this applies to maintenance work **and** to any security/technology installation or monitoring)
- Years in operation / founding date, team size, or who performs the work (none currently claimed)

**Maintenance services**
- Which of the 7 listed maintenance categories are actually going to be offered, and on what timeline
- Real status for each category (replacing the illustrative Potential/Coming Soon/TBC labels here)
- Real descriptions of what's included/excluded, and any categories to add or remove

**Security / smart-property technology**
- Whether DEF will actually assess, install, or coordinate any of the security/technology categories
  shown, and which ones — none are currently sold, installed, or monitored
- Any hardware, vendor, or platform partnerships (none are named or implied anywhere in this
  prototype — see "Production requirements" below)
- Whether any form of professional/third-party monitoring partnership will ever be offered (labeled
  "Business Confirmation Required" in this prototype; DEF does not operate monitoring today)
- Whether 24/7 or emergency response will ever be offered (also "Business Confirmation Required";
  not offered today, and this prototype never implies otherwise)
- What, if any, licensing or regulatory requirements apply to security-technology work in Dylan's
  jurisdiction (not researched as part of this prototype — see below)

**Commercial details**
- Pricing or pricing model for either line (nothing is priced anywhere in this prototype, including
  in the Security Assessment's "budget range" field, which only records the visitor's own guess)
- Payment methods, cancellation/rescheduling policy, minimum job size or call-out fee

**Service area**
- The actual geographic area(s) served — `service-area.html` is a placeholder with no real location data
- Whether a real map/embed is wanted, and what provider (an external dependency not present today)

**Trust content**
- Real customer testimonials/reviews, real project photography, a real photo of Dylan, any awards
  or affiliations — none exist or are implied anywhere in this prototype

**Operational / journey details**
- How requests should actually be received and reviewed, what "scheduling" looks like in practice,
  and what follow-up after a job should involve — `request-service.html` only demonstrates the
  *shape* of a flow, with no backend behind it

**Technical/legal**
- A real domain name and hosting plan
- Privacy policy / terms of service, if the site will ever collect real customer data
- Analytics or lead-tracking requirements, if any (deliberately none today)
- Any accessibility or regulatory requirements specific to Dylan's jurisdiction — **for the security
  line specifically, this may include licensing for alarm/security work, rules around camera or
  license-plate-recognition use, and requirements for anyone offering monitoring or access-control
  services.** This prototype does not research or resolve any of that; it is flagged here as a real,
  separate piece of work Dylan/Derek would need before the security line could operate for real.

Until these are confirmed, this prototype should be treated strictly as an internal
feedback/design artifact.

## Technology assumptions made by this prototype

To keep the security/smart-property content honest while still showing what a real offering could
look like, this prototype makes a few explicit, disclosed assumptions — none of which are claims
about real capability:

- No specific hardware brand, vendor, platform, or monitoring-service partner is named anywhere.
  Every technology category is described generically (e.g. "smart locks," not a named product).
- License-plate-aware camera capability is mentioned once (on `security.html`) only as something
  that would apply "where legally appropriate" — this prototype makes no claim about what's legal in
  any specific jurisdiction and does not recommend using it.
- The 7-layer Security Layers model, the automation chains, and the DEF Property Intelligence
  dashboard are original illustrative frameworks built for this prototype, not descriptions of any
  real product or existing DEF system.
- "Ground / Perimeter Sensing" is deliberately the one category marked "Assessment Required" rather
  than "Technology Showcase," because it's genuinely too site-specific (terrain, property size,
  fencing) to describe generically the way an indoor sensor can be.

## Production requirements — what "making the security line real" would actually take

This is flagged explicitly for Dylan: expanding into smart security/property-protection technology
for real is **not** something this static prototype resolves, and it's a meaningfully bigger step
than adding a new page to a maintenance website. At minimum it would need:

- **Real hardware/vendor partnerships.** Every camera, sensor, lock, and lighting category shown
  here is generic; an actual offering needs specific products, suppliers, and pricing.
- **Licensing and regulatory research**, which varies by jurisdiction and may include: licensing to
  sell/install alarm or security equipment, rules around camera placement and license-plate capture,
  data-retention and privacy obligations for recorded video, and separate licensing/insurance
  requirements if DEF ever wants to offer monitoring, access control, or anything positioned as a
  "security service" rather than a technology-installation service. **This prototype has not done
  this research and does not attempt to.** It's a real consideration for Dylan to look into before
  any of the security content becomes a genuine offering, not something solved by this pass of work.
- **Insurance and liability review**, separate from (and likely more involved than) whatever
  coverage a maintenance-only business would carry, given the nature of security/access-control work.
- **A real backend**, if any of the "concept" features (the Property Intelligence dashboard, the
  automation chains, device status) are ever meant to reflect real, live data — none of that exists
  today; see "AI integration requirements" below for the closely related concierge case.
- **A decision on monitoring.** If DEF ever wants to offer or partner for professional/third-party
  monitoring or emergency escalation, that is its own regulated business decision, not a feature to
  flip on — this prototype deliberately never promises it.

None of this exists yet, and none of it is committed to. It's listed here so "add real security
services" isn't mistaken for a simple content update once Dylan reviews this prototype.

## Visual/motion design notes

A polish pass was applied on top of the existing spruce/teal + terracotta system, then extended
again for the security/technology content, to keep a consistent "wow factor" and established-company
feel without changing the palette, the honest status-badge meanings, or breaking any existing
pattern. Everything below is pure CSS + small vanilla-JS files — no libraries, no CDNs, no network
calls, no build step.

- **Scroll-triggered reveals (`js/reveal.js`, `.reveal`/`.reveal.is-visible` in `css/style.css`).** A
  single shared `IntersectionObserver` script fades/slides content into view as it scrolls into the
  viewport, applied across every page including the new security/smart-property sections, the
  Security Layers stack, automation flow chains, the DEF Property Intelligence dashboard, and the
  Service Matrix table. The script's element-dedup logic was fixed during this pass: it now tracks
  "already bound" state on a `data-reveal-bound` attribute instead of the `reveal` CSS class itself,
  so markup that's authored with `class="reveal"` already in the HTML (several new sections use this
  pattern, matching one pre-existing example on `projects.html`) is still picked up and properly
  animated to visible — previously such elements could be permanently skipped and stay invisible.
  A few extra selectors (`.text-center.reveal`, `.dashboard-mock`, `.matrix-scroll`, `.layers`,
  `.flow-chain`, `.triage-grid`) were added so these new components participate correctly.
- **`prefers-reduced-motion: reduce` support (hard requirement, unchanged).** A blanket rule collapses
  every animation/transition site-wide, and the reveal/hero/badge-pulse systems are additionally
  scoped inside `@media (prefers-reduced-motion: no-preference)` so a reduced-motion visitor sees the
  finished page immediately, fully visible, no motion, no delay. Verified for the new pages and
  components during this pass (see "Testing" notes in the working session, not duplicated here).
- **No new dependencies, no overflow.** Every new component is inline CSS/JS living in
  `css/style.css`, `js/reveal.js`, `js/concierge.js`, and the new `js/assessment.js` — no CDN
  scripts, no web fonts, no images, no `fetch`/`XHR`/`WebSocket` calls anywhere in the codebase.

## Design notes

- **Palette:** unchanged — a deep spruce/forest-teal (`--ink-*` tokens) paired with a warm terracotta
  accent (`--accent-*`) and warm off-white paper background. The new `badge-showcase` status uses a
  restrained violet/indigo so it never reads as "green/active," and `badge-business-confirm` uses a
  dashed red-adjacent border to read clearly as "not yet," not as an error state.
- **Type:** system font stack only (no Google Fonts / CDN font loads).
- **Accessibility:** semantic landmarks, a skip-to-content link on every page, a logical heading
  hierarchy, visible `:focus-visible` states, a fully keyboard-operable hamburger nav, `alt`/
  `aria-label` text on all meaningful graphics, decorative icons marked `aria-hidden="true"`. The
  Security Assessment's multi-step form moves focus to each step's heading as it advances, and its
  progress meter carries `role="progressbar"` with live `aria-valuenow`.
- **No external network calls at runtime:** no analytics, no CDNs, no web fonts, no maps API, no
  AI/model API. The DEF AI Property Concierge and the Security Assessment are both hard-coded
  logic, not real AI calls — see "AI integration requirements" below.

## Prototype limitations

Read this before treating anything in this prototype as functional:

- **The "AI" is not AI.** The DEF AI Property Concierge (`js/concierge.js`) is a fixed, hard-coded
  decision tree with pre-written responses; its "Property Profile" step is simple keyword matching
  on the visitor's own text, not a model call. It cannot answer anything outside its scripted steps.
- **The Security Assessment is not a real assessment.** `js/assessment.js` runs a small, fixed set of
  if/else rules against the visitor's own answers. No professional reviews anything, no price is
  generated, and no installation availability is implied.
- **The DEF Property Intelligence dashboard is a static mockup.** Every value is fixed content baked
  into the page. It is not live, not refreshed, and not connected to any device.
- **No form submits anywhere.** Every form on the site intercepts its own submit event, validates
  client-side, and swaps in an on-page success state. None has an `action` attribute; none performs
  a `fetch`/XHR call.
- **No service or technology category is confirmed active.** See the status-badge table above and
  `service-matrix.html` for the full picture.
- **Nothing persists.** No `localStorage`, `sessionStorage`, or cookies are used anywhere. The only
  data that crosses a page boundary is the Concierge → Request Service hand-off (URL query string,
  single navigation, not saved afterward).
- **No real business details, hardware partnerships, or licensing status exist yet.** Phone, email,
  address, hours, certifications, years in operation, pricing, vendor partnerships, and monitoring
  partnerships are all placeholders or explicitly unconfirmed — see the confirmation list above.
- **No real photography, testimonials, certifications, stats, or awards** appear anywhere.

## Required images/assets

None of the following exist in this prototype today — every image area is a labeled placeholder
frame or a hand-built inline SVG, never a real photo or graphic:

- A real headshot photo of Dylan (About page currently shows a placeholder silhouette icon)
- Real project/work photography for the homepage and service pages
- A real logo (currently a simple inline SVG "house" mark used as a stand-in brand icon)
- A real map or location graphic for `service-area.html`
- Real product photography for any security/technology category, if Dylan confirms specific hardware
- A favicon / app icon set (none is currently defined)

## Future production tasks

Roughly in the order they'd need attention before this could become a real, public site:

1. Confirm the business information listed above (name, contact details, service area, pricing,
   which maintenance categories and which security/technology categories actually launch).
2. Resolve the security-specific items above: hardware/vendor partnerships, licensing/regulatory
   research, insurance/liability review, and a real decision on monitoring/emergency response.
3. Replace every placeholder image/graphic with real assets.
4. Update each category's status badge and descriptive copy to reflect reality, and remove any
   category that won't launch.
5. Decide how incoming requests should actually be received and handled (see "AI integration
   requirements" below if that includes a real AI concierge; otherwise a plain form-to-email/CRM
   integration would need a real backend of its own).
6. Add a privacy policy / terms of service before collecting any real visitor data.
7. Choose a domain and hosting plan, then deploy.
8. Remove the `noindex, nofollow` robots tag and all "Prototype / Demo" banners/footers once the
   site is genuinely ready for the public.
9. Revisit the "Future Technology Roadmap" (`smart-property.html`) and decide what's actually needed
   for launch versus genuinely future direction.

## AI integration requirements

The DEF AI Property Concierge in this prototype is intentionally fake — a scripted decision tree
with keyword matching and zero external calls. If Dylan/Derek later want a **real** AI-assisted
concierge (or a real backend behind the Security Assessment), that is a separate, non-trivial
project. At minimum it would need:

- **An API key held server-side only** — never embedded in client-side JavaScript, which is all this
  static site has.
- **A real backend endpoint** the browser calls instead of a model provider directly.
- **Conversation logging considerations** — deciding whether/how conversations are logged, for how
  long, who can access them, and how that's disclosed to visitors.
- **The same guardrails already baked into this demo's scripted copy**, enforced against a real
  model's output instead of assumed: never claim a category is active/bookable/installed when its
  real status says otherwise, never invent a price or quote, never promise a schedule or 24/7/
  emergency response, and never state or imply DEF is licensed/insured/a monitoring company. A real
  model needs these enforced by the backend, not just trusted to "know better."
- **Rate limiting**, to prevent cost blowouts or abuse once a real, billed API is involved.
- **A fallback UX** for when the AI service is slow, errors, or is deliberately disabled — ideally
  falling back to something like this prototype's scripted flow or a plain form.

None of this exists yet. The current widgets are safe to demo publicly precisely because they make
no calls to anything.

## Future architecture roadmap

The following are **not built** and are out of scope for this prototype. They're listed here so
it's clear what "make it real" would actually involve, not because any of them is planned or
committed:

- Content management system (CMS)
- Lead dashboard (for viewing/managing captured requests)
- AI configuration panel (for managing a real AI concierge's behavior, if one is ever built)
- Real device/sensor integration behind the DEF Property Intelligence dashboard
- Analytics, SEO tooling/strategy
- Customer management (CRM)
- Appointment/scheduling system
- Email/SMS notifications
- Production database
- Authentication (for any staff-facing tools above)
- Real domain deployment
- Real monitoring-service partnership or emergency-escalation integration

Any future integration of this business's tooling with Derek's broader business infrastructure would
be a separate, deliberate decision made later, and is not assumed, implied, or in progress anywhere
in this prototype.
