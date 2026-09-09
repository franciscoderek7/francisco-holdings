# DEF Property Maintenance — Visual Prototype

This directory is a **self-contained, static visual prototype** built for Dylan to review as a
concept for a possible property-maintenance business expansion. It is **not** a live website, has
no backend, sends no data anywhere, and should not be linked from or confused with any production
system.

## Business name / status

"DEF Property Maintenance" is a **working name only**, used as a placeholder to give this concept
prototype a consistent identity. It is not confirmed as the real trading or legal name of any
business. No entity currently operates under this name as far as this prototype is concerned.

## Current status

- **Stage:** internal concept / design prototype, shared for feedback only.
- **Not deployed:** this directory has never been published to a live domain and is not linked
  from any production system.
- **Not connected to anything real:** no backend, no database, no AI service, no analytics, no
  payment processor, no scheduling tool, no CRM.
- **No service is confirmed active.** Every one of the seven service categories carries an
  explicit status badge (Potential Service / Coming Soon / Availability TBC) everywhere it
  appears, including inside the new Demo AI Concierge described below.

## What this is (and isn't)

- **Is:** a design concept and interaction prototype, meant to gather feedback on structure, tone,
  and visual direction before any real content, pricing, or service commitments exist.
- **Isn't:** a live booking system, a functioning contact form, a real map, a real AI assistant, or
  a source of truth for Dylan's actual business details. Every page carries a "Prototype / Demo"
  banner and footer note saying so.

## File list

```
def-property-maintenance/
├── index.html               Home — hero, Demo AI Concierge, traditional-vs-AI contrast, lead-capture
│                             flow diagram, service overview grid, customer journey diagram,
│                             About/Service Area teasers
├── services.html            Full grid of all 7 service categories + in-page detail sections
├── property-care.html       Detail page: "Property Maintenance" concept
├── seasonal-services.html   Detail page: "Seasonal Property Care" concept
├── about.html                About Dylan / DEF Property Maintenance (conservative, no invented credentials)
├── service-area.html        Placeholder service area page with a stylized CSS/SVG graphic
├── request-service.html     Demo AI Concierge (top of page) + interactive demo intake flow +
│                             customer journey diagram
├── contact.html              Placeholder contact details + demo contact form
├── css/
│   └── style.css             Shared stylesheet (design tokens, layout, components, incl. the
│                              concierge widget, compare section, and lead-flow diagram styles)
├── js/
│   ├── nav.js                 Mobile hamburger nav toggle (keyboard accessible)
│   ├── forms.js                Demo form validation + success-state handling (no network calls),
│   │                            plus reading the AI Concierge hand-off from the URL to prefill
│   │                            the Request Service form
│   └── concierge.js            Demo AI Concierge — scripted decision-tree chat widget (no real
│                                AI, no network calls; see "AI integration requirements" below for
│                                what a real backend would need)
└── README.md                  This file
```

All 8 pages share the same header navigation, footer, and stylesheet for a consistent feel.

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

**This prototype is not deployed anywhere.** Before it could be, Dylan/Derek would need to make a
few deliberate decisions:

1. Choose and register a real domain (or a subdomain of an existing one).
2. Choose a static hosting provider (e.g. Netlify, Vercel, GitHub Pages, Cloudflare Pages, or a
   plain web host) — any of them can serve this directory as-is, since it's static HTML/CSS/JS.
3. Remove or update the `noindex, nofollow` robots meta tag and the "Prototype / Demo" banner/
   footer notes once (and only once) real content replaces every placeholder.
4. Decide whether any of the "Future architecture roadmap" items below are needed before launch,
   or after.

No deployment step exists today, and none should be taken until Dylan has confirmed the business
details listed further down.

## Proposed service architecture & status-labeling approach

The prototype treats "services" as a small, repeatable pattern rather than one-off page content,
specifically so the real business can grow into it later without a redesign:

1. **One card component, one detail-section component.** Every service category — regardless of
   how developed the idea is — uses the same card markup on `index.html`/`services.html` and the
   same detail-section markup on `services.html` (and, for the two most-developed concepts, their
   own dedicated pages: `property-care.html` and `seasonal-services.html`). Adding an eighth
   category, or fleshing out a stub into a full page, means duplicating an existing block — not
   inventing new layout.

