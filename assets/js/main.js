/* ===================================================================
   DOMÍNIO BARBEARIA — Interactions
   - Header scroll state
   - Mobile menu toggle
   - Reveal-on-scroll (IntersectionObserver)
   - Testimonials slider (touch + keyboard + autoplay)
   - Footer year
   =================================================================== */

(function () {
  'use strict';

  /* -------- Header scroll state -------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------- Mobile menu -------- */
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* -------- Reveal on scroll -------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* -------- Testimonials slider -------- */
  const track = document.getElementById('testimonialsTrack');
  const dotsWrap = document.getElementById('testimonialsDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');

  if (track && dotsWrap && prevBtn && nextBtn) {
    const slides = Array.from(track.children);
    let index = 0;
    let timer;

    // Build dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Depoimento ${i + 1}`);
      b.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(b);
    });
    const dots = Array.from(dotsWrap.children);

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    };
    const goTo = (i, manual) => {
      index = (i + slides.length) % slides.length;
      update();
      if (manual) restart();
    };
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    prevBtn.addEventListener('click', () => { prev(); restart(); });
    nextBtn.addEventListener('click', () => { next(); restart(); });

    // Keyboard
    document.getElementById('testimonials').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev(); restart(); }
      if (e.key === 'ArrowRight') { next(); restart(); }
    });

    // Touch
    let startX = 0, deltaX = 0, dragging = false;
    track.addEventListener('touchstart', (e) => {
      dragging = true; startX = e.touches[0].clientX; deltaX = 0;
    }, { passive: true });
    track.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    track.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(deltaX) > 40) {
        deltaX < 0 ? next() : prev();
        restart();
      }
    });

    // Autoplay (respects reduced motion)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = () => { if (!reduced) timer = setInterval(next, 6500); };
    const stop = () => clearInterval(timer);
    const restart = () => { stop(); start(); };

    // Pause on hover/focus
    const t = document.getElementById('testimonials');
    t.addEventListener('mouseenter', stop);
    t.addEventListener('mouseleave', start);
    t.addEventListener('focusin', stop);
    t.addEventListener('focusout', start);

    update();
    start();
  }

  /* -------- Footer year -------- */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
