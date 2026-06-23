#!/usr/bin/env node
/*
 * City landing-page generator (local SEO).
 *
 * This is a DEV-TIME tool, not a deploy build step — it writes plain static
 * HTML files into the repo root, and the site still deploys with no build.
 *
 * To add or edit a service-area page:
 *   1. Add/adjust an entry in the CITIES array below (give it genuinely
 *      unique local copy — thin, near-duplicate pages get treated as
 *      "doorway pages" and can hurt SEO).
 *   2. Run:  node tools/build-city-pages.js
 *   3. Commit the generated *-plumber.html files and service-areas.html.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://srijanghosh072011-lgtm.github.io/plumbing-/';
const PHONE = '(403) 555-0199';
const TEL = '+14035550199';
const EMAIL = 'info@247plumbingcalgary.ca';
const CALGARY_GEO = { lat: 51.0447, lng: -114.0719 };

/* ----- Owner-editable data ------------------------------------------- */
const CITIES = [
  {
    slug: 'airdrie', name: 'Airdrie',
    blurb: "Just north of Calgary on the QEII, Airdrie is one of Alberta's fastest-growing cities — and its mix of brand-new builds and established homes keeps our trucks busy from Bayside to Luxstone.",
    localNote: "Airdrie's hard water is tough on equipment, so we replace a lot of scaled-up water heaters and clogged fixtures here.",
    neighbourhoods: ["Bayside", "Cooper's Crossing", "Williamstown", "Ravenswood", "Sagewood", "Luxstone"]
  },
  {
    slug: 'cochrane', name: 'Cochrane',
    blurb: "Tucked into the foothills where the Bow River meets the mountains, Cochrane blends acreages with fast-growing communities like Sunset Ridge and Fireside.",
    localNote: "Plenty of Cochrane-area properties run on well water, so we do a lot of pressure-tank, pump and softener work alongside regular town service.",
    neighbourhoods: ["Sunset Ridge", "Heartland", "Riversong", "Fireside", "The Willows", "Gleneagles"]
  },
  {
    slug: 'okotoks', name: 'Okotoks',
    blurb: "South of Calgary along the Sheep River, Okotoks pairs character homes in the older core with new development in Drake Landing and Cimarron.",
    localNote: "Older Okotoks neighbourhoods mean we still service plenty of aging galvanized and Poly-B plumbing that's reaching the end of its life.",
    neighbourhoods: ["Drake Landing", "Cimarron", "Sheep River", "Air Ranch", "Crystal Shores", "Wedderburn"]
  },
  {
    slug: 'chestermere', name: 'Chestermere',
    blurb: "Built around its namesake lake just east of Calgary, Chestermere's lakeside communities — Westmere, Rainbow Falls, Kinniburgh — are mostly newer homes with modern systems.",
    localNote: "Lake-area homes here often add irrigation and outdoor water lines that we winterize every fall to prevent burst pipes.",
    neighbourhoods: ["Westmere", "Rainbow Falls", "Kinniburgh", "Lakepointe", "The Cove"]
  },
  {
    slug: 'strathmore', name: 'Strathmore',
    blurb: "An easy drive east on the Trans-Canada, Strathmore is a growing town surrounded by farmland, with newer neighbourhoods like Lakewood and Wildflower.",
    localNote: "The big prairie temperature swings out here make frozen and burst-pipe calls common through the winter months.",
    neighbourhoods: ["Lakewood", "Hillview", "Wildflower", "Brentwood", "Edgefield"]
  },
  {
    slug: 'bragg-creek', name: 'Bragg Creek',
    blurb: "A foothills hamlet west of Calgary on the edge of Kananaskis country, Bragg Creek is acreage territory where nearly every home runs on a private well and septic system.",
    localNote: "Out here it's well pumps, pressure tanks and septic-friendly fixtures — rural systems we work on every week.",
    neighbourhoods: ["Wintergreen", "West Bragg Creek", "Riverside", "Hamlet core"]
  }
];

