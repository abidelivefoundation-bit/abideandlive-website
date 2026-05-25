/* =====================================================================
   Abide & Live Foundation — v4
   Lean, accessible motion system. ~3kb gzipped.
   ===================================================================== */
(() => {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Loader ---------- */
  const hideLoader = () => {
    const l = $('#loader');
    if (!l) return;
    const t = reduceMotion ? 600 : 1800;
    setTimeout(() => l.classList.add('out'), t);
  };
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, { once: true });

  /* ---------- Custom cursor (fine pointer only) ---------- */
  if (finePointer && !reduceMotion) {
    const cur  = $('#cursor');
    const ring = $('#cursor-ring');
    if (cur && ring) {
      let mx = innerWidth / 2, my = innerHeight / 2;
      let rx = mx, ry = my;
      let rafId = 0;
      const tick = () => {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        cur.style.transform  = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
        ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
        rafId = requestAnimationFrame(tick);
      };
      addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
      addEventListener('mouseleave', () => cancelAnimationFrame(rafId), { passive: true });
      tick();

      const hoverSel = 'a,button,.pc,.jc,.ga,.tc,.sg-item,.val,.hsb,.inr,.ci-item';
      document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverSel)) ring.classList.add('is-hover');
      }, { passive: true });
      document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverSel)) ring.classList.remove('is-hover');
      }, { passive: true });
    }
  }

  /* ---------- Nav scroll + parallax (rAF-throttled) ---------- */
  const nav  = $('#nav');
  const orbs = $$('.hero-orb');
  let lastY = -1, scheduled = false;
  const onScroll = () => {
    const y = scrollY;
    if (y === lastY) { scheduled = false; return; }
    lastY = y;
    if (nav) nav.classList.toggle('scrolled', y > 60);
    if (!reduceMotion && y < innerHeight) {
      for (let i = 0; i < orbs.length; i++) {
        orbs[i].style.transform = `translate3d(0,${y * (0.12 + i * 0.07)}px,0)`;
      }
    }
    scheduled = false;
  };
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menu = $('#mmenu');
  const ham  = $('#ham');
  const setMenu = (open) => {
    if (!menu || !ham) return;
    menu.classList.toggle('open', open);
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  ham && ham.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu && menu.addEventListener('click', e => {
    if (e.target.tagName === 'A') setMenu(false);
  });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false);
  });

  /* ---------- Reveal-on-scroll ---------- */
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(x => {
        if (x.isIntersecting) {
          x.target.classList.add('on');
          ro.unobserve(x.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });
    $$('.reveal').forEach(el => ro.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('on'));
  }

  /* ---------- Counters ---------- */
  const animCounter = (el) => {
    const t = +el.dataset.target;
    if (reduceMotion) { el.textContent = t; return; }
    const start = performance.now();
    const dur = 1600;
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(t * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(x => {
        if (x.isIntersecting && !x.target.dataset.done) {
          x.target.dataset.done = '1';
          animCounter(x.target);
          co.unobserve(x.target);
        }
      });
    }, { threshold: 0.5 });
    $$('.counter').forEach(el => co.observe(el));

    /* ---------- Bars ---------- */
    const bo = new IntersectionObserver(entries => {
      entries.forEach(x => {
        if (x.isIntersecting && !x.target.dataset.done) {
          x.target.dataset.done = '1';
          setTimeout(() => x.target.style.width = x.target.dataset.width + '%', reduceMotion ? 0 : 220);
          bo.unobserve(x.target);
        }
      });
    }, { threshold: 0.5 });
    $$('.ib-fill').forEach(el => bo.observe(el));
  }

  /* ---------- Give selection ---------- */
  const amts = $$('.ga');
  amts.forEach(a => a.addEventListener('click', () => {
    amts.forEach(x => x.classList.remove('sel'));
    a.classList.add('sel');
  }));

  window.donate = function () {
    const sel = $('.ga.sel .ga-n');
    const custom = $('#custom-amt');
    const amt = (custom && custom.value) ? '$' + custom.value : (sel ? sel.textContent : '');
    const sub  = encodeURIComponent('Donation — Abide & Live Foundation');
    const body = encodeURIComponent(
      'Hello,\n\nI would like to make a donation of ' + amt +
      ' to Abide & Live Foundation.\n\nPlease send payment instructions.\n\nThank you.'
    );
    location.href = 'mailto:info@abideandlive.org?subject=' + sub + '&body=' + body;
  };

  /* ---------- Contact form ---------- */
  const form = $('#cform');
  form && form.addEventListener('submit', e => {
    e.preventDefault();
    const dept = $('#dept-select').value;
    const grantDepts = ['grants', 'partner'];
    const email = grantDepts.includes(dept) ? 'abidelive.foundation@gmail.com' : 'info@abideandlive.org';
    const labels = {
      general: 'General Inquiry', grants: 'Grants & Funding Partnership',
      programs: 'Programs & Implementation', volunteer: 'Volunteering & Ambassadors',
      media: 'Media & Press', donate: 'Donation & Giving', partner: 'Strategic Partnership'
    };
    const name = form.elements['name'] ? form.elements['name'].value : '';
    const org  = form.elements['org']  ? form.elements['org'].value  : '';
    const em   = form.elements['email']? form.elements['email'].value: '';
    const msg  = form.elements['message']?form.elements['message'].value:'';
    const sub  = encodeURIComponent('Contact Form: ' + (labels[dept] || 'Inquiry') + ' — Abide & Live Foundation');
    const body = encodeURIComponent(
      'Department: ' + (labels[dept] || dept) +
      '\nName: ' + name + '\nOrganisation: ' + org + '\nEmail: ' + em +
      '\n\nMessage:\n' + msg + '\n\n---\nSent from www.abideandlive.org'
    );
    location.href = 'mailto:' + email + '?subject=' + sub + '&body=' + body;
  });

  /* ---------- Newsletter ---------- */
  window.subscribeNL = function () {
    const i = $$('.nl-form input');
    const name = i[0] && i[0].value.trim();
    const em   = i[1] && i[1].value.trim();
    if (!name || !em) { alert('Please enter your name and email.'); return; }
    const sub  = encodeURIComponent('Newsletter Subscription — Abide & Live Foundation');
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + em + '\n\nPlease add me to the Abide & Live field updates newsletter.');
    location.href = 'mailto:info@abideandlive.org?subject=' + sub + '&body=' + body;
  };

  /* ---------- Year ---------- */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
