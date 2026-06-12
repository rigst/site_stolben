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

  // Cabeçalho destacado ao rolar
  var header = document.querySelector('.nav');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