2. **Status is a separate, explicit attribute of every category**, never baked into the copy. Three
   badge states are defined in `css/style.css` (`.badge-potential`, `.badge-coming-soon`,
   `.badge-tbc`) and used consistently:
   - **Potential Service** — an idea under consideration, not yet planned for launch.
   - **Coming Soon** — planned for future activation, not bookable yet.
   - **Availability TBC** *("Service availability to be confirmed")* — status is Dylan's call.

   None of the seven categories is ever presented as active or bookable today. When Dylan decides a
   category is ready, "activating" it is meant to be a small, contained change: swap its badge,
   replace the conceptual "could include" bullets with real ones, and (optionally) wire up
   `request-service.html`'s category dropdown to only offer active categories. The page structure,
   icons, and grid do not need to change.

3. **Icons are decorative and swappable.** Every category has one small inline SVG icon, all drawn
   in the same stroke-based style, so a category's icon can be refined later without touching
   layout.

4. **The customer-journey diagram (`Request Service → Intake → Review → Scheduling → Service →
   Completion → Follow-up`) is a separate, reusable component** (`.journey` / `.journey-step` in
   `css/style.css`) shown on both `index.html` (static overview) and `request-service.html`
   (interactive, demo-only). It's deliberately generic — it doesn't assume any particular service
   category — so it keeps working as more categories go live.

5. **All demo forms share one JS module** (`js/forms.js`) that validates fields and swaps in a
   success panel. There is no `fetch`/`XHR` call anywhere in the codebase, and no form has an
   `action` attribute — every submit is intercepted, validated client-side, and only changes
   visible DOM state. Nothing is written to `localStorage`/`sessionStorage`/cookies either, so nothing
   persists once the page is closed or reloaded.

6. **The Demo AI Concierge (`js/concierge.js`) is a single reusable widget**, mounted into any page
   via a `<div data-concierge>` container — that's how it appears on both `index.html` (prominently,
   in its own section) and at the top of `request-service.html`. It is a fixed decision tree, not a
   real AI:
   - Every assistant line is a hard-coded string; there is no model, no prompt, and no API call.
   - It walks the same shape described in the project brief: property type → service category →
     location → urgency → project details → contact info → a summary → hand-off.
   - The service-category step uses the *exact same* seven categories and status badges as
     `services.html`/`request-service.html`, from one shared list in `concierge.js`. If a visitor
     picks a "Coming Soon" or "Potential Service" category, the concierge says so explicitly and
     never implies it's bookable.
   - It never invents a price, quotes an estimate, or promises a schedule/response time — this is
     stated in the widget's own header disclaimer, reinforced again near the urgency step, and
     again in its closing summary.
   - Nothing typed into it is sent, saved, or transmitted. The only "hand-off" is a same-site link:
     finishing the conversation lands on `request-service.html?...&category=...#request-form` with
     the visitor's answers in the URL's query string, which `js/forms.js` reads (still purely
     client-side) to prefill that page's existing intake form — demonstrating "Quote Request → Lead
     Capture" without any network call or storage write.

The seven categories shown, with the illustrative status assigned in this prototype (Dylan should
treat these as placeholders to relabel, not as recommendations):

| Category | Status shown in this prototype |
|---|---|
| Property Maintenance | Availability TBC |
| Seasonal Property Care | Coming Soon |
| Small Repairs | Potential Service |
| Exterior Maintenance | Potential Service |
| Cottage / Property Services | Coming Soon |
| Turnover Services | Potential Service |
| Vendor Coordination | Availability TBC |

## Design notes

- **Palette:** a deep spruce/forest-teal (`--ink-*` tokens) paired with a warm terracotta accent
  (`--accent-*`) and warm off-white paper background — chosen to read as capable/organized "field
  services" rather than a retail storefront, and to stay visually distinct from the other unrelated
  prototypes in this repo.
- **Type:** system font stack only (no Google Fonts / CDN font loads), leaning on weight and
  letter-spacing for hierarchy so the site has zero external runtime dependencies.
