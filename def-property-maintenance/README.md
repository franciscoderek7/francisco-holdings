# DEF Property Maintenance — Visual Prototype

This directory is a **self-contained, static visual prototype** built for Dylan to review as a
concept for a possible property-maintenance business expansion. It is **not** a live website, has
no backend, sends no data anywhere, and should not be linked from or confused with any production
system.

## What this is (and isn't)

- **Is:** a design concept and interaction prototype, meant to gather feedback on structure, tone,
  and visual direction before any real content, pricing, or service commitments exist.
- **Isn't:** a live booking system, a functioning contact form, a real map, or a source of truth
  for Dylan's actual business details. Every page carries a "Prototype / Demo" banner and footer
  note saying so.

## File list

```
def-property-maintenance/
├── index.html               Home — hero, service overview grid, journey diagram, About/Service Area teasers
├── services.html            Full grid of all 7 service categories + in-page detail sections
├── property-care.html       Detail page: "Property Maintenance" concept
├── seasonal-services.html   Detail page: "Seasonal Property Care" concept
├── about.html                About Dylan / DEF Property Maintenance (conservative, no invented credentials)
├── service-area.html        Placeholder service area page with a stylized CSS/SVG graphic
├── request-service.html     Interactive demo intake flow + customer journey diagram
├── contact.html              Placeholder contact details + demo contact form
├── css/
│   └── style.css             Shared stylesheet (design tokens, layout, components)
├── js/
│   ├── nav.js                 Mobile hamburger nav toggle (keyboard accessible)
│   └── forms.js                Demo form validation + success-state handling (no network calls)
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
- **No external network calls at runtime:** no analytics, no CDNs, no web fonts, no maps API. The
  "map" on `service-area.html` is a hand-built inline SVG illustration, not real geographic data.

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
