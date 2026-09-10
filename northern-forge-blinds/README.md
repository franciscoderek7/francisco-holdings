# Northern Forge Blinds — Visual Prototype

This is a **static, self-contained visual prototype** of a concept website for
Northern Forge Blinds — an idea for Dylan's own independent, long-term
window-coverings business (blinds, shades, shutters, motorization).

**This is not a live site.** It exists only to gather Dylan's feedback on
direction, tone, structure, and visual identity. Every piece of contact
information, credential, review, price, and years-in-business claim is a
clearly labeled placeholder — nothing here is real business information.

Northern Forge Blinds is an independent concept and is not affiliated with,
endorsed by, a successor to, or otherwise connected to any other
window-coverings company.

---

## Business name / status

- **Working name:** Northern Forge Blinds — treat this as a working name for
  the prototype, not a confirmed final business name. Dylan should confirm
  the exact legal name and any registration/entity status before it appears
  on anything public.
- **Status:** concept only. There is no operating business behind this site
  yet — no confirmed phone number, email, address, service area, pricing,
  licensing, or insurance. Nothing here should be treated as an active offer
  of services.

## Current status

- A fully static, click-through prototype covering Home, Products, Projects,
  About, Consultation, and Contact.
- Includes a new scripted "AI Blinds Concierge" demo widget, a "traditional
  vs. AI-powered website" explainer section, and a lead-capture architecture
  diagram (see **New in this revision** below).
- No backend, no database, no real AI integration, no analytics, and no
  deployment — this only exists as local files today.

### New in this revision

- **Renamed** from "Northforge Blinds" to **"Northern Forge Blinds"**
  throughout the site (wordmark, titles, meta tags, body copy, footer,
  README). The project directory is now `northern-forge-blinds/`.
- **AI Blinds Concierge (demo)** — a scripted, chat-style guided flow on
  `consultation.html` (`js/concierge.js`), separate from the existing
  multi-field consultation form. See **Prototype limitations** and **AI
  integration requirements** below for exactly what it does and doesn't do.
- **"Traditional website vs. AI-powered website" section** on `index.html`
  contrasting the old browse-and-call pattern with this concept's guided,
  lead-capturing pattern.
- **Lead-capture architecture diagram** on `consultation.html` — a simple
  CSS/SVG-free step-flow (Visitor → Website → AI Concierge → Product
  Interest → Consultation/Quote → Lead Form → Confirmation) built from plain
  HTML and CSS.

## Technology

- Plain HTML, CSS, and vanilla JavaScript (ES5-style, no build step, no
  frameworks, no npm dependencies).
- No external requests at runtime: no CDNs, no web fonts, no analytics, no
  tracking pixels, no third-party embeds.
- No `fetch`, `XMLHttpRequest`, `WebSocket`, form `action`/`method`
  submission, cookies, or `localStorage` anywhere in the codebase — every
  "submit" and every AI Concierge answer is handled entirely with in-memory
  JavaScript state and `preventDefault()`.

## How to run locally

Either works:

1. **Open directly:** double-click `index.html` (or any page) and it opens in
   your browser via a `file://` URL. No ES modules are used, so this works
   without a server.
2. **Local static server (optional):** from inside `northern-forge-blinds/`,
   run `npx serve .` (or any static file server) and open the printed local
   URL.

There is no backend, no database, and no build process — just plain HTML,
CSS, and JavaScript files referencing each other with relative paths.

## How to "build"

There is no build step. Nothing to compile, bundle, transpile, or minify —
the files in this directory are served as-is. If a future version adopts a
framework or a bundler, this section should be replaced with real build
instructions at that time.

## How to deploy

**Not deployed anywhere.** This prototype has no domain and no hosting.
Before any real deployment:

- Pick and register a domain name (not yet decided).
- Choose a hosting approach (static host, e.g. Netlify/Vercel/GitHub Pages
  style, vs. something with a real backend once forms and the AI Concierge
  need to actually submit somewhere).
- Decide on the real form-handling and (optionally) real AI backend first —
  see **AI integration requirements** below — since that decision affects
  hosting choice.

Until those decisions are made, this should stay a locally viewed or
privately previewed set of files.

## Prototype limitations

Be explicit with anyone reviewing this that:

- **The AI Concierge is not real AI.** `js/concierge.js` is a fixed,
  hand-written decision tree — a fixed sequence of questions, fixed answer
  options, and simple `if`/`else` logic to pick a "demo recommendation." It
  does not call any language model, API, or external service of any kind.
  The UI is intentionally labeled "Demo AI Concierge — simulated for this
  prototype, not connected to a live AI service" so this is never ambiguous
  to a visitor.
- **No form submits anywhere.** The Consultation form, the Contact form, and
  the AI Concierge's "Book a Consultation" / "Request a Quote" actions only
  update on-page state (or link/scroll to another part of the site). No
  email is sent, no data is stored server-side, and no lead is actually
  captured anywhere outside the visitor's own browser tab.
- **All project photography is placeholder art.** Every image on
  `projects.html`, the homepage projects teaser, and the About page headshot
  area is a CSS/inline-SVG placeholder graphic, clearly labeled
  "Placeholder" in the UI and in `alt` text — none are real photos, stock
  photos, or renders of actual work.
- **No claims of experience, credentials, reviews, or pricing.** These are
  deliberately absent, not just unfinished — see **Required business info**
  below for what would need to be supplied and verified before anything like
  that could be added.

## Required business info

None of the following exists yet in this prototype — every instance is a
labeled placeholder. Before any version of this concept becomes a real,
public site, Dylan needs to supply and confirm:

- **Business phone number**
- **Business email address**
- **Business/mailing address** (or confirmation that no public address will
  be listed, e.g. mobile/in-home service only)
- **Service area** (cities/regions actually served)
- **Real business name/legal status** — confirm "Northern Forge Blinds" is
  the final name, and whether it's a registered business entity, sole
  proprietorship, etc.
