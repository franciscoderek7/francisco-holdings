# Lindsay Blinds — Visual Prototype

## Business name / status

**Lindsay Blinds** — window coverings (blinds, shades, shutters, motorization,
repair/service) owned and operated by **Marc Bilz**, serving homeowners,
cottage owners and businesses in the **Kawartha Lakes area** of Ontario.

This repository is a **static, self-contained visual prototype** built for
internal review with Marc. It is **not** the business's live production site.
Marc's real production site is **lindsayblinds.com** — this prototype was
built independently of it (no audit of the live site was performed while
building this) and is not connected to it in any way.

## Current status

- **Prototype / demo only.** Not deployed anywhere, not linked from any real
  domain, not indexed by search engines (every page ships
  `<meta name="robots" content="noindex, nofollow">`).
- No backend, no database, no real AI service, no analytics, no third-party
  scripts. Nothing typed into any form or chat widget on this site is sent or
  stored anywhere — see "No real data is transmitted or stored" below.
- The **only verified real-world fact** used anywhere in this prototype is
  Marc's phone number: **705-808-3022** (shown as "Call Marc: 705-808-3022",
  linked as `tel:7058083022`). Every other business detail is either a
  clearly flagged placeholder or deliberately conservative, non-specific
  copy — nothing was invented (no fake email/address, prices, testimonials,
  certifications, awards, years-in-business claims, or customer counts).

## What this is / is not

- This **is**: a clickable design concept to gather feedback on layout,
  content structure, tone, the consultation flow idea, and a demonstration of
  how an AI-concierge-style front end could work.
- This is **not**: a production website, a lead-generation tool, or a system
  connected to email, a database, or any real AI service.

## Technology

Plain, dependency-free front-end code:

- **HTML** — six static pages (`index.html`, `products.html`,
  `gallery.html`, `about.html`, `consultation.html`, `contact.html`).
- **CSS** — one shared stylesheet (`css/style.css`), hand-written, no
  framework, no preprocessor.
- **JavaScript** — four small vanilla-JS files (`js/nav.js`, `js/gallery.js`,
  `js/consultation.js`, `js/contact.js`), no framework, no bundler, no
  dependencies.
- **No build step.** There is no `package.json`, no compiler, no bundler, no
  transpiler, and nothing to `npm install`.
- **No backend.** No server-side code, no database, no API of any kind.
- **No external network calls anywhere** — no CDNs, no external fonts, no
  analytics, no third-party embeds. Every page can be opened directly from
  disk (`file://`) with full functionality.

## File list

