/* ==========================================================================
   WASHON — MAIN.JS
   Site-wide behavior: loader, sticky header, mobile nav, active nav state,
   scroll progress bar, page transitions, WhatsApp button, image fallbacks.
   ========================================================================== */

/* ---------------------------------------------------------------
   CONTACT CONFIG
   Fill these in once real WashOn business details are available.
   Every page reads from this single object so numbers only need
   to be entered once.
--------------------------------------------------------------- */
window.WASHON = {
  whatsappNumber: '923310288688',
  phoneNumber: '+92 335 0247922',
  email: 'washon127@gmail.com',
  address: 'Shop# A-127 Pilibhit Society, Scheme 33 Gulzar-e-hijri, Karachi',
  hours: 'Mon - Sat: 08:00 AM - 11:00 PM',
  mapsEmbed: '', // full Google Maps embed src URL
  mapsDirections: 'https://maps.google.com',
  facebook: 'https://www.facebook.com/profile.php?id=61592873641647#',
  instagram: 'https://www.instagram.com/washon127/',
  // Paste the Google Apps Script Web App URL here to send new review
  // submissions straight into a Google Sheet. See GOOGLE_SHEET_SETUP.md
  // in the project root for the step-by-step setup and the script to paste.
  reviewsSheetUrl: 'https://script.google.com/macros/s/AKfycbwjRtKTrnCa12dGsKrmcvh70LIW56pKaoqPtMiIBdjTagk24r_TVpwg56wVjLHRINxFnA/exec'
};

document.addEventListener('DOMContentLoaded', function () {
  const cfg = window.WASHON;
  if (!cfg) return; // config.js not loaded — check script order

  document.querySelectorAll('[data-address]').forEach(el => el.textContent = cfg.address);
  document.querySelectorAll('[data-hours]').forEach(el => el.textContent = cfg.hours);

  document.querySelectorAll('[data-phone-text]').forEach(el => {
    el.innerHTML = `<a href="tel:${cfg.phoneNumber.replace(/\s+/g, '')}">${cfg.phoneNumber}</a>`;
  });

  document.querySelectorAll('[data-whatsapp-text]').forEach(el => {
    el.innerHTML = `<a href="https://wa.me/${cfg.whatsappNumber}" target="_blank" rel="noopener">+${cfg.whatsappNumber}</a>`;
  });

  document.querySelectorAll('[data-email]').forEach(el => {
    el.textContent = cfg.email;
    el.href = `mailto:${cfg.email}`;
  });

  document.querySelectorAll('[data-facebook]').forEach(el => el.href = cfg.facebook);
  document.querySelectorAll('[data-instagram]').forEach(el => el.href = cfg.instagram);
  document.querySelectorAll('[data-directions]').forEach(el => el.href = cfg.mapsDirections);

  document.querySelectorAll('[data-call]').forEach(el => {
    el.href = `tel:${cfg.phoneNumber.replace(/\s+/g, '')}`;
  });

  document.querySelectorAll('[data-whatsapp-link]').forEach(el => {
    el.href = `https://wa.me/${cfg.whatsappNumber}`;
    el.target = '_blank';
  });
});


document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initMobileNav();
  initActiveNav();
  initScrollProgress();
  initWhatsApp();
  initImageFallbacks();
  initFooterYear();
  initPageTransitions();
  document.body.classList.add('is-loaded');
});

/* ---------- Loading screen ---------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const finish = () => loader.classList.add('hide');
  // Keep it short — never force the visitor to wait.
  if (document.readyState === 'complete') {
    setTimeout(finish, 500);
  } else {
    window.addEventListener('load', () => setTimeout(finish, 450));
    setTimeout(finish, 1400); // hard cap
  }
}

/* ---------- Sticky header ---------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const isInnerPage = header.dataset.solid === 'true';
  if (isInnerPage) header.classList.add('solid');

  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-nav');
  if (!btn || !menu) return;

  const toggle = (open) => {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };

  btn.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
}

/* ---------- Active nav link ---------- */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------- WhatsApp floating button ---------- */
function initWhatsApp() {
  const el = document.querySelector('.wa-float');
  const headerWa = document.querySelector('.header-whatsapp');
  const num = window.WASHON.whatsappNumber;
  const link = num ? `https://wa.me/${num}` : '#';
  if (el) {
    el.setAttribute('href', link);
    if (!num) el.setAttribute('aria-disabled', 'true');
  }
  if (headerWa) headerWa.setAttribute('href', link);

  document.querySelectorAll('[data-call]').forEach(a => {
    a.setAttribute('href', window.WASHON.phoneNumber ? `tel:${window.WASHON.phoneNumber.replace(/\s+/g, '')}` : '#');
  });
  document.querySelectorAll('[data-whatsapp-link]').forEach(a => a.setAttribute('href', link));
  document.querySelectorAll('[data-directions]').forEach(a => a.setAttribute('href', window.WASHON.mapsDirections));
  document.querySelectorAll('[data-email]').forEach(el => { el.textContent = window.WASHON.email; el.setAttribute('href', `mailto:${window.WASHON.email}`); });
  document.querySelectorAll('[data-address]').forEach(el => el.textContent = window.WASHON.address);
  document.querySelectorAll('[data-hours]').forEach(el => el.textContent = window.WASHON.hours);
  document.querySelectorAll('[data-phone-text]').forEach(el => el.textContent = window.WASHON.phoneNumber || '[ADD PHONE NUMBER]');
  document.querySelectorAll('[data-facebook]').forEach(a => a.setAttribute('href', window.WASHON.facebook));
  document.querySelectorAll('[data-instagram]').forEach(a => a.setAttribute('href', window.WASHON.instagram));
}

/* ---------- Graceful image fallback ----------
   If a placeholder photo source fails to load (e.g. offline demo),
   swap in a styled HUD-pattern placeholder instead of a broken icon. */
function initImageFallbacks() {
  document.querySelectorAll('.photo img').forEach(img => {
    img.addEventListener('error', () => {
      const wrap = img.closest('.photo');
      if (!wrap || wrap.classList.contains('ph-fallback')) return;
      wrap.classList.add('ph-fallback');
      img.remove();
      const label = wrap.dataset.label || 'WashOn';
      wrap.innerHTML = `
        <span class="ph-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><path d="M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5"/><path d="M3 13h18v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="15.5" r="1"/><circle cx="16.5" cy="15.5" r="1"/></svg>
        </span>
        <span class="ph-label">${label}</span>`;
    }, { once: true });
  });
}

function initFooterYear() {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}

/* ---------- Page transitions ---------- */
function initPageTransitions() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank') return;
    if (!href.endsWith('.html')) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('leave');
      setTimeout(() => { window.location.href = href; }, 380);
    });
  });
}