- **Pricing or pricing approach** (none is shown anywhere in this prototype,
  including in the AI Concierge demo, which only offers vague qualitative
  budget bands like "cost-conscious" or "mid-range" — even a starting-price
  range or "free consultation" claim needs Dylan's sign-off)
- **Any certifications, licenses, or insurance** Dylan actually holds or
  plans to hold (none are claimed anywhere in this prototype — do not add
  any without verifying they're accurate and current)
- **Years of experience / specific work history** — the About page
  deliberately avoids specific numbers or named past employers; Dylan should
  decide what, if anything, he wants to disclose
- **Legal/compliance review** — privacy policy, terms, accessibility
  statement, and any required business licensing disclosures are not
  included and should be added before public launch
- **Final wording sign-off** — all category descriptions, the About page
  narrative, the AI Concierge's scripted questions/copy, and CTA copy are
  drafts written for this prototype and should be reviewed by Dylan for
  accuracy and tone

## Required images/assets

- **Real project photography** to replace every placeholder tile on
  `projects.html` and the homepage projects teaser (with actual customer
  permission to publish, where applicable).
- **A real headshot or "about" photo** for `about.html` (currently a
  placeholder box).
- **Real logo/brand decision** — this prototype invents a wordmark and mark
  from scratch; Dylan may want a designer-made logo instead of (or in
  addition to) this CSS/SVG treatment.
- **A favicon and any social-share (Open Graph) image**, once a real domain
  and brand are finalized — neither exists yet.

## Future production tasks

- Real form handling — every "submit" on `consultation.html` and
  `contact.html`, and the AI Concierge's CTA buttons, currently only
  validate/react in the browser and show a fake success message; a live
  site needs a real backend, email service, or hosted form provider before
  it can actually receive inquiries.
- Domain registration and hosting setup (see **How to deploy**).
- Legal/compliance review (privacy policy, terms, accessibility statement,
  any licensing disclosures).
- Replace all placeholder photography and confirm final logo treatment.
- Decide whether the AI Concierge should ever become a real AI integration
  (see next section) or should stay a scripted demo permanently — both are
  legitimate choices.

## AI integration requirements

The AI Concierge in this prototype is 100% scripted (see **Prototype
limitations**). If a future version integrates a **real** AI backend instead
of the scripted demo, that would require at minimum:

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
  real.** The scripted version never quotes a real price, promises an
  installation date, or confirms product availability — a real AI backend
  would need those same constraints enforced server-side (e.g. through
  system-level instructions and/or output filtering), not just hoped for in
  a prompt.
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
- AI configuration panel (for tuning a real AI Concierge's behavior/prompts
  without a code deploy)
- Analytics
- SEO (structured data, sitemaps, meta strategy beyond the current
  `noindex, nofollow` prototype tags)
- Customer management (CRM-style tracking of leads/customers over time)
- Appointment/consultation scheduling (real calendar booking, not just a
  demo form)
- Email notifications (e.g. confirming a submission to the visitor, alerting
  Dylan of a new lead)
- SMS notifications
- Production database
- Authentication (for any admin/dashboard area)
- Real domain deployment

Any future integration with a broader business infrastructure Derek may
already run would be a separate, deliberate decision made later — nothing
in this prototype assumes or depends on that.

## Branding assumptions made for this prototype

Since no brand assets existed yet, the following design decisions were made
and should be treated as a starting point for Dylan's feedback, not a final
brand:

- **Name treatment / wordmark:** "Northern Forge" is set as a two-word
  wordmark — a heavier "Northern" and a copper-colored "Forge" — in a bold,
  wide-tracked geometric sans (system font stack, no external font files).
  It's paired with a small square mark containing a custom-drawn "N"
  monogram (inline SVG, no logo file).
- **Color palette:** a "northern / architectural" palette — deep slate/ink
  (`#141a22`–`#2a3646`) as the dominant dark tone, a warm off-white paper
  background (`#faf8f4`), and a forged-copper accent (`#c1652f` family) used
  for CTAs, icons, and highlights. This is meant to read as durable and
  premium-but-accessible rather than a typical bright, generic "blinds
  store" look.
- **Typography:** no external fonts are loaded (per the offline
  requirement). Headings use a bold, tightly-tracked system sans (`Avenir
  Next` / `Segoe UI` / `Helvetica Neue` fallback stack); body copy uses the
  standard system UI stack. A distinct type scale (`--step--1` through
  `--step-5`) is defined in `css/style.css`.
- **Iconography:** a single consistent inline-SVG icon style (2px stroke,
  rounded joins, no fill) is used for the four product categories — slats
  for blinds, a fabric wave for shades, a divided panel grid for shutters,
  and a remote/bolt for motorization — each inside a dark rounded "badge."
- **Section transitions:** alternating light/dark/paper/band section
  backgrounds with angled CSS `clip-path` dividers between them, instead of
  hard-edged section breaks — intended to feel more "architectural" than a
  stock template. The new AI Concierge, compare, and architecture-diagram
  sections reuse this same divider system.
- **Tone of voice:** conservative and factual throughout. Product category
  copy describes general, well-known facts about each category (e.g.
  "roller shades use continuous fabric," "shutters are panel-fit to the
  frame") rather than making specific claims about Dylan's business. The
  About page explicitly avoids inventing years of experience,
  certifications, or specific past employers/clients. The AI Concierge demo
  follows the same rule — its scripted "recommendation" never invents a
  price, date, or availability claim.
- **Logo/photography:** there are no real photos or logo files anywhere in
  this prototype. The headshot area on the About page and every project
  tile on the Projects page are placeholder graphics built from CSS and
  inline SVG, each labeled "Placeholder" in the UI and in the image's `alt`
  text.

## Visual / motion design notes

A polish pass was added on top of the existing dark-slate/forged-copper
system to give the prototype a stronger "wow factor" on both mobile and
desktop, without touching the color palette, wordmark, or page structure:

- **Scroll-triggered reveals (`js/reveal.js`)** — a single shared, vanilla
  `IntersectionObserver` script loaded on every page. Section intros, card
  grids (categories, About's "what Dylan brings," the compare grid, the
  lead-capture flow steps, the projects teaser tiles) and the AI Concierge
  panel fade and slide gently into place as they scroll into view, with a
  small `nth-child`-based stagger so grids feel choreographed rather than
  snapping in all at once.
- **Hero upgrade (`index.html` / `css/style.css`)** — the homepage hero now
  has a staggered fade-up entrance (eyebrow → headline → lede → CTA →
  badges → graphic), a recurring subtle light-sweep across the decorative
  slat graphic, a touch more shadow weight on the primary CTA, and a
  contained, `requestAnimationFrame`-throttled parallax drift on the hero's
  background gradient layer as the page scrolls (capped to ±24px, confined
  by the hero's own `overflow:hidden`, so it can't affect layout or cause
  overflow).
- **Angled divider accents** — rather than moving the existing clip-path
  dividers on scroll (which would risk opening a visible seam against the
  sections they overlap), each divider now plays a one-time light sweep,
  fully clipped to its own angled shape, the first time it scrolls into
  view. True scroll-linked parallax on the dividers themselves was
  deliberately skipped as an unnecessary jank/seam risk for a purely
  decorative effect.
- **Micro-interactions** — buttons now lift and deepen their shadow on
  hover/press, category icon badges scale slightly on card hover, footer
  links and the AI Concierge's option buttons and the guided-form choice
  cards all got small, consistent hover transitions. All existing
  `:focus-visible` outlines were kept exactly as-is and were not touched or
  weakened by any of this work.
- **`prefers-reduced-motion: reduce` is fully respected.** The stylesheet's
  existing sitewide rule (which forces all animation/transition durations
  to near-zero for that preference) already covers every new animation and
  transition added here. `js/reveal.js` goes further for the
  scroll-reveal system specifically: when reduced motion is requested (or
  `IntersectionObserver` isn't available), it does nothing at all — content
  is simply shown at full opacity immediately, with no hidden state to wait
  on and no scroll listener attached. The hero parallax listener is also
  skipped entirely under reduced motion.
- **No new dependencies, no network calls.** `js/reveal.js` is plain,
  dependency-free JavaScript (same ES5-safe style as the rest of the site,
  safe for `file://`); everything else is plain CSS. No CDNs, fonts, or
  libraries were added.
- **Verified:** all six pages were checked in a real Chromium browser at
  both 390px and 1280px widths with realistic (mouse-wheel) scrolling —
  zero console errors, zero elements left stuck invisible, and
  `document.documentElement.scrollWidth` stays equal to the viewport width
  (no horizontal overflow introduced). Buttons remain clickable immediately
  during their entrance animation, and keyboard tab order plus
  `:focus-visible` outlines were confirmed unaffected.

A future pass would benefit most from real project photography and a real
headshot — the placeholder SVG art is the main thing now holding back the
site from feeling fully "finished" next to the new motion polish.

## Accessibility & technical notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `<h1>` per
  page, and a logical heading hierarchy throughout.
- Skip-to-content link on every page.
- Visible focus states on all interactive elements (links, buttons, form
  fields, the mobile nav toggle, and the AI Concierge's option buttons).
- Mobile nav is a keyboard-operable hamburger menu (`Tab`/`Enter`/`Space` to
  open, `Escape` to close, focus returns to the toggle button).
- The AI Concierge is keyboard-operable end to end: each question's options
  are plain `<button>` elements (not free-text input, by design — this
  keeps the demo fully deterministic and avoids implying the widget
  understands open-ended input), focus moves to the first option after each
  question renders, the conversation log is an `aria-live="polite"` region,
  and the final recommendation panel receives focus when it appears.
- All decorative SVGs are `aria-hidden`; meaningful/placeholder images use
  descriptive `alt` text or `aria-label`, including the standardized
  "Placeholder project photo — replace with real installation photography"
  pattern used across every project tile.
- No `fetch`, `XMLHttpRequest`, `WebSocket`, `<form action>` submission,
  cookies, or `localStorage` usage anywhere — the consultation form,
  contact form, and AI Concierge are all intercepted with
  `preventDefault()` (or simply never wired to submit anywhere) and only
  change on-page state.
- No external network requests at runtime: no CDNs, no analytics, no web
  fonts — only the system font stack and inline SVG.

## File list

```
northern-forge-blinds/
├── index.html            Home — hero, category overview, traditional-vs-AI
│                          compare section, projects teaser, about teaser,
│                          consultation CTA, contact teaser
├── products.html          Blinds / Shades / Shutters / Motorization, as four
│                          anchored sections with their own sub-nav
├── projects.html          Grid of placeholder project tiles (CSS/SVG only)
├── about.html              About Dylan (conservative, no invented credentials)
├── consultation.html      AI Blinds Concierge (demo), lead-capture
│                          architecture diagram, and the standard demo-only
│                          guided consultation form
├── contact.html            Placeholder contact details + demo contact form
├── css/
│   └── style.css           Full design system: tokens, layout, components,
│                            including the Concierge widget and compare grid
├── js/
│   ├── main.js              Mobile nav toggle + current-page nav highlighting
│   ├── reveal.js             Scroll-triggered reveal animations + hero
│   │                        parallax accent (shared across every page; see
│   │                        Visual/motion design notes above)
│   ├── concierge.js         AI Blinds Concierge — scripted demo logic only,
│   │                        no network calls (see AI integration section)
│   ├── consultation.js      Demo-only consultation form logic (no network calls)
│   └── contact.js           Demo-only contact form logic (no network calls)
└── README.md                This file
```

No other files are required. There is no build step, no package.json, and no
external dependencies.