/* ----- Shared SVG icons ---------------------------------------------- */
const ic = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  drain: '<path d="M4 6h16M7 6v10a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V6"/><path d="M11 19v2M13 19v2"/>',
  thermo: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  drop: '<path d="M12 2.7s6 6.3 6 10.3a6 6 0 1 1-12 0c0-4 6-10.3 6-10.3z"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'
};
const svg = (paths, sw = 2, fill = 'none') =>
  `<svg viewBox="0 0 24 24" fill="${fill}" stroke="${fill === 'none' ? 'currentColor' : 'none'}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const SERVICES = [
  { icon: ic.clock, t: '24/7 Emergency Plumbing', d: 'Burst pipes, sewage backups, no heat — a real person answers any hour and we aim to arrive within 60 minutes.' },
  { icon: ic.drain, t: 'Drain Cleaning', d: 'Slow or blocked drains cleared with augers and hydro-jetting, plus camera inspection to find the real cause.' },
  { icon: ic.thermo, t: 'Hot Water Tanks', d: 'Repairs and same-day replacement of tank and tankless water heaters from the brands we trust.' },
  { icon: ic.flame, t: 'Furnace & Heating', d: 'Furnace and boiler repair, maintenance and high-efficiency replacement to keep you warm through the winter.' },
  { icon: ic.bolt, t: 'Gas Fitting', d: 'Licensed gas fitters for lines, BBQs, ranges, fireplaces and leak detection — done safely and to code.' },
  { icon: ic.drop, t: 'Leaks & Repairs', d: 'Faucets, toilets, fixtures and hidden leaks found and fixed fast, before they turn into water damage.' }
];

/* ----- Shared chrome -------------------------------------------------- */
function topAndNav() {
  return `  <a class="skip-nav" href="#main-content">Skip to main content</a>

  <div class="top-bar">
    <div class="top-bar-inner">
      <div class="top-bar-left">
        <span class="top-bar-item">${svg(ic.pin)} Serving Calgary &amp; Surrounding Areas</span>
        <span class="top-bar-item">${svg(ic.clock)} Open 24 Hours · 365 Days a Year</span>
      </div>
      <div class="top-bar-socials">
        <span>Follow us</span>
        <a href="#" aria-label="Facebook">${svg('<path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>', 2, 'currentColor')}</a>
        <a href="#" aria-label="Instagram">${svg('<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>')}</a>
      </div>
    </div>
  </div>

  <header class="nav">
    <div class="nav-inner">
      <a href="247plumbing-home.html" class="brand">
        <div class="brand-mark" aria-hidden="true">${svg('<path d="M14 6l-4 4-3-3-5 5 5 5 4-4M8 14l-3 3M16 4l4 4M14 2v4h4M6 22l3-3"/>')}</div>
        <div class="brand-name">
          <span class="row1">24/7 Plumbing &amp; Heating</span>
          <span class="row2">Calgary · Licensed &amp; Insured</span>
        </div>
      </a>
      <nav aria-label="Primary">
        <ul class="nav-menu" id="primary-menu">
          <li class="nav-item"><a class="nav-link" href="247plumbing-home.html">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="247plumbing-services.html">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="service-areas.html">Service Areas</a></li>
          <li class="nav-item"><a class="nav-link" href="247plumbing-about.html">About</a></li>
          <li class="nav-item"><a class="nav-link" href="247plumbing-home.html#faq">FAQ</a></li>
          <li class="nav-item"><a class="nav-link" href="247plumbing-contact.html">Contact</a></li>
        </ul>
      </nav>
      <div class="nav-cta">
        <a class="nav-phone" href="tel:${TEL}">${svg(ic.phone)} ${PHONE}</a>
        <a class="btn btn-primary" href="247plumbing-contact.html">Book Online</a>
        <button class="nav-toggle" aria-label="Open menu" aria-controls="primary-menu" aria-expanded="false">${svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>', 2.5)}</button>
      </div>
    </div>
  </header>
`;
}

function footer() {
  return `  <footer class="footer">
    <div class="container-x">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="247plumbing-home.html" class="brand">
            <div class="brand-mark" aria-hidden="true">${svg('<path d="M14 6l-4 4-3-3-5 5 5 5 4-4M8 14l-3 3M16 4l4 4M14 2v4h4M6 22l3-3"/>')}</div>
            <div class="brand-name">
              <span class="row1">24/7 Plumbing &amp; Heating</span>
              <span class="row2">Calgary · Licensed &amp; Insured</span>
            </div>
          </a>
          <p>Calgary's trusted 24-hour plumbing and heating company. Family-owned, locally operated, fully licensed and insured.</p>
        </div>
        <div>
          <h4>Services</h4>
          <div class="footer-links">
            <a href="247plumbing-services.html#emergency">Emergency Plumbing</a>
            <a href="247plumbing-services.html#drains">Drain Cleaning</a>
            <a href="247plumbing-services.html#water-heaters">Hot Water Tanks</a>
            <a href="247plumbing-services.html#furnace">Furnace Repair</a>
            <a href="247plumbing-services.html#gas-fitting">Gas Fitting</a>
          </div>
        </div>
        <div>
          <h4>Company</h4>
          <div class="footer-links">
            <a href="247plumbing-about.html">About Us</a>
            <a href="service-areas.html">Service Areas</a>
            <a href="247plumbing-home.html#reviews">Reviews</a>
            <a href="247plumbing-contact.html">Contact</a>
          </div>
        </div>
        <div>
          <h4>Contact</h4>
          <div class="footer-contact-item">${svg(ic.phone)}<div><strong>24/7 Phone</strong><a href="tel:${TEL}">${PHONE}</a></div></div>
          <div class="footer-contact-item">${svg('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>')}<div><strong>Email</strong><a href="mailto:${EMAIL}">${EMAIL}</a></div></div>
          <a class="btn btn-light btn-block" href="247plumbing-contact.html">Book Online</a>
        </div>
      </div>
      <div class="footer-areas">
        <span class="label">Service Areas:</span>
        <span class="cities">${CITIES.map(c => `<a href="${c.slug}-plumber.html">${c.name}</a>`).join(' · ')} · <a href="service-areas.html">see all</a></span>
      </div>
      <div class="footer-bottom">
        <span>© <span id="year">2026</span> 24/7 Plumbing &amp; Heating Ltd. · All rights reserved.</span>
        <span class="footer-legal"><a href="privacy.html">Privacy Policy</a> · <a href="terms.html">Terms of Service</a> · <a href="#" data-cookie-settings>Cookie Settings</a></span>
      </div>
    </div>
  </footer>

  <div class="sticky-call">
    <a href="tel:${TEL}">${svg(ic.phone, 2.2)} Call ${PHONE} — 24/7</a>
  </div>

  <script src="js/main.js"></script>
</body>
</html>
`;
}

function head(title, desc, canonical, schema) {
  return `<!DOCTYPE html>
<html lang="en-CA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0B2A4A">
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
  <title>${title}</title>
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="24/7 Plumbing & Heating Ltd.">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonical}">
  <meta name="robots" content="index, follow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="icon" href="images/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="images/favicon.svg">
  <meta name="color-scheme" content="light">
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body>
`;
}

function citySchema(city, canonical) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Plumber', 'HVACBusiness', 'LocalBusiness'],
        '@id': canonical + '#business',
        name: '24/7 Plumbing & Heating Ltd.',
        image: BASE + 'images/photo-bathroom.webp',
        url: canonical,
        telephone: '+1-403-555-0199',
        email: EMAIL,
        priceRange: '$$',
        address: { '@type': 'PostalAddress', addressLocality: 'Calgary', addressRegion: 'AB', addressCountry: 'CA' },
        geo: { '@type': 'GeoCoordinates', latitude: CALGARY_GEO.lat, longitude: CALGARY_GEO.lng },
        areaServed: { '@type': 'City', name: city.name + ', AB' },
        openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '500', bestRating: '5', worstRating: '1' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '247plumbing-home.html' },
          { '@type': 'ListItem', position: 2, name: 'Service Areas', item: BASE + 'service-areas.html' },
          { '@type': 'ListItem', position: 3, name: city.name, item: canonical }
        ]
      }
    ]
  };
}

function cityPage(city) {
  const canonical = BASE + city.slug + '-plumber.html';
  const title = `${city.name} Plumber | 24/7 Emergency Plumbing & Heating in ${city.name}, AB`;
  const desc = `Licensed 24/7 plumbers and heating techs serving ${city.name}, AB. Emergency plumbing, drains, water heaters, furnaces and gas fitting — upfront flat-rate pricing, every job guaranteed. Call ${PHONE}.`;
  const others = CITIES.filter(c => c.slug !== city.slug);

  const services = SERVICES.map((s, i) => `        <div class="service-card reveal${i % 3 ? ' reveal-delay-' + (i % 3) : ''}">
          <div class="service-icon">${svg(s.icon)}</div>
          <h3>${s.t}</h3>
          <p>${s.d}</p>
          <a class="service-link" href="247plumbing-services.html">Learn more ${svg(ic.arrow)}</a>
        </div>`).join('\n');

  const values = [
    { icon: ic.shield, t: 'Licensed & Insured', d: `Every tech working in ${city.name} is licensed in Alberta, background-checked, bonded and carries $5M liability coverage.` },
    { icon: ic.dollar, t: 'Upfront Flat-Rate Pricing', d: 'You approve the exact price before any work starts. No hourly meter, no surprise "while we’re here" upsells.' },
    { icon: ic.clock, t: '2-Year Workmanship Warranty', d: 'Every repair is guaranteed for two years. If something fails, we come back and fix it free.' }
  ].map((v, i) => `        <div class="value-card reveal${i ? ' reveal-delay-' + i : ''}">
          <div class="v-icon">${svg(v.icon)}</div>
          <h3>${v.t}</h3>
          <p>${v.d}</p>
        </div>`).join('\n');

  const nearby = others.map(c => `<a class="chip" href="${c.slug}-plumber.html">${c.name}</a>`).join('\n          ');

  const main = `  <main id="main-content">

  <section class="page-banner">
    <div class="container-x">
      <div class="breadcrumbs"><a href="247plumbing-home.html">Home</a><span class="sep">›</span><a href="service-areas.html">Service Areas</a><span class="sep">›</span><span>${city.name}</span></div>
      <h1>${city.name}'s 24/7 Plumbing &amp; Heating Experts</h1>
      <p>Fast, licensed plumbing and heating service across ${city.name}, AB — upfront pricing, every job guaranteed.</p>
    </div>
  </section>

  <section class="section">
    <div class="container-x">
      <div class="why-grid">
        <div class="reveal">
          <span class="section-eyebrow">Plumbers in ${city.name}</span>
          <h2 class="section-title">Local plumbing &amp; heating, done right the first time.</h2>
          <p style="color:var(--ink-500); font-size:17px; margin:18px 0;">${city.blurb}</p>
          <p style="color:var(--ink-500); font-size:16px; margin-bottom:18px;">${city.localNote} Whether it’s a 2 a.m. burst pipe or a planned water-heater swap, our ${city.name} team answers the phone, shows up fast, and leaves it fixed.</p>
          <p style="color:var(--ink-900); font-weight:600; margin-bottom:6px;">Neighbourhoods we serve in ${city.name}:</p>
          <ul class="chips">
            ${city.neighbourhoods.map(n => `<li class="chip">${n}</li>`).join('\n            ')}
          </ul>
        </div>
        <div class="reveal reveal-delay-1">
          <div class="contact-info-card">
            <h3>Book a ${city.name} plumber</h3>
            <p>Same-day and 24/7 emergency service. Talk to a real person now.</p>
            <div class="contact-info-list">
              <div class="contact-info-item"><span class="c-icon">${svg(ic.phone)}</span><div><strong>Call 24/7</strong><a href="tel:${TEL}">${PHONE}</a></div></div>
              <div class="contact-info-item"><span class="c-icon">${svg(ic.clock)}</span><div><strong>60-minute response</strong><span>Same-day service in ${city.name}</span></div></div>
              <div class="contact-info-item"><span class="c-icon">${svg(ic.shield)}</span><div><strong>Licensed &amp; insured</strong><span>Bonded in Alberta</span></div></div>
            </div>
            <a class="btn btn-light btn-block" href="247plumbing-contact.html">Book online</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-light">
    <div class="container-x">
      <div class="section-head reveal">
        <span class="section-eyebrow">What we do</span>
        <h2 class="section-title">Plumbing &amp; heating services in ${city.name}</h2>
        <p class="section-lead">From emergency repairs to planned upgrades, here’s what our ${city.name} crews handle every day.</p>
      </div>
      <div class="service-grid">
