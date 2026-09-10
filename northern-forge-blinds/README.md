# Northern Forge Windows, Blinds & Doors — Visual Prototype

This is a **static, self-contained visual prototype** of a concept website for
Northern Forge Windows, Blinds & Doors — an idea for Dylan's own independent,
long-term home-openings business, recently **expanded in scope** from a
blinds-only concept to also cover windows and doors (windows, blinds, shades,
shutters, doors, and motorization).

**This is not a live site.** It exists only to gather Dylan's feedback on
direction, tone, structure, and visual identity. Every piece of contact
information, credential, review, price, hours, and years-in-business claim is
a clearly labeled placeholder — nothing here is real business information.

Northern Forge Windows, Blinds & Doors is an independent concept and is not
affiliated with, endorsed by, a successor to, or otherwise connected to any
other windows/blinds/doors company.

**Production deployment of this prototype is not authorized.** See
**Production readiness statement** near the end of this file.

---

## Business name / status

- **Working name:** Northern Forge Windows, Blinds & Doors (previously
  "Northern Forge Blinds," before the scope expanded) — treat this as a
  working name for the prototype, not a confirmed final business name. Dylan
  should confirm the exact legal name and any registration/entity status
  before it appears on anything public.
- **Scope:** originally blinds, shades, shutters, and motorization only; now
  expanded to also include windows and doors as full categories, not just a
  passing mention.
- **Status:** concept only. There is no operating business behind this site
  yet — no confirmed phone number, email, address, hours, service area,
  pricing, licensing, or insurance. Nothing here should be treated as an
  active offer of services.

## Current status

- A fully static, click-through prototype covering Home, Products, Projects,
  About, Consultation, and Contact.
- **Products page** now covers seven anchored categories — Windows, Blinds,
  Shades, Shutters, Doors, Garage Doors, and Motorization — plus an
  **Installation** overview section, a **Technology Showcase** section, and
  an interactive **Product Finder (demo)**.
- The business owner's stated product/service architecture is: Blinds →
  Windows → Doors → Garage Doors → Property Improvements → Construction (a
  growth path). Only the first four are built out concretely in this
  prototype; **Property Improvements and Construction are explicitly future
  scope and do not appear anywhere in this site.**
- **Consultation page** includes the upgraded **Northern Forge Concierge**
  (demo) with a visible step progress bar, contextual follow-up questions,
  and an explained recommendation, plus a substantially expanded intake form.
- **Projects page** now includes category filter tabs (Windows / Blinds /
  Shades / Doors / Full Projects) over an extended placeholder gallery.
- No backend, no database, no real AI integration, no analytics, and no
  deployment — this only exists as local files today.

### What changed in this revision (Garage Doors, Installation, SEO & polish pass)

- **Garage Doors added as a full seventh category** on `products.html`
  (`#garage-doors`), following the exact same pattern already established
  for Windows and Doors: an anchored section with an intro, a sub-nav entry,
  and six conceptual sub-categories (Sectional, Insulated, Modern /
  Carriage-Style, Garage Door Openers & Automation, Replacement, and
  Custom-Size Garage Doors). No manufacturer, brand, technical rating, or
  warranty is named, matching the existing Windows/Doors convention. Garage
  Doors was also added to the homepage's category grid ("Seven categories,
  one straightforward process"), the **Northern Forge Product Finder**
  (`js/finder.js`), the **Northern Forge Concierge** (`js/concierge.js`,
  including a garage-door-specific phrasing of the operation question), and
  the consultation intake form's product-interest checkboxes
  (`consultation.html`).
- **Installation section added** on `products.html` (`#installation`) — a
  four-step conceptual walkthrough (Consultation & Measurement, Planning &
  Scheduling, Installation Day, Final Walkthrough) covering what
  installation involves and what to expect, without claiming certified or
  licensed installers, a specific installation guarantee, or a warranty —
  those are explicitly marked `[Placeholder — confirm installation
  model/credentials with Dylan]`, per the site's existing placeholder
  convention, since none of that is confirmed yet.
- **SEO pass:** every page now has a consistent inline-SVG data-URI favicon
  (dark-slate rounded square with the copper "N" mark, matching the
  existing brand mark), Open Graph tags (`og:title`, `og:description` reused
  from each page's existing meta description, `og:type` set to `website`;
  no `og:image` is included since no real image asset exists). Every page's
  `<title>` and meta description were confirmed unique (they already were),
  and heading hierarchy (exactly one `<h1>` per page, logical `h2`/`h3`
  nesting) was confirmed across all six pages including the new Garage
  Doors and Installation content. `noindex, nofollow` remains on every page
  — intentional for a prototype with no real business info, so sitemap
  strategy stays not applicable.
