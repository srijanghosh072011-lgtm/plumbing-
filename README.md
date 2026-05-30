# 24/7 Plumbing &amp; Heating Ltd. — Website

Marketing site for a Calgary plumbing &amp; heating company. Static HTML, CSS, and
a small amount of vanilla JavaScript — no build step, no dependencies, no
framework. It can be opened straight from disk or served by any static host.

## Live site

Deployed via GitHub Pages from `main`:
<https://srijanghosh072011-lgtm.github.io/plumbing-/>

## Structure

```
.
├── index.html                 # Redirects to the home page
├── 247plumbing-home.html      # Home
├── 247plumbing-services.html  # Services
├── 247plumbing-about.html     # About
├── 247plumbing-contact.html   # Contact (form + map)
├── css/styles.css             # Single stylesheet; design tokens at the top
├── js/main.js                 # Nav toggle, scroll reveals, stat counter, form
├── images/                    # Photography (WebP) + favicon.svg
├── sitemap.xml
└── robots.txt
```

## Design system

The brand is strictly monochrome. Every colour is a neutral grey defined once,
at the top of `css/styles.css`, as a single `--ink-*` ramp on `--paper` white.
There are no hues anywhere by design — reach for an existing token rather than a
raw hex value.

## Local preview

No build required. Either open `247plumbing-home.html` directly, or serve the
folder so that relative links and the map iframe behave exactly as in
production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/247plumbing-home.html
```

## Accessibility &amp; performance

- Skip link to a real `<main>` landmark on every page
- Visible focus rings; 44px minimum touch targets; reduced-motion honoured
- Images ship intrinsic `width`/`height` (no layout shift); the hero is
  prioritised, everything below the fold is lazy-loaded

## Before go-live (needs real business details)

These are intentionally placeholders until the owner provides the real values:

- [ ] Phone number — currently `(403) 555-0199`
- [ ] Email — currently `info@247plumbingcalgary.ca`
- [ ] Mailing address — currently a Google Plus Code
- [ ] Social links (Facebook, Instagram, Google, YouTube) — currently `#`
- [ ] "Read all Google Reviews" link — currently `#`
- [ ] Contact form endpoint — `js/main.js` is a front-end stub; wire it to
      Formspree / Netlify Forms / an API before accepting real submissions
