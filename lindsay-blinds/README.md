# Lindsay Blinds — Visual Prototype

This is a **static, self-contained visual prototype** for a possible Lindsay Blinds
website, built for review with the business owner, Marc Bilz. It is **not** a live
site, is not connected to any backend, and does not send or store any real data.

## What this is / is not

- This **is**: a clickable design concept to gather feedback on layout, content
  structure, tone, and the consultation flow idea.
- This is **not**: a production website, a lead-generation tool, or a system
  connected to email, a database, or any real AI service. Nothing typed into any
  form on this site is transmitted anywhere.

## File list

```
lindsay-blinds/
├── index.html            Home page
├── products.html         Product/service categories (Blinds, Shades, Shutters,
│                          Motorization, Repair/Service, Consultation help)
├── about.html             About Marc / the business
├── gallery.html            Placeholder project gallery (SVG placeholder tiles)
├── consultation.html      4-step guided consultation flow + mock "AI Consultation
│                          Assistant" chat widget
├── css/
│   └── style.css         Shared stylesheet (palette, layout, components)
├── js/
│   ├── nav.js             Mobile hamburger nav + active-link highlighting
│   ├── gallery.js          Generates the placeholder gallery tiles
│   └── consultation.js    Wizard logic, validation, mock AI chat, photo preview
└── README.md              This file
```

Contact information (phone, footer) is duplicated per page rather than injected
via a shared template, since the site intentionally has **no build step** and
must work by opening an `.html` file directly (`file://`) as well as from any
static file server.

## How to run locally

**Option 1 — open directly:**
Double-click `index.html` (or any other page) to open it in a browser. Every
page works standalone via `file://` — no server required.

**Option 2 — static file server (optional, for a more realistic URL structure):**
```bash
cd lindsay-blinds
npx serve .
# or: python3 -m http.server 8080
```
Then visit the printed local URL (e.g. `http://localhost:3000` or
`http://localhost:8080`).

No `npm install`, build step, or internet connection is required either way.
The only outside resource pages might reasonably reach for is a system font —
this prototype uses only OS-installed fonts (`system-ui` / serif stacks), so
even that isn't fetched over the network.

## Verified facts vs. placeholders

The **only verified fact** used throughout this prototype is:

- Marc's phone number: **705-808-3022** (shown as "Call Marc: 705-808-3022",
  linked as `tel:7058083022`)

Everything else that would normally require real business information is shown
as a clearly labeled placeholder, e.g. `[Placeholder — confirm with Marc]`, or
kept deliberately vague/conservative. **Before this could go anywhere near
"live," Marc needs to confirm or supply:**

1. **Business email address** — currently a placeholder in every page footer.
2. **Street address / office or showroom location** (if any) — currently a
   placeholder in every page footer.
3. **Exact service area** — the site only ever says "Kawartha Lakes area" and
   explicitly flags that the precise boundaries need confirmation
   (see the Service Area section on the home page).
4. **Owner bio / credentials** (about.html) — currently contains only
   conservative, non-specific claims ("local," "personal service"). No years in
   business, certifications, training, licensing, insurance, or project counts
   are stated anywhere; if any of these are real and Marc wants them included,
   he needs to supply the exact wording.
5. **Real headshot photo of Marc** — about.html currently shows a clearly
   labeled placeholder graphic in place of a real photo.
6. **Real project/installation photography** — gallery.html and the home page
   gallery teaser use inline SVG/CSS placeholder graphics only, each labeled
   "Placeholder project photo — replace with real installation photography."
   No stock photos were used or should be substituted; only real Lindsay
   Blinds project photos should replace these.
7. **Product/material/brand details** — products.html flags specific gaps
   (e.g., "[Placeholder — confirm current material/brand options with Marc]")
   for blinds, shades, shutters, motorization systems/brands, and which
   products/brands are serviced for repairs. No prices, availability, or
   specific product lines are stated anywhere on the site.
8. **Testimonials, awards, or certifications** — intentionally omitted
   entirely; none were invented. If Marc has real ones he wants to use, they
   should be added with his approval and exact wording.
9. **Business hours / response-time expectations** — not stated anywhere;
   would need to be added if desired.
10. **Legal/business details** for a real launch — e.g. business number,
    licensing, insurance disclosures, privacy policy, accessibility statement,
    terms of use — none of this exists in the prototype and all would need to
    be drafted before a real public launch.
11. **The "AI Consultation Assistant" is a scripted mock**, not a real AI
    integration. If a real assistant is ever built, it would need real
    guardrails (no price quotes, no promised dates, no availability claims, no
    impersonating Marc) reimplemented server-side — the copy in this prototype
    only demonstrates the intended tone and restrictions.

## No real data is transmitted or stored

This is true throughout the site, by design:

- There is **no backend, database, or server-side code** anywhere in this
  project — it is plain HTML/CSS/JS with zero dependencies.
- The consultation form (`consultation.html`) intercepts its `submit` event in
  JavaScript, runs client-side validation, and then simply shows/hides DOM
  elements to display a "success" screen. **No `fetch`, `XMLHttpRequest`, or
  `WebSocket` call exists anywhere in the codebase** — you can verify this by
  searching the `js/` folder.
- The Step 4 photo upload uses a local `FileReader` purely to render an
  in-browser thumbnail preview. Files are **never uploaded, transmitted, or
  saved** anywhere — they exist only transiently in the browser tab and are
  discarded when the page is closed or reset.
- The "AI Consultation Assistant" panel on consultation.html is a **hard-coded
  scripted chat** (a small JS state machine with fixed responses). It does not
  call any AI API, does not send your input anywhere, and cannot go "off
  script."
- The site makes **no outbound network requests at runtime** — no analytics,
  no CDNs, no external fonts or scripts. This can be verified by inspecting
  the browser's network tab while using the site: it will show no requests
  beyond the initial page/asset loads from disk or the local static server.
- Every page carries a small "Prototype / Demo — not a live site" badge in the
  footer as a visible reminder of this.

## Accessibility notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`, `section`) and a
  logical heading hierarchy are used throughout.
- All interactive elements (mobile menu, wizard steps, quick-reply chat
  buttons, form controls) are keyboard-operable and show a visible focus
  ring.
- The mobile hamburger menu is a real toggle button with `aria-expanded`,
  traps focus into the panel on open, and closes on `Escape` or backdrop
  click.
- Form errors are shown inline, are associated with their fields, and use
  `role="alert"` so they're announced by screen readers; on failed validation
  focus moves to the first invalid field.
- All placeholder gallery graphics carry descriptive `alt`/`aria-label` text
  following the pattern: "Placeholder project photo — replace with real
  installation photography. Category: … Room type: …"
