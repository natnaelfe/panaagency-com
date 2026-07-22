document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('is-open'); });
    });
  }

  // ---- Case grid v2 (Referenzen): fade in on scroll, roughly two at a time ----
  var caseCardsV2 = document.querySelectorAll('.case-card-v2');
  if (caseCardsV2.length && 'IntersectionObserver' in window) {
    var caseV2Observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        el.classList.add('is-visible');
      });
    }, { threshold: 0.2 });
    caseCardsV2.forEach(function (el) { caseV2Observer.observe(el); });
  } else {
    caseCardsV2.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Alternating timeline (Warum PANA Creator): reveal one after another ----
  var timelineItems = document.querySelectorAll('.alt-timeline__content');
  if (timelineItems.length && 'IntersectionObserver' in window) {
    var timelineObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        el.classList.add('is-visible');
      });
    }, { threshold: 0.3 });
    timelineItems.forEach(function (el) { timelineObserver.observe(el); });
  } else {
    timelineItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Perk cards (Karriere page): fade in on scroll, staggered per grid ----
  document.querySelectorAll('.perks-grid').forEach(function (grid) {
    var items = grid.querySelectorAll('.perk--anim');
    if (!items.length) return;
    if ('IntersectionObserver' in window) {
      var perkObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          obs.unobserve(el);
          var siblings = Array.prototype.slice.call(el.parentElement.children).filter(function (c) { return c.classList.contains('perk--anim'); });
          var index = siblings.indexOf(el);
          setTimeout(function () { el.classList.add('is-visible'); }, index * 120);
        });
      }, { threshold: 0.2 });
      items.forEach(function (el) { perkObserver.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    }
  });

  // ---- Mini cards (Für Creator section): fade in on scroll ----
  var miniCards = document.querySelectorAll('.mini-card');
  if (miniCards.length && 'IntersectionObserver' in window) {
    var miniObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        var siblings = Array.prototype.slice.call(el.parentElement.children);
        var index = siblings.indexOf(el);
        setTimeout(function () { el.classList.add('is-visible'); }, index * 150);
      });
    }, { threshold: 0.25 });
    miniCards.forEach(function (el) { miniObserver.observe(el); });
  } else {
    miniCards.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Service cards: fade in on scroll ----
  var serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length && 'IntersectionObserver' in window) {
    var serviceObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        var siblings = Array.prototype.slice.call(el.parentElement.children);
        var index = siblings.indexOf(el);
        setTimeout(function () { el.classList.add('is-visible'); }, index * 150);
      });
    }, { threshold: 0.25 });
    serviceCards.forEach(function (el) { serviceObserver.observe(el); });
  } else {
    serviceCards.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Phone video mockups: staggered fade-in on scroll ----
  var phoneVideos = document.querySelectorAll('.phone-video');
  if (phoneVideos.length && 'IntersectionObserver' in window) {
    var phoneObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        var siblings = Array.prototype.slice.call(el.parentElement.children);
        var index = siblings.indexOf(el);
        setTimeout(function () {
          el.classList.add('is-visible');
          var video = el.querySelector('video');
          if (video) { video.play().catch(function () {}); }
        }, index * 150);
      });
    }, { threshold: 0.3 });
    phoneVideos.forEach(function (el) { phoneObserver.observe(el); });
  } else {
    phoneVideos.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Animated counters (WM / AVD stat blocks) ----
  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        var target = parseInt(el.getAttribute('data-count-to'), 10);
        var suffix = el.getAttribute('data-count-suffix') || '';
        var duration = 1600;
        var startTime = null;
        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = easeOutCubic(progress);
          var value = Math.round(target * eased);
          el.textContent = value.toLocaleString('de-DE') + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);

        // reveal matching chart line, if present
        var card = el.closest('[data-chart-scope]');
        if (card) {
          var path = card.querySelector('.chart-line, .chart-area');
          var dot = card.querySelector('.chart-dot');
          if (path) {
            var len = path.getTotalLength ? path.getTotalLength() : 0;
            card.querySelectorAll('.chart-line, .chart-area').forEach(function (p) {
              var l = p.getTotalLength();
              p.style.strokeDasharray = l;
              p.style.strokeDashoffset = l;
              p.getBoundingClientRect(); // force reflow
              p.style.transition = 'stroke-dashoffset ' + duration + 'ms cubic-bezier(.22,1,.36,1)';
              p.style.strokeDashoffset = 0;
            });
          }
          if (dot) {
            dot.style.opacity = '0';
            setTimeout(function () { dot.style.transition = 'opacity .3s ease'; dot.style.opacity = '1'; }, duration - 200);
          }
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    // no IntersectionObserver support: just show final values
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10);
      var suffix = el.getAttribute('data-count-suffix') || '';
      el.textContent = target.toLocaleString('de-DE') + suffix;
    });
  }

  document.querySelectorAll('.accordion-item__head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.accordion-item');
      var wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('is-open');
      });
      if (!wasOpen) item.classList.add('is-open');
    });
  });
});
