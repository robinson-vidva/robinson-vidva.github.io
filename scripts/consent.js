/* Cookie consent for Google Analytics, shown only to visitors in the EEA, UK and Switzerland. */
(function () {
  var CHOICE_KEY = 'consent-analytics';
  var REGION_KEY = 'consent-region';
  var REGION_TTL = 30 * 24 * 60 * 60 * 1000;
  var CONSENT_REGIONS = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
    'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'];

  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function remove(key) { try { localStorage.removeItem(key); } catch (e) {} }

  function pushConsent(state) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('consent', 'update', { analytics_storage: state });
  }

  function regionNeedsConsent(callback) {
    var cached = read(REGION_KEY);
    if (cached) {
      try {
        var entry = JSON.parse(cached);
        if (entry && Date.now() - entry.ts < REGION_TTL) {
          return callback(CONSENT_REGIONS.indexOf(entry.loc) !== -1);
        }
      } catch (e) {}
    }
    if (!window.fetch) { return callback(true); }
    fetch('/cdn-cgi/trace', { cache: 'no-store' })
      .then(function (response) { return response.text(); })
      .then(function (text) {
        var match = /(?:^|\n)loc=([A-Z]{2})/.exec(text);
        var loc = match ? match[1] : 'XX';
        store(REGION_KEY, JSON.stringify({ loc: loc, ts: Date.now() }));
        callback(loc === 'XX' || CONSENT_REGIONS.indexOf(loc) !== -1);
      })
      .catch(function () { callback(true); });
  }

  function hideBanner() {
    var banner = document.getElementById('consent-banner');
    if (banner) { banner.parentNode.removeChild(banner); }
  }

  function showBanner() {
    if (document.getElementById('consent-banner')) { return; }
    var banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>This site uses Google Analytics to count visits. May it set an analytics cookie? ' +
      'If you decline, visits are counted without cookies. ' +
      '<a href="/terms.html#cookies">Privacy policy</a></p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-primary btn-sm" data-consent="granted">Accept</button>' +
      '<button type="button" class="btn btn-outline-primary btn-sm" data-consent="denied">Decline</button>' +
      '</div>';
    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-consent]');
      if (!button) { return; }
      var choice = button.getAttribute('data-consent');
      store(CHOICE_KEY, choice);
      pushConsent(choice);
      hideBanner();
    });
    document.body.appendChild(banner);
  }

  function init() {
    var choice = read(CHOICE_KEY);
    if (choice === 'granted' || choice === 'denied') {
      pushConsent(choice);
      return;
    }
    regionNeedsConsent(function (needed) { if (needed) { showBanner(); } });
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-consent-reset]');
    if (!link) { return; }
    event.preventDefault();
    remove(CHOICE_KEY);
    showBanner();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
