/*!
 * enhance.js — progressive UX polish for robinsonvidva.com
 * Reading progress bar, scroll-reveal, navbar shadow, page view counts.
 * All effects degrade gracefully: with no JS or no IntersectionObserver the
 * page renders exactly as before, and motion is suppressed for users who
 * request reduced motion.
 */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Reading progress bar ---------- */
  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  var ticking = false;

  function updateBar() {
    var scrollable = docEl.scrollHeight - docEl.clientHeight;
    var top = window.scrollY || docEl.scrollTop || 0;
    var pct = scrollable > 0 ? (top / scrollable) * 100 : 0;
    bar.style.width = pct.toFixed(2) + '%';
    ticking = false;
  }

  /* ---------- Navbar shadow on scroll ---------- */
  var navbar = document.querySelector('.navbar.sticky-top');
  function updateNav() {
    if (navbar) navbar.classList.toggle('scrolled', (window.scrollY || 0) > 8);
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateBar);
      ticking = true;
    }
    updateNav();
  }

  /* ---------- Scroll reveal ---------- */
  function setupReveal() {
    if (reduceMotion || !hasIO) return;
    docEl.classList.add('js-enhanced');

    var els = document.querySelectorAll('section');
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(els, function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---------- View counts (from views.json, updated daily from GA) ---------- */
  function setupViews() {
    var els = document.querySelectorAll('.page-views, .view-count');
    var totalEl = document.getElementById('total-site-views');
    if (!els.length && !totalEl) return;
    fetch('/views.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (data) {
      if (totalEl && data.totalViews > 0) totalEl.textContent = data.totalViews.toLocaleString();
      var pages = data.pages || {};
      Array.prototype.forEach.call(els, function (el) {
        var target = el.querySelector('.view-number') || el;
        var p = el.getAttribute('data-path') || window.location.pathname;
        var v = pages[p];
        if (v === undefined && p === '/') v = pages['/index.html'];
        if (v === undefined && p.charAt(p.length - 1) === '/') v = pages[p + 'index.html'];
        if (v === undefined && p.indexOf('.') === -1) v = pages[p + '.html'];
        if (v > 0) target.textContent = v.toLocaleString();
      });
    }).catch(function () {});
  }

  /* ---------- Init ---------- */
  function init() {
    document.body.appendChild(bar);
    setupReveal();
    setupViews();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateBar();
    updateNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