- **Business name confirmation:** "Northern Forge Windows, Blinds & Doors"
  continues to be used throughout as directed explicitly by the business
  owner in an earlier build order — it is not a guessed or invented name.
- **Business-separation self-check:** the full directory was grepped
  (case-insensitively) for the specific names, numbers, and business terms
  tied to Dylan's other business and to the other windows/blinds company
  named in the build order for this check — zero hits, confirming this site
  contains no reference to, or implied connection with, either one. (Those
  literal terms are deliberately not restated here, so this note itself
  can't produce a false hit on a future re-run of the same check.)

### What changed in the previous revision (scope expansion)

- **Rebrand / scope expansion** from "Northern Forge Blinds" to **"Northern
  Forge Windows, Blinds & Doors."** The wordmark now shows "Northern Forge"
  as the primary mark with a small "Windows, Blinds & Doors" tagline
  underneath (`.brand__sub` in `css/style.css`) on every page header and
  footer. Titles, meta descriptions, and headings were updated site-wide.
- **Windows** and **Doors** added as full, substantial categories on
  `products.html` (`#windows` and `#doors`), each with six conceptual
  sub-categories (e.g. Replacement Windows, Energy-Efficient Windows for
  windows; Entry Doors, Patio Doors for doors) — not just a token mention.
  No manufacturer, brand, technical rating, or warranty claims are made
  anywhere in these sections.
- **Navigation decision:** rather than adding four more top-level nav items
  (Home / Windows / Blinds & Shades / Doors / Products / Projects / About /
  Consultation / Contact, as sketched in the original brief), the six
  product categories were kept as anchored sections on a single, well
  organized `products.html` page — the same pattern the site already used
  for Blinds/Shades/Shutters/Motorization — with a sub-nav of jump links at
  the top of the page. Main navigation stays Home / Products / Projects /
  About / Consultation / Contact, which keeps the header usable at phone
  width. This was a judgment call in line with the brief's own guidance to
  prefer "genuinely useful" over "padding."
- **Northern Forge Product Finder (demo)** — a new interactive tool on
  `products.html` (`#product-finder`, `js/finder.js`), explicitly labeled
  "Northern Forge Product Finder — Demo." Walks: what are you looking for
  (Windows/Blinds/Shades/Doors) → room/property type → privacy requirements
  → light-control requirements → style → colour → manual or motorized →
  approximate budget (placeholder ranges) → installation required → a
  simulated recommendation with a plain-language explanation. Pure
  client-side scripted logic, no network calls, never represented as a live
  AI or inventory system.
- **Northern Forge Concierge upgraded** (`js/concierge.js`, on
  `consultation.html`) — renamed from "AI Blinds Concierge" and
  substantially reworked: a visible step progress bar ("Step X of Y" plus a
  filled progress track), contextual follow-up questions that reference the
  visitor's own prior answers (e.g. referencing the room or light preference
  already given), and a final recommendation that includes a plain-language
  explanation of *why* ("Based on your preference for X and wanting to Y, a
  Z direction may be a good starting point..."). Still 100% scripted, zero
  network calls, explicitly labeled as a simulated/demo tool — never quotes
  real prices, never claims inventory or appointment availability, never
  claims a live AI backend.
- **Technology Showcase** — a new section on `products.html` (`#technology`)
  covering nine smart-home concept capabilities: motorized blinds, automated
  shades, scheduled opening/closing, light-level automation, privacy
  automation, smart-home integration, remote control, voice control, and
  sensor-triggered automation. No compatibility with any named smart-home
  platform or voice assistant is claimed — the section explicitly says any
  such integration "could integrate with popular smart-home platforms, to be
  confirmed."
- **Projects gallery extended** — `projects.html` now has category filter
  tabs (All / Windows / Blinds / Shades / Doors / Full Projects,
  `js/gallery.js`) over 14 placeholder tiles (up from 8), including new
  Windows and Doors placeholder tiles. Every tile keeps the existing
  "Placeholder" tag/caption/`alt`-text convention — none are implied to be
  Dylan's real completed work.
- **Consultation intake expanded** (`consultation.html`,
  `js/consultation.js`) to collect: product interest (now including Windows
  and Doors), property type, project type, room/location, window/door
  requirements, privacy requirements, light requirements, style, budget
  (placeholder ranges), installation preference, timeline, additional notes,
  name, phone, and email. Still demo-only: client-side validation and a
  success state, no network calls, nothing stored anywhere (not even
  `localStorage`).
- **Contact page** — branding updated; phone/email/address/service-area
  placeholders kept, and an **hours** placeholder was added alongside them,
  plus a consultation CTA next to the contact details.

## Technology

- Plain HTML, CSS, and vanilla JavaScript (ES5-style, no build step, no
  frameworks, no npm dependencies).
- No external requests at runtime: no CDNs, no web fonts, no analytics, no
  tracking pixels, no third-party embeds.
- No `fetch`, `XMLHttpRequest`, `WebSocket`, form `action`/`method`
  submission, cookies, or `localStorage` anywhere in the codebase — every
  "submit," every Concierge answer, and every Product Finder answer is
  handled entirely with in-memory JavaScript state and `preventDefault()`.
- **Technology assumptions:** every "smart-home integration" claim on the
  Technology Showcase is **generic and unconfirmed** — no specific ecosystem
  or voice-assistant brand is named or implied as compatible anywhere on the
  site. Any real integration would need to be selected, tested, and
  confirmed before being advertised.

## How to run locally

Either works:

1. **Open directly:** double-click `index.html` (or any page) and it opens in
   your browser via a `file://` URL. No ES modules are used, so this works
   without a server.
2. **Local static server (optional):** from inside `northern-forge-blinds/`,
   run `python3 -m http.server 8000` (or `npx serve .`, or any static file
   server) and open the printed local URL.

There is no backend, no database, and no build process — just plain HTML,
CSS, and JavaScript files referencing each other with relative paths.

## How to "build"

There is no build step. Nothing to compile, bundle, transpile, or minify —
the files in this directory are served as-is. If a future version adopts a
framework or a bundler, this section should be replaced with real build
instructions at that time.

## How to deploy

**Not deployed anywhere, and not authorized for deployment.** This prototype
has no domain and no hosting. Before any real deployment:

- Pick and register a domain name (not yet decided).
- Choose a hosting approach (static host, e.g. Netlify/Vercel/GitHub Pages
  style, vs. something with a real backend once forms, the Concierge, and
  the Product Finder need to actually submit somewhere).
- Decide on the real form-handling and (optionally) real AI backend first —
  see **AI integration requirements** below — since that decision affects
  hosting choice.

Until those decisions are made, this should stay a locally viewed or
privately previewed set of files.

## Prototype limitations

Be explicit with anyone reviewing this that:

- **Neither the Concierge nor the Product Finder is real AI.**
  `js/concierge.js` and `js/finder.js` are fixed, hand-written decision
  trees — a fixed sequence of questions, fixed answer options, and simple
  `if`/`else` logic (including template strings that splice in prior
  answers to sound contextual) to pick a "demo recommendation." Neither
  calls any language model, API, or external service of any kind. Both are
  intentionally labeled as demos — "Northern Forge Concierge — Demo" and
  "Northern Forge Product Finder — Demo" — so this is never ambiguous to a
  visitor.
- **No form submits anywhere.** The Consultation form, the Contact form, and
  the Concierge's and Product Finder's "Book a Consultation" / "Request a
  Quote" actions only update on-page state (or link/scroll to another part
  of the site). No email is sent, no data is stored server-side or in
  `localStorage`, and no lead is actually captured anywhere outside the
  visitor's own browser tab for that visit.
