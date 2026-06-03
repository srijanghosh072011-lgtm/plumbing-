# 24/7 Plumbing &amp; Heating Ltd. — Website

Marketing site for a Calgary plumbing &amp; heating company. Static HTML, CSS, and
a small amount of vanilla JavaScript — no build step, no dependencies, no
framework. It can be opened straight from disk or served by any static host.

## Live site

Currently previewed on GitHub Pages from `main`:
<https://srijanghosh072011-lgtm.github.io/plumbing-/>

**Before launch, move to Cloudflare Pages or Netlify** so the `_headers` file
in the repo (HSTS, CSP, X-Content-Type-Options, etc.) is actually applied —
GitHub Pages ignores it. The full pre-launch checklist lives in `SECURITY.md`.

## Structure

```
.
├── index.html                  # Redirects to the home page
├── 247plumbing-home.html       # Home
├── 247plumbing-services.html   # Services
├── 247plumbing-about.html      # About
├── 247plumbing-contact.html    # Contact (form + map)
├── 247plumbing-privacy.html    # Privacy policy (PIPEDA-aware)
├── css/styles.css              # Single stylesheet; design tokens at the top
├── js/main.js                  # Nav toggle, scroll reveals, stat counter, form
├── images/                     # Photography (WebP) + favicon.svg
├── _headers                    # Security & cache headers (Netlify / CF Pages)
├── sitemap.xml
├── robots.txt
└── SECURITY.md                 # Pre-launch checklist — walk every box
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
- [ ] When the form endpoint is added, append its origin to `_headers`
      `Content-Security-Policy: form-action 'self' https://your-provider`