- **Accessibility:** semantic landmarks (`header`/`nav`/`main`/`footer`), a skip-to-content link on
  every page, a logical heading hierarchy, visible `:focus-visible` states, a fully keyboard-operable
  hamburger nav (`Enter`/`Space` to toggle, `Escape` to close and return focus), `alt`/`aria-label`
  text on all meaningful graphics, and decorative icons marked `aria-hidden="true"`.
- **No external network calls at runtime:** no analytics, no CDNs, no web fonts, no maps API, and
  no AI/model API. The "map" on `service-area.html` is a hand-built inline SVG illustration, not
  real geographic data, and the "Demo AI Concierge" (`js/concierge.js`) is a hard-coded decision
  tree, not a real AI call.
- **Concierge widget accessibility:** the chat log is an `aria-live="polite"` region so new
  messages are announced; every choice is a real `<button>`; every text step is a labeled form
  field with the same validation pattern as the rest of the site's forms; focus moves to the next
  control after each step for fast keyboard use.

## Prototype limitations

Read this before treating anything in this prototype as functional:

- **The "AI" is not AI.** The Demo AI Concierge (`js/concierge.js`) is a fixed, hard-coded decision
  tree with pre-written responses and a fixed branch for each of the seven service categories'
  status badges. It does not call any model, API, or external service, and it cannot answer
  anything outside its scripted steps.
- **No form submits anywhere.** Every form on the site (contact, intake, concierge) intercepts its
  own submit event, validates client-side, and swaps in an on-page success state. None has an
  `action` attribute; none performs a `fetch`/`XHR` call.
- **No service is confirmed active.** The Potential Service / Coming Soon / Availability TBC badge
  system is illustrative — see the table above — and is not a recommendation for which categories
  to launch first.
- **Nothing persists.** No `localStorage`, `sessionStorage`, or cookies are used anywhere. The only
  data that crosses a page boundary is the Concierge → Request Service hand-off, which rides in the
  URL's query string for that single navigation and is not saved anywhere afterward.
- **No real business details exist yet.** Phone, email, address, hours, certifications, years in
  operation, pricing, and team size are all placeholders — see the confirmation list below.
- **No real photography, testimonials, certifications, stats, or awards** appear anywhere in this
  prototype, by design.

## Full list of information Dylan must confirm before this could go live

This prototype intentionally invents **none** of the following. Before any version of this site is
made public or connected to real customers, Dylan needs to supply/confirm:

**Business identity & legitimacy**
- Legal/trading business name (confirm "DEF Property Maintenance" is the intended final name)
- Business phone number
- Business email address
- Physical/mailing address (if any is to be shown publicly)
- Business hours
- Any licenses, certifications, insurance, or bonding to disclose (none are currently claimed)
- Years in operation / founding date (none is currently claimed)
- Team size or who performs the work (none is currently claimed)

**Services**
- Which of the seven listed categories (Property Maintenance, Seasonal Property Care, Small
  Repairs, Exterior Maintenance, Cottage/Property Services, Turnover Services, Vendor Coordination)
  are actually going to be offered, and on what timeline
- Correct status for each category (replacing the illustrative Potential/Coming Soon/TBC labels
  used in this prototype)
- Real descriptions of what's included/excluded in each active category
- Any services that should be added or removed from this list entirely

**Commercial details**
- Pricing or pricing model (nothing is priced in this prototype)
- Payment methods accepted
- Cancellation/rescheduling policy
- Any minimum job size, call-out fee, or similar terms

**Service area**
- The actual geographic area(s) served (towns, regions, radius, etc.) — `service-area.html` is a
  placeholder with no real location data
- Whether a real map/embed is wanted, and what provider (which would introduce an external
  dependency not present in this prototype)

**Trust content**
- Real customer testimonials or reviews (none are included or implied)
- Real project photography (all image areas are placeholder frames)
- A real photo of Dylan for the About page (currently a placeholder silhouette)
- Any awards, associations, or affiliations to mention

**Operational / journey details**
- How requests should actually be received (email inbox, phone, a real scheduling tool, etc.) —
  `request-service.html` only demonstrates the *shape* of a request/intake/review/scheduling/
  service/completion/follow-up flow, with no backend behind it
- Who reviews incoming requests and how
- What "scheduling" actually looks like in practice (calendar tool, manual calls, etc.)
- What follow-up after a completed job should involve, if anything

