(function () {
  'use strict';

  // ===== Mobile nav toggle =====
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth < 1024) menu.classList.remove('is-open');
      });
    });
  }

  // ===== Reveal on scroll =====
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ===== Stat counter =====
  const stats = document.querySelectorAll('.stat .n[data-count]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && stats.length) {
    const sIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        if (reducedMotion) {
          el.textContent = target.toLocaleString() + suffix;
        } else {
          const duration = 1400;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const v = Math.floor(p * target);
            el.textContent = v.toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString() + suffix;
          }
          requestAnimationFrame(tick);
        }
        sIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    stats.forEach(function (el) { sIO.observe(el); });
  }

  // ===== Contact form =====
  // NOTE: This is a front-end stub. No data leaves the browser yet. Before
  // launch, point the form at a real handler (Formspree / Netlify Forms / an
  // API endpoint) and replace the simulated success below with the response.
  const form = document.querySelector('.contact-form');
  if (form) {
    const button = form.querySelector('.form-submit');
    const status = form.querySelector('.form-status');
    const label = button ? button.textContent.trim() : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      if (status) { status.textContent = ''; }

      window.setTimeout(function () {
        form.reset();
        if (button) { button.disabled = false; button.textContent = label; }
        if (status) {
          status.textContent = 'Thanks — your request has been received. We’ll call you back within 60 minutes.';
        }
      }, 800);
    });
  }
})();

/* ===== Footer year ===== */
(function () {
  var y = document.getElementById('year');
  if (y) { y.textContent = new Date().getFullYear(); }
})();

/* ===== Cookie consent (privacy-first: nothing non-essential loads until granted) ===== */
(function () {
  var KEY = 'cookie-consent-v1';
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  function loadAnalytics() {
    // Consent granted — load analytics / marketing scripts HERE and nowhere else.
    // e.g. var s = document.createElement('script'); s.async = true;
    //      s.src = 'https://your-analytics.example/script.js';
    //      document.head.appendChild(s);
  }

  function build() {
    var el = document.createElement('div');
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie consent');
    el.innerHTML =
      '<p><strong>We value your privacy.</strong> We use essential cookies to run this site, ' +
      'and — only with your consent — analytics to improve it. Read our ' +
      '<a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button class="btn btn-ghost" type="button" data-consent="declined">Decline</button>' +
      '<button class="btn btn-primary" type="button" data-consent="granted">Accept</button>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) { return; }
      var v = b.getAttribute('data-consent');
      store(v);
      if (v === 'granted') { loadAnalytics(); }
      el.classList.remove('is-open');
    });
    return el;
  }
  function banner() { return document.querySelector('.cookie-banner') || build(); }

  // Re-open the banner from any "Cookie Settings" link.
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cookie-settings]');
    if (!t) { return; }
    e.preventDefault();
    banner().classList.add('is-open');
  });

  var choice = read();
  if (choice === 'granted') {
    loadAnalytics();
  } else if (choice !== 'declined') {
    var b = build();
    window.setTimeout(function () { b.classList.add('is-open'); }, 600);
  }
})();