```
lindsay-blinds/
├── index.html            Home page (incl. "Traditional vs. AI-powered
│                          website" comparison section)
├── products.html         Product/service categories (Blinds, Shades, Shutters,
│                          Motorization, Repair/Service, Consultation help)
├── about.html             About Marc / the business
├── gallery.html            Placeholder project gallery (SVG placeholder tiles)
├── consultation.html      4-step guided consultation flow + demo "AI Concierge"
│                          chat widget + lead-capture flow diagram
├── contact.html           Contact details + demo-only contact form
├── css/
│   └── style.css         Shared stylesheet (palette, layout, components)
├── js/
│   ├── nav.js             Mobile hamburger nav + active-link highlighting
│   ├── gallery.js          Generates the placeholder gallery tiles
│   ├── consultation.js    Wizard logic, validation, demo AI concierge, photo preview
│   └── contact.js          Demo-only contact form validation + success state
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

## How to "build"

**There is no build step.** This is intentional: the files in this repo
*are* the deployable artifact. There is no `package.json`, no bundler
config, no compile/transpile step, and no generated output directory.
Editing an `.html`, `.css`, or `.js` file and reloading the page is the
entire workflow.

## How to deploy

**This prototype is not deployed anywhere and no deployment has been set up.**
Before any deployment decision is made:

- A hosting/domain decision needs to be made deliberately with Marc — this
  README makes no assumption about where or how it would be hosted.
- **This prototype must not be pushed to, or used to replace, Marc's existing
  production site at lindsayblinds.com.** That domain is out of scope for
  this work entirely; nothing here should touch it.
- If and when a real launch is decided, see "Future production tasks" below
  for the list of work that would need to happen first (real content, real
  backend if the AI concierge becomes real, legal pages, etc.).

## Prototype limitations

Stated plainly, for anyone reviewing this before treating it as more than a
concept:

- **The "AI Concierge" is scripted, not real AI.** It is a fixed JavaScript
  state machine with a closed set of questions, quick-reply options, and a
  small local keyword matcher for the opening free-text message. It does not
  call any AI model or API, cannot answer anything outside its script, and
  does not "learn" or adapt.
- **No form on this site submits anywhere.** The consultation wizard's
  "Submit request" button, and every other form action in the prototype,
  intercepts the submit event and only updates the page's own DOM to show a
  "success" state. No email is sent, no database is written, no server ever
  receives the data.
- **The gallery is placeholder art, not real photos.** Every image in
  `gallery.html` and the home page gallery teaser is an inline SVG graphic
  standing in for real installation photography — none of it depicts an
  actual Lindsay Blinds project.
- **The photo upload step is local-only.** Step 4 of the consultation wizard
  previews selected image files in the browser via `FileReader`; files are
  never uploaded or transmitted anywhere.
- **No testimonials, certifications, awards, or customer counts appear
  anywhere** — none were invented, and none should be added without Marc
  supplying real, exact wording.

## Required business information

Everything below is currently shown as a clearly labeled placeholder
(e.g. `[Placeholder — confirm with Marc]`) or kept deliberately vague. **Before
this could go anywhere near "live," Marc needs to confirm or supply:**

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
5. **Product/material/brand details** — products.html flags specific gaps
   (e.g., "[Placeholder — confirm current material/brand options with Marc]")
   for blinds, shades, shutters, motorization systems/brands, and which
   products/brands are serviced for repairs. No prices, availability, or
   specific product lines are stated anywhere on the site.
6. **Testimonials, awards, or certifications** — intentionally omitted
   entirely; none were invented. If Marc has real ones he wants to use, they
   should be added with his approval and exact wording.
7. **Business hours / response-time expectations** — not stated anywhere;
   would need to be added if desired.
8. **Legal/business details** for a real launch — e.g. business number,
   licensing, insurance disclosures, privacy policy, accessibility statement,
   terms of use — none of this exists in the prototype and all would need to
   be drafted before a real public launch.

## Required images / assets

- **Real headshot photo of Marc** — `about.html` currently shows a clearly
  labeled placeholder graphic (dashed outline + person icon) in place of a
  real photo.
- **Real project/installation photography** — `gallery.html` and the home
  page gallery teaser use inline SVG/CSS placeholder graphics only, each
  labeled "Placeholder project photo — replace with real installation
  photography." No stock photos were used or should be substituted; only
  real Lindsay Blinds project photos should replace these.

## Future production tasks

Work that would be needed to move this from prototype to a real, launchable
site (in no particular priority order — a real launch plan should sequence
these with Marc):

- Collect and confirm all items listed under "Required business information"
  and "Required images / assets" above.
- Replace every placeholder graphic and placeholder text block with real,
  Marc-approved content.
- Decide whether the AI concierge becomes a real, live feature (see "AI
  integration requirements" below) or stays a static/marketing element.
- Build a real submission path for the consultation form (email, CRM, or a
  simple backend) if leads need to reach Marc automatically.
- Draft legal/compliance pages (privacy policy, accessibility statement,
  terms of use) appropriate for a real public site.
- Decide on hosting and a domain strategy (see "How to deploy" above — this
  is a decision for Marc, not an assumption baked into this prototype).
- Cross-browser and real-device testing beyond what a prototype review covers.
- Decide when (if ever) to remove `<meta name="robots" content="noindex,
  nofollow">` and let the site be indexed. Every page already has a unique
  `<title>`/description, a data-URI favicon, and Open Graph tags
  (`og:title`, `og:description`, `og:type`) as of this pass — a sitemap is
  N/A for now precisely because indexing is still intentionally opted out.
  Structured data (e.g. LocalBusiness schema) is unbuilt and would need real,
  confirmed business details (address, hours) first — see "Required business
  information" above.

## AI integration requirements

The current "AI Concierge" is a **local, scripted demo** — see "Prototype
limitations" above. If a real AI-backed version is ever built, at minimum it
would need:

- **An API key / model configuration, held server-side only.** An API key
  for a real language-model provider must never be embedded in client-side
  JavaScript or shipped to the browser in any form.
- **A server-side endpoint that proxies the AI call.** The browser should
  talk to a small backend endpoint Marc's business controls, which in turn
  calls the AI provider — never the browser calling the AI provider directly.
- **Conversation logging considerations.** Any real deployment that logs
  visitor conversations needs an explicit retention policy, a way to purge
  data, and disclosure to visitors that conversations may be stored (this
  demo stores nothing, by contrast).
- **Guardrails / prompt constraints matching what this demo already
  demonstrates in its copy** — a real system prompt would need to hard-enforce
  the same rules the scripted demo follows today: never quote or estimate a
  price, never promise an installation date, never confirm product
  availability/stock, and never claim to be Marc or speak on his behalf.
  These are currently just conversation copy in the demo; in a real system
  they would need to be actual server-side constraints (e.g. system-prompt
  rules plus output filtering), since a language model cannot be trusted to
  self-enforce them from instructions alone.
- **Rate limiting** on the server-side endpoint, to control cost and prevent
  abuse.
- **Fallback behavior** for when the AI provider is slow, unavailable, or
  returns something unusable — e.g. gracefully degrading to the same
  scripted quick-reply flow this prototype already uses, or a direct
  "Call Marc" prompt.

## Future architecture roadmap

The modules below are **explicitly future and unbuilt** — nothing in this
section exists in this prototype, and none of it should be built as part of
this work. Listed here only so a future decision-maker knows what a "real"
version of this concept would eventually require:

- CMS / content management
- Lead dashboard
- AI configuration panel
- Analytics
- SEO
- Customer management
- Appointment / consultation scheduling
- Email notifications
- SMS notifications
- Production database
- Authentication
- Real domain deployment

Any future integration of this concept with Derek's broader business
infrastructure would be a separate, deliberate future decision.

## No real data is transmitted or stored

This is true throughout the site, by design:

- There is **no backend, database, or server-side code** anywhere in this
  project — it is plain HTML/CSS/JS with zero dependencies.
- The consultation form (`consultation.html`) intercepts its `submit` event in
  JavaScript, runs client-side validation, and then simply shows/hides DOM
  elements to display a "success" screen. **No `fetch`, `XMLHttpRequest`, or
  `WebSocket` call exists anywhere in the codebase** — you can verify this by
  searching the `js/` folder (or running
  `grep -rniE "fetch\(|XMLHttpRequest|WebSocket" js/ *.html`).
- The Step 4 photo upload uses a local `FileReader` purely to render an
  in-browser thumbnail preview. Files are **never uploaded, transmitted, or
  saved** anywhere — they exist only transiently in the browser tab and are
  discarded when the page is closed or reset.
- The "AI Concierge" panel on `consultation.html` is a **hard-coded scripted
  chat** (a small JS state machine with fixed questions/answers and a local
  keyword matcher for its one free-text field). It does not call any AI API,
  does not send your input anywhere, and cannot go "off script."
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
  buttons, the AI concierge's text input, form controls) are keyboard-operable
  and show a visible focus ring.
- The mobile hamburger menu is a real toggle button with `aria-expanded`,
  traps focus into the panel on open, and closes on `Escape` or backdrop
  click.
- Form errors are shown inline, are associated with their fields, and use
  `role="alert"` so they're announced by screen readers; on failed validation
  focus moves to the first invalid field.
- The AI concierge's chat log is an `aria-live="polite"` region so new
  messages are announced, and its free-text input has an explicit
  (visually-hidden) `<label>`.
- The lead-capture flow diagram on `consultation.html` is marked up as an
  ordered list (`<ol>`) with a descriptive `aria-label`, so its step order is
  conveyed to assistive tech even though the arrows between steps are purely
  decorative (`aria-hidden`).
- All placeholder gallery graphics carry descriptive `alt`/`aria-label` text
  following the pattern: "Placeholder project photo — replace with real
  installation photography. Category: … Room type: …"

## Production Implementation Plan — Contact Form Fix

This section is **pure documentation**. Nothing in it was executed. It does
**not** touch, access, or modify `lindsayblinds.com` (the real production
site) or any WordPress/Hostinger system in any way — it only records the plan
to follow once someone with the right access is ready to do that work.

**The problem:** the real production site, `lindsayblinds.com` (WordPress,
hosted on Hostinger/hPanel), currently has no working contact form on its
Contact page. A visitor filling out the existing form has no confirmed way to
actually reach Marc through it.

**The planned fix:** the **Contact Form 7** WordPress plugin, paired with
**WP Mail SMTP**. Contact Form 7 alone is not sufficient on many
WordPress + Hostinger setups — the underlying `wp_mail()` / PHP `mail()`
function is frequently blocked, unauthenticated, or silently dropped by the
host or by receiving mail servers (a very common WordPress/Hostinger failure
mode: the form "submits successfully" from the visitor's point of view, but
the email never arrives). WP Mail SMTP routes outgoing mail through a real,
authenticated sending method instead, so delivery can actually be confirmed
rather than assumed.

**Concrete steps to follow once WordPress admin access is available:**

1. **Install and activate the Contact Form 7 plugin** on the production
   WordPress site (Plugins → Add New → search "Contact Form 7" → Install →
   Activate).
2. **Install and activate the WP Mail SMTP plugin** the same way, so mail
   sending is handled reliably rather than left to the server's default,
   often-unreliable `mail()` function.
3. **Configure WP Mail SMTP with a real sending method** — e.g. an SMTP
   provider (such as a transactional email service) or Hostinger's own mail
   service tied to a real mailbox on the domain. This step explicitly
   **needs Marc's real email address and hosting/mail account details** —
   no specific provider, mailbox, or credential is invented or assumed here.
4. **Send a real test submission through the live form and confirm actual
   email delivery** (check the inbox it's supposed to land in, including
   spam/junk) before considering this done. A successful-looking on-screen
   confirmation is not sufficient — delivery must be verified directly.
5. **Build the Contact Form 7 form fields to mirror this prototype's
   existing consultation/contact fields**, so the real site's form matches
   what has already been designed and reviewed here: name, phone, email,
   preferred contact method, and message (see `contact.html` and the
   contact-info step of `consultation.html` in this prototype for the exact
   field set and labels already validated with Marc).

**STATUS: ACCESS REQUIRED.** No WordPress/Hostinger credentials are
available in this session. Nothing on the production site has been
installed, configured, or verified. This plan is ready to execute once
access is granted — do not treat the production contact form as fixed until
a real test submission has been confirmed delivered.