**Technical/legal (out of scope for this prototype, but needed before going live)**
- A real domain name and hosting plan
- Privacy policy / terms of service, if the site will ever collect real customer data
- Analytics or lead-tracking requirements, if any (this prototype deliberately has none)
- Any accessibility or regulatory requirements specific to Dylan's jurisdiction

Until these are confirmed, this prototype should be treated strictly as an internal
feedback/design artifact.

## Required images/assets

None of the following exist in this prototype today — every image area is a labeled placeholder
frame (`.placeholder-frame`) or a hand-built inline SVG, never a real photo or graphic:

- A real headshot photo of Dylan (About page currently shows a placeholder silhouette icon)
- Real project/work photography for the homepage and service pages (currently empty placeholder
  frames with dashed borders and captions)
- A real logo (currently a simple inline SVG "house" mark used as a stand-in brand icon)
- A real map or location graphic for `service-area.html` (currently a stylized, non-geographic
  inline SVG illustration)
- Any category-specific photography, if Dylan wants service cards to show real work instead of the
  current stroke-icon illustrations
- A favicon / app icon set (none is currently defined)

## Future production tasks

Roughly in the order they'd need attention before this could become a real, public site:

1. Confirm the business information listed above (name, contact details, service area, pricing,
   which categories actually launch).
2. Replace every placeholder image/graphic with real assets (see above).
3. Update each service category's status badge and "could include" copy to reflect reality.
4. Decide how incoming requests should actually be received and handled (see "AI integration
   requirements" below if that includes a real AI concierge; otherwise a plain form-to-email/CRM
   integration would need a real backend of its own).
5. Add a privacy policy / terms of service before collecting any real visitor data.
6. Choose a domain and hosting plan, then deploy (see "How to deploy" above).
7. Remove the `noindex, nofollow` robots tag and all "Prototype / Demo" banners/footers once the
   site is genuinely ready for the public.
8. Revisit the "Future architecture roadmap" below and decide what's actually needed for launch.

## AI integration requirements

The Demo AI Concierge in this prototype is intentionally fake — a scripted decision tree with zero
external calls. If Dylan/Derek later want a **real** AI-assisted concierge, that is a separate,
non-trivial project. At minimum it would need:

- **An API key held server-side only.** A real AI provider's API key must never be embedded in
  client-side JavaScript (which is all this static site has) — it would be publicly visible and
  abusable within minutes. This alone means the current static-only architecture is not sufficient.
- **A real backend endpoint.** Something (a small server, a serverless function, etc.) that the
  browser calls instead of a model provider directly, so the API key and request logic stay off
  the client. This is new infrastructure this prototype does not have.
- **Conversation logging considerations.** Deciding whether/how conversations are logged, for how
  long, who can access them, and how that's disclosed to visitors — none of which exists today
  because nothing is logged at all in this prototype.
- **The same guardrails already baked into this demo's scripted copy**, but enforced against a real
  model's output instead of assumed: never claim a service category is active/bookable when its
  real status says otherwise, never invent a price or quote, never promise a specific schedule or
  response time. A real model needs these enforced by the backend (e.g. via system-prompt
  constraints *and* server-side output checks), not just trusted to "know better."
- **Rate limiting**, to prevent cost blowouts or abuse once a real, billed API is involved.
- **A fallback UX** for when the AI service is slow, errors, or is deliberately disabled — ideally
  falling back to something like this prototype's scripted flow or a plain form, so a visitor is
  never stuck with nothing.

None of this exists yet. The current widget is safe to demo publicly precisely because it makes no
calls to anything.

## Future architecture roadmap

The following are **not built** and are out of scope for this prototype. They're listed here so
it's clear what "make it real" would actually involve, not because any of them is planned or
committed:

- Content management system (CMS)
- Lead dashboard (for viewing/managing captured requests)
- AI configuration panel (for managing a real AI concierge's behavior, if one is ever built)
- Analytics
- SEO tooling/strategy
- Customer management (CRM)
- Appointment/scheduling system
- Email notifications
- SMS notifications
- Production database
- Authentication (for any staff-facing tools above)
- Real domain deployment

Any future integration of this business's tooling with Derek's broader business infrastructure
would be a separate, deliberate decision made later, and is not assumed, implied, or in progress
anywhere in this prototype.
