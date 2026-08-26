(function () {
  'use strict';

  var GA_MEASUREMENT_ID = 'G-ZJ8N7HE354';
  var STORAGE_KEY = 'pana_cookie_consent';
  var isEN = document.documentElement.lang === 'en';

  var texts = {
    de: {
      message: 'Wir nutzen Google Analytics, um zu verstehen, wie unsere Website genutzt wird. Das setzt nur mit deiner Zustimmung Cookies.',
      decline: 'Ablehnen',
      accept: 'Akzeptieren',
      link: 'Datenschutzerklärung',
      settingsLabel: 'Cookie-Einstellungen'
    },
    en: {
      message: 'We use Google Analytics to understand how our website is used. This only sets cookies with your consent.',
      decline: 'Decline',
      accept: 'Accept',
      link: 'Privacy Policy',
      settingsLabel: 'Cookie settings'
    }
  };

  var t = isEN ? texts.en : texts.de;
  var privacyHref = isEN ? 'datenschutz-en.html' : 'datenschutz.html';

  function loadAnalytics() {
    if (window.__paGaLoaded) return;
    window.__paGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function removeBanner() {
    var el = document.getElementById('pa-cookie-banner');
    if (el) el.remove();
  }

  function renderBanner() {
    if (document.getElementById('pa-cookie-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'pa-cookie-banner';
    banner.innerHTML =
      '<div class="pa-cookie-banner__inner">' +
        '<p class="pa-cookie-banner__text">' + t.message + ' <a href="' + privacyHref + '">' + t.link + '</a></p>' +
        '<div class="pa-cookie-banner__actions">' +
          '<button type="button" class="btn btn--ondark pa-cookie-decline">' + t.decline + '</button>' +
          '<button type="button" class="btn btn--primary pa-cookie-accept">' + t.accept + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('.pa-cookie-accept').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      loadAnalytics();
      removeBanner();
    });
    banner.querySelector('.pa-cookie-decline').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'declined');
      removeBanner();
    });
  }

  // Expose a way to reopen the banner (e.g. from a "Cookie settings" footer link)
  window.paOpenCookieSettings = function (e) {
    if (e) e.preventDefault();
    renderBanner();
  };

  document.addEventListener('DOMContentLoaded', function () {
    var consent = localStorage.getItem(STORAGE_KEY);
    if (consent === 'accepted') {
      loadAnalytics();
    } else if (consent !== 'declined') {
      renderBanner();
    }
  });
})();