- **All project photography is placeholder art.** Every image on
  `projects.html`, the homepage projects teaser, and the About page headshot
  area is a CSS/inline-SVG placeholder graphic, clearly labeled
  "Placeholder" in the UI and in `alt` text — none are real photos, stock
  photos, or renders of actual work. This includes the new Windows and
  Doors placeholder tiles.
- **No claims of experience, credentials, reviews, or pricing.** These are
  deliberately absent, not just unfinished — see **Required business info**
  below for what would need to be supplied and verified before anything like
  that could be added.
- **No named smart-home platform or manufacturer/brand is claimed anywhere**
  — the Technology Showcase and Windows/Doors category pages are
  deliberately generic.

## Required business info

None of the following exists yet in this prototype — every instance is a
labeled placeholder. Before any version of this concept becomes a real,
public site, Dylan needs to supply and confirm:

- **Business phone number**
- **Business email address**
- **Business/mailing address** (or confirmation that no public address will
  be listed, e.g. mobile/in-home service only)
- **Business hours**
- **Service area** (cities/regions actually served)
- **Real business name/legal status** — confirm "Northern Forge Windows,
  Blinds & Doors" is the final name, and whether it's a registered business
  entity, sole proprietorship, etc.
- **Pricing or pricing approach** (none is shown anywhere in this prototype,
  including in the Concierge and Product Finder demos, which only offer
  vague qualitative budget bands like "cost-conscious" or "mid-range" — even
  a starting-price range or "free consultation" claim needs Dylan's
  sign-off)
