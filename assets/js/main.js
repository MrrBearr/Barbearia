/* ===================================================================
   DOMÍNIO BARBEARIA — Premium Interactions
   ===================================================================
   - Loader inicial
   - Scroll progress bar
   - Custom cursor (desktop)
   - Header scroll state
   - Mobile menu toggle
   - Reveal-on-scroll (up / mask / lines)
   - Auto split em linhas para [data-reveal="lines"]
   - Number counter
   - Magnetic CTAs
   - Parallax do mouse no hero
   - Parallax de scroll em [data-parallax-y]
   - 3D tilt em [data-tilt]
   - Testimonials slider (touch + keyboard + autoplay)
   - FAQ accordion suave
   - Footer year
   =================================================================== */

(function () {
  'use strict';

  const demoWhatsApp = `https://wa.me/5583921483515?text=${encodeURIComponent('Olá, Caio! Vi a demonstração da DOMÍNIO Barbearia e quero conversar sobre um site para o meu negócio.')}`;
  document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
    link.href = demoWhatsApp;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ============================ LOADER ============================ */
  document.body.classList.add('is-loading');
  const loader = document.getElementById('loader');
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    // Disparar revelações iniciais
    document.dispatchEvent(new CustomEvent('site:ready'));
  };
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 400);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 400));
  }
  // Fallback
  setTimeout(hideLoader, 3500);

  /* ============================ SCROLL PROGRESS ============================ */
  const progress = document.getElementById('scrollProgress');
  if (progress) {
    const updateProgress = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      progress.style.width = pct + '%';
    };
    document.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ============================ CUSTOM CURSOR ============================ */
  if (isFinePointer && !reduced) {
    const cursor = document.getElementById('cursor');
    const dot = cursor && cursor.querySelector('.cursor__dot');
    const ring = cursor && cursor.querySelector('.cursor__ring');
    if (cursor && dot && ring) {
      document.body.classList.add('has-custom-cursor');

      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let dx = mx, dy = my;     // dot (rápido)
      let rx = mx, ry = my;     // ring (lento, lerp)

      window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
      });
      window.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
      });
      window.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
      });
      window.addEventListener('mousedown', () => cursor.classList.add('is-down'));
      window.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

      const tick = () => {
        // Dot — segue direto
        dx += (mx - dx) * 0.55;
        dy += (my - dy) * 0.55;
        // Ring — segue suave (lerp)
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;

        dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      // Hover state em interativos
      const hoverables = 'a, button, [data-magnetic], summary, .faq__q, input, textarea, select';
      document.querySelectorAll(hoverables).forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
      });
    }
  }

  /* ============================ HEADER SCROLL ============================ */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 24) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================ MOBILE MENU ============================ */
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

  /* ============================ SPLIT EM LINHAS ============================ */
  // Quebra cada [data-reveal="lines"] em <span class="line"><span class="line__inner">...</span></span>
  // baseado em quebras manuais (<br>) ou em uma única linha lógica.
  const splitLines = (el) => {
    if (el.dataset.split === 'done') return;
    // Se tem <br>, dividir por <br>
    const html = el.innerHTML;
    // Substitui <br> por marcadores e divide
    const parts = html.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
    el.innerHTML = parts
      .map((p) => `<span class="line"><span class="line__inner">${p}</span></span>`)
      .join('');
    el.dataset.split = 'done';
  };
  document.querySelectorAll('[data-reveal="lines"]').forEach(splitLines);

  /* ============================ REVEAL OBSERVER ============================ */
  // Setup é chamado depois que o loader some, para garantir que as animações
  // sejam vistas pelo usuário.
  const setupReveals = () => {
    const revealEls = document.querySelectorAll('[data-reveal], .reveal');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const delay = parseInt(el.dataset.revealDelay || '0', 10);

            // Para "lines" — staggera as linhas internas
            if (el.dataset.reveal === 'lines') {
              const inners = el.querySelectorAll('.line__inner');
              inners.forEach((inner, i) => {
                inner.style.transitionDelay = `${delay + i * 90}ms`;
              });
            } else if (delay) {
              el.style.transitionDelay = `${delay}ms`;
            }

            el.classList.add('is-visible');
            io.unobserve(el);
          });
        },
        { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
      );
      revealEls.forEach((el) => io.observe(el));

      // Rede de segurança: depois de 5s da abertura da página, qualquer elemento
      // que ainda não foi revelado é forçado a aparecer (evita imagens presas
      // se o observer falhar por algum motivo).
      setTimeout(() => {
        document.querySelectorAll('[data-reveal]:not(.is-visible), .reveal:not(.is-visible)').forEach((el) => {
          el.classList.add('is-visible');
        });
      }, 5000);
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  };
  document.addEventListener('site:ready', setupReveals, { once: true });

  /* ============================ NUMBER COUNTER ============================ */
  const formatNumber = (n, opts) => {
    const { decimals = 0, format = '', prefix = '', suffix = '' } = opts;
    let str = n.toFixed(decimals);
    if (format === 'thousand') {
      const [intPart, decPart] = str.split('.');
      str = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (decPart ? ',' + decPart : '');
    } else if (decimals > 0) {
      str = str.replace('.', ',');
    }
    return `${prefix}${str}${suffix}`;
  };
  const setupCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!('IntersectionObserver' in window) || !counters.length) return;
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const from = parseFloat(el.dataset.from || '0');
          const to = parseFloat(el.dataset.to || '0');
          const decimals = parseInt(el.dataset.decimals || '0', 10);
          const opts = {
            decimals,
            format: el.dataset.format || '',
            prefix: el.dataset.prefix || '',
            suffix: el.dataset.suffix || '',
          };
          const dur = 1800;
          const start = performance.now();
          const ease = (t) => 1 - Math.pow(1 - t, 4);
          if (reduced) {
            el.textContent = formatNumber(to, opts);
            cio.unobserve(el);
            return;
          }
          const step = (now) => {
            const t = Math.min(1, (now - start) / dur);
            const v = from + (to - from) * ease(t);
            el.textContent = formatNumber(v, opts);
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  };
  document.addEventListener('site:ready', setupCounters, { once: true });

  /* ============================ MAGNETIC BUTTONS ============================ */
  if (isFinePointer && !reduced) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 18;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ============================ PARALLAX MOUSE — HERO ============================ */
  if (!reduced && isFinePointer) {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero__bg');
    if (hero && heroBg) {
      let tx = 0, ty = 0, cx = 0, cy = 0;
      hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 30;  // -15..15
        ty = ((e.clientY - r.top) / r.height - 0.5) * 30;
        hero.classList.add('is-mouse-active');
      });
      hero.addEventListener('mouseleave', () => {
        tx = 0; ty = 0;
      });
      const animate = () => {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        heroBg.style.transform = `scale(1.08) translate(${cx}px, ${cy}px)`;
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }

  /* ============================ PARALLAX SCROLL ============================ */
  if (!reduced) {
    const parallaxEls = document.querySelectorAll('[data-parallax-y]');
    if (parallaxEls.length && 'IntersectionObserver' in window) {
      const visible = new Set();
      const pio = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        });
      }, { rootMargin: '100px 0px' });
      parallaxEls.forEach((el) => pio.observe(el));

      const tickP = () => {
        const winH = window.innerHeight;
        visible.forEach((el) => {
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const progress = (center - winH / 2) / winH; // -1..1
          const max = parseFloat(el.dataset.parallaxY || '40');
          const t = -progress * max;
          // Aplicar à imagem interna se houver, senão ao próprio
          const inner = el.querySelector('img') || el;
          inner.style.transform = `translate3d(0, ${t.toFixed(1)}px, 0) scale(1.06)`;
        });
        requestAnimationFrame(tickP);
      };
      requestAnimationFrame(tickP);
    }
  }

  /* ============================ 3D TILT ============================ */
  if (isFinePointer && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = 6; // graus
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -max * 2;
        const ry = (px - 0.5) * max * 2;
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ============================ TESTIMONIALS SLIDER ============================ */
  const track = document.getElementById('testimonialsTrack');
  const dotsWrap = document.getElementById('testimonialsDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');

  if (track && dotsWrap && prevBtn && nextBtn) {
    const slides = Array.from(track.children);
    let index = 0;
    let timer;

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

    document.getElementById('testimonials').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev(); restart(); }
      if (e.key === 'ArrowRight') { next(); restart(); }
    });

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

    const start = () => { if (!reduced) timer = setInterval(next, 6500); };
    const stop = () => clearInterval(timer);
    const restart = () => { stop(); start(); };

    const t = document.getElementById('testimonials');
    t.addEventListener('mouseenter', stop);
    t.addEventListener('mouseleave', start);
    t.addEventListener('focusin', stop);
    t.addEventListener('focusout', start);

    update();
    start();
  }

  /* ============================ FAQ ACCORDION ============================ */
  document.querySelectorAll('[data-faq]').forEach((item) => {
    const btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      // Fecha todos os outros (comportamento de accordion único)
      document.querySelectorAll('[data-faq].is-open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          const b = other.querySelector('.faq__q');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });
  });

  /* ============================ FOOTER YEAR ============================ */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