${services}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-x">
      <div class="section-head reveal">
        <span class="section-eyebrow">Why ${city.name} calls us</span>
        <h2 class="section-title">No surprises. Just honest work.</h2>
      </div>
      <div class="values-grid">
${values}
      </div>
    </div>
  </section>

  <section class="section section-light">
    <div class="container-x">
      <div class="section-head reveal">
        <span class="section-eyebrow">Nearby</span>
        <h2 class="section-title">We also serve communities around ${city.name}</h2>
      </div>
      <div class="reveal" style="display:flex; justify-content:center;">
        <ul class="chips" style="justify-content:center; max-width:680px;">
          ${nearby}
        </ul>
      </div>
    </div>
  </section>

  <div class="cta-band-wrap">
    <div class="cta-band reveal">
      <div class="cta-band-inner">
        <div>
          <h2>Need a plumber in ${city.name} right now?</h2>
          <p>We’re available 24/7, every day of the year. Call and a real person will pick up.</p>
        </div>
        <div class="cta-band-actions">
          <a class="btn btn-light" href="tel:${TEL}">Call ${PHONE}</a>
          <a class="btn btn-outline" href="247plumbing-contact.html">Book Online</a>
        </div>
      </div>
    </div>
  </div>

  </main>
`;

  return head(title, desc, canonical, citySchema(city, canonical)) + topAndNav() + main + footer();
}

function hubPage() {
  const canonical = BASE + 'service-areas.html';
  const title = 'Service Areas | 24/7 Plumbing & Heating Ltd. — Calgary & Area';
  const desc = 'The Calgary-area communities we serve 24/7: ' + CITIES.map(c => c.name).join(', ') + ' and more. Licensed, insured, upfront pricing.';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '247plumbing-home.html' },
      { '@type': 'ListItem', position: 2, name: 'Service Areas', item: canonical }
    ]
  };
  const cards = CITIES.map(c => `        <a class="area-card reveal" href="${c.slug}-plumber.html">
          <h3>${svg(ic.pin)} ${c.name}, AB</h3>
          <p>${c.blurb}</p>
        </a>`).join('\n');

  const main = `  <main id="main-content">

  <section class="page-banner">
    <div class="container-x">
      <div class="breadcrumbs"><a href="247plumbing-home.html">Home</a><span class="sep">›</span><span>Service Areas</span></div>
      <h1>Calgary &amp; Area Service Areas</h1>
      <p>We’re based in Calgary and serve the surrounding communities 24/7. Find your city below.</p>
    </div>
  </section>

  <section class="section">
    <div class="container-x">
      <div class="area-grid">
