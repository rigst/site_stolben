(function () {
  // Decorative icons inside labelled links/buttons: hide from AT, remove from tab order.
  document.querySelectorAll('a svg, button svg').forEach((s) => {
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Surgimento ao rolar
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  // Scrollspy: destaca a seção atual no cabeçalho
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute('id');
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { so.observe(s); });
  }

  // Menu mobile colapsável
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  function closeMenu() {
    nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav-links a').forEach(function (l) {
      l.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !e.target.closest('.nav-pill')) closeMenu();
    });
  }

  // Status real dos sistemas: lê o status.json gerado pelo cron na VPS.
  // Se o arquivo não existir ou o fetch falhar, o HTML estático fica como está.
  var live = document.querySelector('.live');
  if (live && window.fetch) {
    fetch('/status.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.services) return;
        var rows = live.querySelectorAll('.live-row');
        data.services.forEach(function (s) {
          rows.forEach(function (row) {
            var svc = row.querySelector('.svc');
            var st = row.querySelector('.st');
            if (!svc || !st || svc.textContent.trim() !== s.host) return;
            var ok = s.code >= 200 && s.code < 400;
            st.textContent = ok ? s.code + ' · OK' : (s.code ? String(s.code) : 'off');
            st.classList.toggle('st-build', !ok);
          });
        });
        if (data.checked) {
          var d = new Date(data.checked);
          if (!isNaN(d)) {
            var foot = document.createElement('div');
            foot.className = 'live-foot';
            foot.textContent = 'verificado às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            live.appendChild(foot);
          }
        }
      })
      .catch(function () {});
  }

  // Cabeçalho destacado ao rolar
  var header = document.querySelector('.nav');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
