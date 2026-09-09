# Northforge Blinds — Visual Prototype

This is a **static, self-contained visual prototype** of a concept website for
Northforge Blinds — an idea for Dylan's own independent, long-term
window-coverings business (blinds, shades, shutters, motorization).

**This is not a live site.** It exists only to gather Dylan's feedback on
direction, tone, structure, and visual identity. Every piece of contact
information, credential, review, price, and years-in-business claim is a
clearly labeled placeholder — nothing here is real business information.

Northforge Blinds is an independent concept and is not affiliated with,
endorsed by, a successor to, or otherwise connected to any other
window-coverings company.

---

## File list

```
northforge-blinds/
├── index.html          Home — hero, category overview, projects teaser,
│                        about teaser, consultation CTA, contact teaser
├── products.html        Blinds / Shades / Shutters / Motorization, as four
│                        anchored sections with their own sub-nav
├── projects.html        Grid of placeholder project tiles (CSS/SVG only)
├── about.html            About Dylan (conservative, no invented credentials)
├── consultation.html    Demo-only guided consultation form
├── contact.html          Placeholder contact details + demo contact form
├── css/
│   └── style.css         Full design system: tokens, layout, components
├── js/
│   ├── main.js            Mobile nav toggle + current-page nav highlighting
│   ├── consultation.js    Demo-only consultation form logic (no network calls)
│   └── contact.js         Demo-only contact form logic (no network calls)
└── README.md              This file
```

No other files are required. There is no build step, no package.json, and no
external dependencies.

## How to run locally

Either works:

1. **Open directly:** double-click `index.html` (or any page) and it opens in
   your browser via a `file://` URL. No ES modules are used, so this works
   without a server.
2. **Local static server (optional):** from inside `northforge-blinds/`, run
   `npx serve .` (or any static file server) and open the printed local URL.

There is no backend, no database, and no build process — just plain HTML,
CSS, and JavaScript files referencing each other with relative paths.

## Branding assumptions made for this prototype

Since no brand assets existed yet, the following design decisions were made
and should be treated as a starting point for Dylan's feedback, not a final
brand:

- **Name treatment / wordmark:** "Northforge" is set as a single wordmark
  split into a heavier "North" and a copper-colored "forge," in a bold,
  wide-tracked geometric sans (system font stack, no external font files).
  It's paired with a small square mark containing a custom-drawn "N"
  monogram (inline SVG, no logo file).
- **Color palette:** a "northern / architectural" palette — deep slate/ink
  (`#141a22`–`#2a3646`) as the dominant dark tone, a warm off-white paper
  background (`#faf8f4`), and a forged-copper accent (`#c1652f` family) used
  for CTAs, icons, and highlights. This is meant to read as durable and
  premium-but-accessible rather than a typical bright, generic "blinds
  store" look.
- **Typography:** no external fonts are loaded (per the offline requirement).
  Headings use a bold, tightly-tracked system sans (`Avenir Next` / `Segoe
  UI` / `Helvetica Neue` fallback stack); body copy uses the standard system
  UI stack. A distinct type scale (`--step--1` through `--step-5`) is
  defined in `css/style.css`.
- **Iconography:** a single consistent inline-SVG icon style (2px stroke,
  rounded joins, no fill) is used for the four product categories — slats
  for blinds, a fabric wave for shades, a divided panel grid for shutters,
  and a remote/bolt for motorization — each inside a dark rounded "badge."
- **Section transitions:** alternating light/dark/paper section backgrounds
  with angled CSS `clip-path` dividers between them, instead of hard-edged
  section breaks — intended to feel more "architectural" than a stock
  template.
- **Tone of voice:** conservative and factual throughout. Product category
  copy describes general, well-known facts about each category (e.g. "roller
  shades use continuous fabric," "shutters are panel-fit to the frame")
  rather than making specific claims about Dylan's business. The About page
  explicitly avoids inventing years of experience, certifications, or
  specific past employers/clients.
- **Logo/photography:** there are no real photos or logo files anywhere in
  this prototype. The headshot area on the About page and every project tile
  on the Projects page are placeholder graphics built from CSS and inline
  SVG, each labeled "Placeholder" in the UI and in the image's `alt` text.

## Everything Dylan needs to confirm before this could go live

None of the following exists yet in this prototype — every instance is a
labeled placeholder. Before any version of this concept becomes a real,
public site, Dylan needs to supply and confirm:

- **Business phone number**
- **Business email address**
- **Business/mailing address** (or confirmation that no public address will
  be listed, e.g. mobile/in-home service only)
- **Service area** (cities/regions actually served)
- **Real business name/legal status** — confirm "Northforge Blinds" is the
  final name, and whether it's a registered business entity, sole
  proprietorship, etc.
- **Pricing or pricing approach** (none is shown anywhere in this prototype;
  even a starting-price range or "free consultation" claim needs Dylan's
  sign-off)
- **Any certifications, licenses, or insurance** Dylan actually holds or
  plans to hold (none are claimed anywhere in this prototype — do not add
  any without verifying they're accurate and current)
- **Years of experience / specific work history** — the About page
  deliberately avoids specific numbers or named past employers; Dylan should
  decide what, if anything, he wants to disclose
- **Real project photography** to replace every placeholder tile on
  `projects.html` and the homepage projects teaser (with actual customer
  permission to publish, where applicable)
- **A real headshot or "about" photo** for `about.html` (currently a
  placeholder box)
- **Real logo/brand decision** — this prototype invents a wordmark and mark
  from scratch; Dylan may want a designer-made logo instead of (or in
  addition to) this CSS/SVG treatment
- **Domain name and hosting** — this prototype has no domain, no hosting,
  and no deployment; it is meant to be viewed as local files or a private
  preview link only
- **Real form handling** — every "submit" on `consultation.html` and
  `contact.html` currently only validates in the browser and shows a fake
  success message; a live site needs a real backend, email service, or form
  provider (e.g. a hosted form endpoint) before it can actually receive
  inquiries
- **Legal/compliance review** — privacy policy, terms, accessibility
  statement, and any required business licensing disclosures are not
  included and should be added before public launch
- **Final wording sign-off** — all category descriptions, the About page
  narrative, and CTA copy are drafts written for this prototype and should
  be reviewed by Dylan for accuracy and tone

## Accessibility & technical notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `<h1>` per
  page, and a logical heading hierarchy throughout.
- Skip-to-content link on every page.
- Visible focus states on all interactive elements (links, buttons, form
  fields, the mobile nav toggle).
- Mobile nav is a keyboard-operable hamburger menu (`Tab`/`Enter`/`Space` to
  open, `Escape` to close, focus returns to the toggle button).
- All decorative SVGs are `aria-hidden`; meaningful/placeholder images use
  descriptive `alt` text or `aria-label`, including the standardized
  "Placeholder project photo — replace with real installation photography"
  pattern used across every project tile.
- No `fetch`, `XMLHttpRequest`, `<form action>` submission, cookies, or
  `localStorage` usage anywhere — the consultation and contact forms are
  intercepted with `preventDefault()` and only change on-page state.
- No external network requests at runtime: no CDNs, no analytics, no web
  fonts — only the system font stack and inline SVG.