- **Any certifications, licenses, or insurance** Dylan actually holds or
  plans to hold (none are claimed anywhere in this prototype — do not add
  any without verifying they're accurate and current)
- **Years of experience / specific work history** — the About page
  deliberately avoids specific numbers or named past employers; Dylan should
  decide what, if anything, he wants to disclose
- **Window, door, and garage door supplier/manufacturer relationships** —
  none are named anywhere in this prototype; the Windows, Doors, and Garage
  Doors sections are deliberately generic/conceptual until real supplier
  relationships exist
- **Installation model and credentials** — this prototype does not claim
  certified or licensed installers, a specific installation guarantee, or a
  warranty of any kind, and does not say whether installation would be done
  in-house or subcontracted. All of this is marked `[Placeholder — confirm
  installation model/credentials with Dylan]` on the Installation section of
  `products.html` and needs Dylan's real answer before anything like it can
  be published.
- **Smart-home platform/ecosystem partnerships**, if any — the Technology
  Showcase makes no compatibility claims about any named voice assistant or
  smart-home ecosystem
- **Legal/compliance review** — privacy policy, terms, accessibility
  statement, and any required business licensing disclosures are not
  included and should be added before public launch
- **Final wording sign-off** — all category descriptions, the About page
  narrative, the Concierge's and Product Finder's scripted questions/copy,
  and CTA copy are drafts written for this prototype and should be reviewed
  by Dylan for accuracy and tone

## Required images/assets

- **Real project photography** to replace every placeholder tile on
  `projects.html` and the homepage projects teaser (with actual customer
  permission to publish, where applicable) — including new Windows and
  Doors project photography once real work exists in those categories.
- **A real headshot or "about" photo** for `about.html` (currently a
  placeholder box).
- **Real logo/brand decision** — this prototype invents a wordmark and mark
  from scratch; Dylan may want a designer-made logo instead of (or in
  addition to) this CSS/SVG treatment.
- **A social-share (Open Graph) image**, once a real domain and brand are
  finalized — `og:image` is deliberately omitted from every page since no
  real image asset exists yet. (A simple inline-SVG data-URI favicon, in
  the site's dark-slate/forged-copper palette, is now in place on every
  page and does not need to wait on a real domain.)

## Future production tasks

- Real form handling — every "submit" on `consultation.html` and
  `contact.html`, and the Concierge's and Product Finder's CTA buttons,
  currently only validate/react in the browser and show a fake success
  message; a live site needs a real backend, email service, or hosted form
  provider before it can actually receive inquiries.
- Domain registration and hosting setup (see **How to deploy**).
- Legal/compliance review (privacy policy, terms, accessibility statement,
  any licensing disclosures).
- Replace all placeholder photography and confirm final logo treatment.
- Decide whether the Concierge/Product Finder should ever become a real AI
  integration (see next section) or should stay scripted demos permanently
  — both are legitimate choices.
- Confirm real window/door supplier relationships (or a fabrication/sourcing
  model) before publishing any specific product, brand, or rating claims.
- Confirm (or drop) any smart-home platform partnership before publishing
  any compatibility claim on the Technology Showcase.

## AI integration requirements

The Concierge and Product Finder in this prototype are 100% scripted (see
**Prototype limitations**). If a future version integrates a **real** AI
backend instead of either scripted demo, that would require at minimum:

- **A real backend endpoint.** The browser must never call an AI provider
  directly — a server-side endpoint should own the request to the AI
  service and return only what the page needs.
- **API key/config kept server-side only.** Any AI provider API key or
  credential must live in server-side environment/config, never in
  client-side JavaScript, a public repo, or anything shipped to the
  browser.
- **Conversation logging considerations.** Decide up front what (if
  anything) gets logged, for how long, and who can access it — visitor
  answers may include personal details about someone's home, so this needs
  a clear retention and privacy stance, not an accidental default.
- **The same guardrails already baked into the demo copy, enforced for
  real.** The scripted versions never quote a real price, promise an
  installation date, or confirm product/inventory availability — a real AI
  backend would need those same constraints enforced server-side (e.g.
  through system-level instructions and/or output filtering), not just
  hoped for in a prompt.
- **Rate limiting**, to prevent abuse or runaway API costs on a
  publicly-reachable endpoint.
- **Fallback UX** for when the AI backend is slow, unavailable, or returns
  something unexpected — e.g. falling back to the standard consultation
  form so a visitor is never stuck with a broken widget.
- A clear internal decision on **who is responsible for the AI provider
  relationship, cost, and monitoring** before this goes live with real
  traffic.

None of this exists in the current prototype — it is scoped here so a real
integration can be planned deliberately, not implied by the current demo.

## Future architecture roadmap

Everything below is **future and unbuilt** — none of it exists in this
prototype today. Listed here only to make the eventual scope visible:

- CMS (content management for pages, product info, project photos)
- Lead dashboard (a place to actually view/manage submitted consultation
  and contact requests)
- AI configuration panel (for tuning a real Concierge/Finder's
  behavior/prompts without a code deploy)
- Analytics
- SEO beyond the current favicon, Open Graph tags, and `noindex, nofollow`
  prototype tags (structured data, sitemaps, a real meta strategy once a
  real domain exists — sitemap strategy stays not applicable while the site
  is intentionally `noindex, nofollow`)
- Customer management (CRM-style tracking of leads/customers over time)
- **Property Improvements and Construction** — the two remaining stages of
  the business owner's stated growth path (Blinds → Windows → Doors →
  Garage Doors → Property Improvements → Construction). Deliberately out of
  scope for this prototype; nothing about either exists here yet.
