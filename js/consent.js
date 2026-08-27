(function () {
  'use strict';

  var GA_MEASUREMENT_ID = 'G-ZJ8N7HE354';
  var STORAGE_KEY = 'pana_cookie_consent';
  var BANNER_VERSION = 1;
  var REASK_AFTER_DAYS = 365;
  var isEN = document.documentElement.lang === 'en';
  var privacyHref = isEN ? 'datenschutz-en.html' : 'datenschutz.html';
  var imprintHref = isEN ? 'impressum-en.html' : 'impressum.html';

  var t = isEN ? {
    heading: 'Cookies on pana-agency.de',
    message: 'We use cookies that are necessary to operate the website. We would also like to use Google Analytics to understand how our website is used. This sets cookies and transmits data to Google, including to the US. This only happens if you agree. You can change your decision at any time via "Cookie settings" in the footer.',
    links: 'Privacy Policy',
    linksImprint: 'Imprint',
    essentialOnly: 'Essential only',
    acceptAll: 'Accept all',
    settings: 'Settings',
    settingsTitle: 'Cookie settings',
    essentialTitle: 'Essential (always active)',
    essentialDesc: 'Stores your cookie decision so we don\'t have to ask you again on every visit. Legal basis: § 25(2) No. 2 TDDDG. Provider: Pana Agency GbR. Retention: 12 months.',
    statsTitle: 'Statistics and reach measurement',
    statsDesc: 'Google Analytics, provider Google Ireland Limited. Purpose: analysis of which pages are visited, how long visitors stay, and where visits come from. Cookies: _ga and _ga_<container ID>, each with a lifespan of up to 24 months. Data transfer: EU and EEA, in exceptional cases the US. Legal basis: § 25(1) TDDDG, Art. 6(1)(a) GDPR.',
    save: 'Save selection',
    close: 'Close'
  } : {
    heading: 'Cookies auf pana-agency.de',
    message: 'Wir setzen Cookies ein, die für den Betrieb der Website notwendig sind. Zusätzlich möchten wir mit Google Analytics verstehen, wie unsere Website genutzt wird. Dabei werden Cookies gesetzt und Daten an Google übermittelt, auch in die USA. Das geschieht nur, wenn du zustimmst. Deine Entscheidung kannst du jederzeit über "Cookie-Einstellungen" im Fußbereich ändern.',
    links: 'Datenschutzerklärung',
    linksImprint: 'Impressum',
    essentialOnly: 'Nur essenzielle',
    acceptAll: 'Alle akzeptieren',
    settings: 'Einstellungen',
    settingsTitle: 'Cookie-Einstellungen',
    essentialTitle: 'Essenziell (immer aktiv)',
    essentialDesc: 'Speichert deine Cookie-Entscheidung, damit wir dich nicht bei jedem Besuch erneut fragen. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG. Anbieter: Pana Agency GbR. Speicherdauer: 12 Monate.',
    statsTitle: 'Statistik und Reichweitenmessung',
    statsDesc: 'Google Analytics, Anbieter Google Ireland Limited. Zweck: Auswertung, welche Seiten aufgerufen werden, wie lange Besucherinnen und Besucher bleiben und woher die Zugriffe kommen. Cookies: _ga und _ga_<Container-ID>, Laufzeit jeweils bis zu 24 Monate. Datenübermittlung: EU und EWR, in Ausnahmefällen USA. Rechtsgrundlage: § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO.',
    save: 'Auswahl speichern',
    close: 'Schließen'
  };

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.version !== BANNER_VERSION) return null;
      var age = (Date.now() - new Date(data.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      if (age > REASK_AFTER_DAYS) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function setConsent(statistik) {
    var data = {
      statistik: !!statistik,
      timestamp: new Date().toISOString(),
      version: BANNER_VERSION
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

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

  function applyConsent(data) {
    if (data && data.statistik) {
      loadAnalytics();
    }
  }

  function removeEl(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

  function closeAll() {
    removeEl('pa-cookie-banner');
    removeEl('pa-cookie-settings');
  }

  function renderSettings(prefill) {
    removeEl('pa-cookie-banner');
    if (document.getElementById('pa-cookie-settings')) return;

    var statsChecked = prefill && prefill.statistik ? 'checked' : '';

    var overlay = document.createElement('div');
    overlay.id = 'pa-cookie-settings';
    overlay.innerHTML =
      '<div class="pa-cookie-modal">' +
        '<h2 class="pa-cookie-modal__title">' + t.settingsTitle + '</h2>' +
        '<div class="pa-cookie-modal__row">' +
          '<div class="pa-cookie-modal__row-head">' +
            '<span class="pa-cookie-modal__row-title">' + t.essentialTitle + '</span>' +
            '<span class="pa-cookie-toggle pa-cookie-toggle--locked" aria-hidden="true"><span class="pa-cookie-toggle__dot"></span></span>' +
          '</div>' +
          '<p class="pa-cookie-modal__row-desc">' + t.essentialDesc + '</p>' +
        '</div>' +
        '<div class="pa-cookie-modal__row">' +
          '<div class="pa-cookie-modal__row-head">' +
            '<span class="pa-cookie-modal__row-title">' + t.statsTitle + '</span>' +
            '<label class="pa-cookie-toggle">' +
              '<input type="checkbox" id="pa-cookie-stats-toggle" ' + statsChecked + '>' +
              '<span class="pa-cookie-toggle__dot"></span>' +
            '</label>' +
          '</div>' +
          '<p class="pa-cookie-modal__row-desc">' + t.statsDesc + '</p>' +
        '</div>' +
        '<div class="pa-cookie-modal__actions">' +
          '<button type="button" class="btn btn--secondary pa-cookie-essential">' + t.essentialOnly + '</button>' +
          '<button type="button" class="btn btn--secondary pa-cookie-acceptall">' + t.acceptAll + '</button>' +
          '<button type="button" class="btn btn--primary pa-cookie-save">' + t.save + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.querySelector('.pa-cookie-save').addEventListener('click', function () {
      var checked = document.getElementById('pa-cookie-stats-toggle').checked;
      var data = setConsent(checked);
      applyConsent(data);
      closeAll();
    });
    overlay.querySelector('.pa-cookie-essential').addEventListener('click', function () {
      var data = setConsent(false);
      applyConsent(data);
      closeAll();
    });
    overlay.querySelector('.pa-cookie-acceptall').addEventListener('click', function () {
      var data = setConsent(true);
      applyConsent(data);
      closeAll();
    });
  }

  function renderBanner() {
    if (document.getElementById('pa-cookie-banner') || document.getElementById('pa-cookie-settings')) return;
    var banner = document.createElement('div');
    banner.id = 'pa-cookie-banner';
    banner.innerHTML =
      '<div class="pa-cookie-banner__inner">' +
        '<div class="pa-cookie-banner__text">' +
          '<h2 class="pa-cookie-banner__heading">' + t.heading + '</h2>' +
          '<p>' + t.message + '</p>' +
          '<p class="pa-cookie-banner__links"><a href="' + privacyHref + '">' + t.links + '</a> · <a href="' + imprintHref + '">' + t.linksImprint + '</a></p>' +
        '</div>' +
        '<div class="pa-cookie-banner__actions">' +
          '<button type="button" class="btn btn--ondark pa-cookie-decline">' + t.essentialOnly + '</button>' +
          '<button type="button" class="btn btn--ondark pa-cookie-accept">' + t.acceptAll + '</button>' +
          '<button type="button" class="btn btn--ondark pa-cookie-open-settings">' + t.settings + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('.pa-cookie-accept').addEventListener('click', function () {
      var data = setConsent(true);
      applyConsent(data);
      closeAll();
    });
    banner.querySelector('.pa-cookie-decline').addEventListener('click', function () {
      var data = setConsent(false);
      applyConsent(data);
      closeAll();
    });
    banner.querySelector('.pa-cookie-open-settings').addEventListener('click', function () {
      renderSettings(getConsent());
    });
  }

  // Footer "Cookie-Einstellungen" link opens the settings layer directly
  window.paOpenCookieSettings = function (e) {
    if (e) e.preventDefault();
    renderSettings(getConsent());
  };

  document.addEventListener('DOMContentLoaded', function () {
    var consent = getConsent();
    if (consent) {
      applyConsent(consent);
    } else {
      renderBanner();
    }
  });
})();