${cards}
      </div>
      <p style="text-align:center; color:var(--ink-500); margin-top:32px;">Don’t see your town? <a href="247plumbing-contact.html" style="color:var(--royal); font-weight:600;">Call us</a> — we cover most of southern Alberta.</p>
    </div>
  </section>

  <div class="cta-band-wrap">
    <div class="cta-band reveal">
      <div class="cta-band-inner">
        <div>
          <h2>Plumbing emergency anywhere near Calgary?</h2>
          <p>One number, 24/7, every day of the year.</p>
        </div>
        <div class="cta-band-actions">
          <a class="btn btn-light" href="tel:${TEL}">Call ${PHONE}</a>
          <a class="btn btn-outline" href="247plumbing-contact.html">Book Online</a>
        </div>
      </div>
    </div>
  </div>

  </main>
`;
  return head(title, desc, canonical, schema) + topAndNav() + main + footer();
}

/* ----- Write files ---------------------------------------------------- */
let written = [];
for (const city of CITIES) {
  const file = path.join(ROOT, `${city.slug}-plumber.html`);
  fs.writeFileSync(file, cityPage(city), 'utf8');
  written.push(path.basename(file));
}
fs.writeFileSync(path.join(ROOT, 'service-areas.html'), hubPage(), 'utf8');
written.push('service-areas.html');

console.log('Generated ' + written.length + ' pages:');
written.forEach(f => console.log('  - ' + f));