- Appointment/consultation scheduling (real calendar booking, not just a
  demo form)
- Email notifications (e.g. confirming a submission to the visitor, alerting
  Dylan of a new lead)
- SMS notifications
- Production database
- Authentication (for any admin/dashboard area)
- Real smart-home platform integration(s), if and when confirmed
- Real domain deployment

Any future integration with a broader business infrastructure Dylan may
already run would be a separate, deliberate decision made later — nothing
in this prototype assumes or depends on that.

## Branding assumptions made for this prototype

Since no brand assets existed yet, the following design decisions were made
and should be treated as a starting point for Dylan's feedback, not a final
brand:

- **Name treatment / wordmark:** "Northern Forge" is set as a two-word
  wordmark — a heavier "Northern" and a copper-colored "Forge" — in a bold,
  wide-tracked geometric sans (system font stack, no external font files),
  with a small uppercase "Windows, Blinds & Doors" tagline underneath it
  (`.brand__sub`), reflecting the expanded scope while keeping "Northern
  Forge" as the primary mark. It's paired with a small square mark
  containing a custom-drawn "N" monogram (inline SVG, no logo file).
- **Color palette:** a "northern / architectural" palette — deep slate/ink
  (`#141a22`–`#2a3646`) as the dominant dark tone, a warm off-white paper
  background (`#faf8f4`), and a forged-copper accent (`#c1652f` family) used
  for CTAs, icons, and highlights. Unchanged from the original prototype —
  this scope expansion deliberately kept the existing visual identity
  rather than rebranding from scratch.
- **Typography:** no external fonts are loaded (per the offline
  requirement). Headings use a bold, tightly-tracked system sans (`Avenir
  Next` / `Segoe UI` / `Helvetica Neue` fallback stack); body copy uses the
  standard system UI stack. A distinct type scale (`--step--1` through
  `--step-5`) is defined in `css/style.css`.
- **Iconography:** a single consistent inline-SVG icon style (2px stroke,
  rounded joins, no fill) is used across all six product categories —
  windowpane cross-lines for windows, slats for blinds, a fabric wave for
  shades, a divided panel grid for shutters, a door-with-handle glyph for
  doors, and a remote/bolt for motorization — each inside a dark rounded
  "badge." The Technology Showcase reuses the same icon language for its
  nine concept cards.
- **Section transitions:** alternating light/dark/paper/band section
  backgrounds with angled CSS `clip-path` dividers between them, instead of
  hard-edged section breaks. The new Windows, Doors, Technology Showcase,
  and Product Finder sections all reuse this same divider system so the
  expanded page still reads as one continuous design.
- **Tone of voice:** conservative and factual throughout. Product category
  copy (including the new Windows and Doors sub-categories) describes
  general, well-known concepts (e.g. "roller shades use continuous fabric,"
  "entry doors factor in security and weatherproofing") rather than making
  specific claims about Dylan's business, named manufacturers, or
  performance ratings. The About page explicitly avoids inventing years of
  experience, certifications, or specific past employers/clients. The
  Concierge and Product Finder demos follow the same rule — neither
  scripted "recommendation" ever invents a price, date, availability claim,
  or platform-compatibility claim.
- **Logo/photography:** there are no real photos or logo files anywhere in
  this prototype. The headshot area on the About page and every project
  tile on the Projects page are placeholder graphics built from CSS and
  inline SVG, each labeled "Placeholder" in the UI and in the image's `alt`
  text.

## Visual / motion design notes

A polish pass was carried forward and extended on top of the existing
dark-slate/forged-copper system, without touching the color palette,
wordmark, or established page structure:

- **Scroll-triggered reveals (`js/reveal.js`)** — a single shared, vanilla
  `IntersectionObserver` script loaded on every page. Section intros, card
  grids (categories, the new Windows/Doors sub-category cards, About's
  "what Dylan brings," the compare grid, the lead-capture flow steps, the
  projects teaser tiles), the Technology Showcase grid, the filter-tab row,
  and both the Concierge and Product Finder panels fade and slide gently
  into place as they scroll into view, with a small `nth-child`-based
  stagger so grids feel choreographed rather than snapping in all at once.
- **Hero upgrade** — the homepage hero has a staggered fade-up entrance
  (eyebrow → headline → lede → CTA → badges → graphic), a recurring subtle
  light-sweep across the decorative slat graphic, a touch more shadow
  weight on the primary CTA, and a contained, `requestAnimationFrame`-
  throttled parallax drift on the hero's background gradient layer as the
  page scrolls (capped to ±24px, confined by the hero's own
  `overflow:hidden`, so it can't affect layout or cause overflow).
- **Angled divider accents** — each divider plays a one-time light sweep,
  fully clipped to its own angled shape, the first time it scrolls into
  view.
- **Micro-interactions** — buttons lift and deepen their shadow on
  hover/press, category icon badges scale slightly on card hover, footer
  links, filter tabs, and both guided tools' option buttons all got small,
  consistent hover transitions.
- **Guided-tool progress bar** — a shared `.concierge__progress-*` component
  (filled track + "Step X of Y" label) used by both the Concierge and the
  Product Finder, so the upgraded conversational flow has a visible sense
  of how far along the visitor is, not just a text counter.
- **`prefers-reduced-motion: reduce` is fully respected.** The stylesheet's
  existing sitewide rule (which forces all animation/transition durations
  to near-zero for that preference) already covers every animation and
  transition on the site, old and new. `js/reveal.js` goes further for the
  scroll-reveal system specifically: when reduced motion is requested (or
  `IntersectionObserver` isn't available), it does nothing at all — content
  is simply shown at full opacity immediately, with no hidden state to wait
  on and no scroll listener attached. The hero parallax listener is also
  skipped entirely under reduced motion. This was re-verified for every new
  section added in this revision (see **Tested** notes below).
- **No new dependencies, no network calls.** `js/finder.js` and
  `js/gallery.js` are plain, dependency-free JavaScript (same ES5-safe
  style as the rest of the site, safe for `file://`); everything else is
  plain CSS. No CDNs, fonts, or libraries were added.

## Testing performed for this revision

Verified with a real Chromium browser (via Playwright, headless) against a
local static server (`python3 -m http.server`), covering:

- All six pages (`index.html`, `products.html`, `projects.html`,
  `about.html`, `consultation.html`, `contact.html`) load with an HTTP 200
  status and produce no console errors other than the expected favicon
  404 (no favicon file exists yet — see **Required images/assets**), at
  both 390px and 1440px viewport widths.
- No horizontal overflow at either 390px or 1440px on any page
  (`document.documentElement.scrollWidth` matches the viewport width).
- The mobile nav toggle was clicked twice in sequence (open, then close) and
  confirmed to: set `aria-expanded` correctly both times, show/hide the nav
  panel correctly both times, and — specifically checked, since a bug of
  this exact shape (an open nav panel painting over its own toggle button)
  was found and fixed on a sibling prototype this session — that the toggle
  button remains the topmost, clickable element at its own screen position
  while the panel is open, confirmed via `document.elementFromPoint`.
- The Northern Forge Concierge was clicked through end-to-end (all 9
  questions), confirmed to reach the summary panel with a non-empty "why
  this direction" explanation and a "Complete" progress state, with zero
  JavaScript errors.
- The Northern Forge Product Finder was clicked through end-to-end (all 9
  questions) on `products.html`, confirmed to reach its summary panel with
  a non-empty explanation, zero JavaScript errors.
- The consultation form was submitted empty and confirmed to show the
  error status message with multiple fields flagged `has-error`; then
  filled with valid data (product interest, room, name, email) and
  confirmed to show the success panel.
- The contact form was submitted empty (error state shown) and then with
  valid data (success state shown).
- The projects gallery's category filter tabs were exercised (filtering to
  "Doors") and confirmed to show only matching tiles.
- `prefers-reduced-motion: reduce` was emulated and confirmed that no
  `.reveal` element is left stuck at low opacity — `reveal.js` correctly
  skips adding the class entirely under that preference, per its existing
  design.

This was a functional/regression pass, not a full manual design review —
Dylan should still click through the live prototype himself before treating
any of the above as a substitute for his own review.

### Testing performed for the Garage Doors / Installation / SEO revision

Also verified with a real Chromium browser (via Playwright) against a local
static server:

- The specific customer journey requested for tonight's demo — **Home →
  Products (Doors → Garage Doors) → Product Finder (selecting Garage Doors)
  → Book a Consultation → Northern Forge Concierge (selecting Garage Doors)
  → full consultation form submission** — was clicked through end to end for
  real (not just page loads), confirming zero console errors at every step,
  the Product Finder's summary correctly recommending "Garage Doors" when
  selected, the Concierge showing its garage-door-specific operation
  question and recommending "Garage Doors," the matching checkbox on the
  standard consultation form being pre-checked from the Concierge result,
  and the demo success panel appearing after submission.
- All six pages (including the new Garage Doors and Installation content on
  `products.html`) were loaded at 390px, 430px, and 1440px widths and
  confirmed to return HTTP 200, produce zero console errors, and have no
  horizontal overflow (`scrollWidth` matches viewport width) at any tested
  width.
- All 30 unique internal link targets collected across all six pages
  (relative page links and same-page anchors, including the new
  `#garage-doors` and `#installation` anchors) were checked and confirmed to
  resolve, with zero broken links.
- Keyboard navigation was spot-checked (first `Tab` stop is the skip link,
  focus-visible outlines render on interactive elements) and the mobile nav
  toggle was re-confirmed to stay the topmost, clickable element at its own
  screen position while its panel is open.
- `prefers-reduced-motion: reduce` was re-emulated on `index.html` and the
  expanded `products.html` (including the new Garage Doors and Installation
  sections) and confirmed that `reveal.js` still adds no `.reveal` class at
  all under that preference, so nothing is left stuck at a hidden opacity.
- The favicon was confirmed to load with no separate `favicon.ico` network
  request or 404 on any page (previously the browser tab fell back to a
  missing favicon, which is now fixed).
- **A real bug was found and fixed by this testing pass:** adding two more
  links to the Products page sub-nav (Garage Doors, Installation) caused it
  to wrap onto a second line at common widths, and that second line was
  being covered by the angled section divider immediately below it (which
  is deliberately pulled upward to overlap the end of its section) — this
  made "Product Finder (Demo)" and other sub-nav links unclickable at that
  position. Fixed by removing a one-off `padding-bottom` override on that
  intro section so it uses the site's normal section padding, which gives
  the now-taller sub-nav its full intended clearance from the divider.
- **A second, pre-existing bug (not introduced by this revision) was found
  and fixed:** both the Northern Forge Concierge (`js/concierge.js`) and the
  Product Finder (`js/finder.js`) called `.focus()` on their first answer
  button as part of their normal step-rendering logic, including during
  their automatic initial render on page load. Since both widgets sit well
  down the page, calling `.focus()` on an off-screen button made the browser
  auto-scroll the *entire page* down to the widget immediately on load —
  confirmed via a real scroll-position check, `products.html` loaded
  scrolled roughly 10,000px down to the Product Finder, and
  `consultation.html` loaded scrolled to the Concierge, skipping the hero
  and intro content entirely on every visit. Fixed in both files with an
  `autoFocus` flag that only allows the focus-management behavior once the
  visitor has actually interacted with the widget (clicking an answer,
  Back, or Start Over) — never on the automatic first render — confirmed
  both widgets now load at the top of the page while still moving focus
  correctly during real keyboard-driven interaction.
- Re-ran the full regression pass listed in the section above (mobile nav
  toggle, Concierge and Product Finder end-to-end, consultation and contact
  form validation/success states, projects gallery filters) after these
  fixes and confirmed everything still passes.

As with the previous pass, this was a functional/regression pass, not a
full manual design review — Dylan should still click through the live
prototype himself.

## Production readiness statement

**This prototype is not authorized for production deployment.** It has no
real business information, no backend, no legal/compliance review, and no
confirmed brand, pricing, or supplier relationships. Treat everything in
this repository as a design/direction concept for internal review only,
until Dylan explicitly signs off on a real launch plan covering the items in
**Required business info**, **Required images/assets**, **Future production
tasks**, and (if applicable) **AI integration requirements** above.

## Accessibility & technical notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `<h1>` per
  page, and a logical heading hierarchy throughout.
- Skip-to-content link on every page.
- Visible focus states on all interactive elements (links, buttons, form
  fields, the mobile nav toggle, and both guided tools' option buttons).
- Mobile nav is a keyboard-operable hamburger menu (`Tab`/`Enter`/`Space` to
  open, `Escape` to close, focus returns to the toggle button); confirmed
  the toggle stays clickable while the panel is open (see **Testing
  performed for this revision**).
- The Concierge and Product Finder are keyboard-operable end to end: each
  question's options are plain `<button>` elements (not free-text input, by
  design — this keeps the demos fully deterministic and avoids implying
  either widget understands open-ended input), focus moves to the first
  option after each question renders, the conversation log is an
  `aria-live="polite"` region, and the final recommendation panel receives
  focus when it appears.
- All decorative SVGs are `aria-hidden`; meaningful/placeholder images use
  descriptive `alt` text or `aria-label`, including the standardized
  "Placeholder project photo — replace with real installation photography"
  pattern used across every project tile (Windows and Doors tiles included).
- No `fetch`, `XMLHttpRequest`, `WebSocket`, `<form action>` submission,
  cookies, or `localStorage` usage anywhere — the consultation form, contact
  form, Concierge, and Product Finder are all intercepted with
  `preventDefault()` (or simply never wired to submit anywhere) and only
  change on-page state.
- No external network requests at runtime: no CDNs, no analytics, no web
  fonts — only the system font stack and inline SVG.

## File list

```
northern-forge-blinds/
├── index.html            Home — hero, six-category overview, traditional-vs-AI
│                          compare section, projects teaser, about teaser,
│                          consultation CTA, contact teaser
├── products.html          Windows / Blinds / Shades / Shutters / Doors /
│                          Garage Doors / Motorization, as seven anchored
│                          sections with a sub-nav, plus an Installation
│                          overview, a Technology Showcase section, and the
│                          Northern Forge Product Finder (demo)
├── projects.html          Placeholder project gallery with category filter
│                          tabs (Windows / Blinds / Shades / Doors / Full
│                          Projects) — CSS/SVG placeholders only. Garage
│                          Doors was intentionally left out of this filter
│                          set in this revision (no placeholder gallery
│                          content exists for it yet); add a Garage Doors
│                          filter tab and tiles here once real or
│                          placeholder garage-door project photography
│                          exists.
├── about.html              About Dylan (conservative, no invented credentials)
├── consultation.html      Northern Forge Concierge (demo, with progress bar
│                          and explained recommendations), lead-capture
│                          architecture diagram, and the expanded demo-only
│                          consultation intake form
├── contact.html            Placeholder contact details (incl. hours) + demo
│                          contact form
├── css/
│   └── style.css           Full design system: tokens, layout, components,
│                            including the Concierge/Finder widget, compare
│                            grid, Technology Showcase grid, filter tabs, and
│                            the brand tagline treatment
├── js/
│   ├── main.js              Mobile nav toggle + current-page nav highlighting
│   ├── reveal.js             Scroll-triggered reveal animations + hero
│   │                        parallax accent (shared across every page; see
│   │                        Visual/motion design notes above)
│   ├── concierge.js         Northern Forge Concierge — upgraded scripted demo
│   │                        logic (progress bar, contextual follow-ups,
│   │                        explained recommendation), no network calls
│   ├── finder.js             Northern Forge Product Finder — scripted demo
│   │                        logic, no network calls
│   ├── gallery.js            Projects page category filter tabs, no network
│   │                        calls
│   ├── consultation.js      Demo-only, expanded consultation form logic (no
│   │                        network calls)
│   └── contact.js           Demo-only contact form logic (no network calls)
└── README.md                This file
```

No other files are required. There is no build step, no package.json, and no
external dependencies.
