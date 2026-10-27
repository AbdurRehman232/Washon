/* ==========================================================================
   WASHON — MAIN.JS
   Site-wide behavior: loader, sticky header, mobile nav, active nav state,
   scroll progress bar, page transitions, WhatsApp button, image fallbacks,
   contact details and Google Map.
   ========================================================================== */

window.WASHON = {
  whatsappNumber: '923310288688',
  phoneNumber: '+92 335 0247922',
  email: 'washon127@gmail.com',
  address: 'Shop# A-127 Pilibhit Society, Scheme 33 Gulzar-e-hijri, Karachi',
  hours: 'Mon - Sat: 08:00 AM - 11:00 PM',
  mapsEmbed: 'https://www.google.com/maps?q=A-127+Pilibhit+Society+Scheme+33+Gulzar-e-Hijri+Karachi&output=embed',
  mapsDirections: 'https://www.google.com/maps/dir/?api=1&destination=A-127+Pilibhit+Society+Scheme+33+Gulzar-e-Hijri+Karachi',
  facebook: 'https://www.facebook.com/profile.php?id=61592873641647#',
  instagram: 'https://www.instagram.com/washon127/',
  // Google Apps Script Web App URL that saves new reviews to a Google Sheet.
  reviewsSheetUrl: 'https://script.google.com/macros/s/AKfycbwjRtKTrnCa12dGsKrmcvh70LIW56pKaoqPtMiIBdjTagk24r_TVpwg56wVjLHRINxFnA/exec'
};

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initMobileNav();
  initActiveNav();
  initScrollProgress();
  initContactDetails();
  initMap();
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
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------- Contact details, WhatsApp, call, social links ---------- */
function initContactDetails() {
  const cfg = window.WASHON;
  const tel = cfg.phoneNumber.replace(/\s+/g, '');
  const wa = `https://wa.me/${cfg.whatsappNumber}`;

  document.querySelectorAll('[data-address]').forEach(el => el.textContent = cfg.address);
  document.querySelectorAll('[data-hours]').forEach(el => el.textContent = cfg.hours);

  document.querySelectorAll('[data-phone-text]').forEach(el => {
    el.innerHTML = `<a href="tel:${tel}">${cfg.phoneNumber}</a>`;
  });
  document.querySelectorAll('[data-whatsapp-text]').forEach(el => {
    el.innerHTML = `<a href="${wa}" target="_blank" rel="noopener">+${cfg.whatsappNumber}</a>`;
  });

  document.querySelectorAll('[data-email]').forEach(el => {
    el.textContent = cfg.email;
    el.setAttribute('href', `mailto:${cfg.email}`);
  });

  document.querySelectorAll('[data-facebook]').forEach(a => a.setAttribute('href', cfg.facebook));
  document.querySelectorAll('[data-instagram]').forEach(a => a.setAttribute('href', cfg.instagram));
  document.querySelectorAll('[data-directions]').forEach(a => {
    a.setAttribute('href', cfg.mapsDirections);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('[data-call]').forEach(a => a.setAttribute('href', `tel:${tel}`));

  document.querySelectorAll('[data-whatsapp-link], .wa-float, .header-whatsapp').forEach(a => {
    a.setAttribute('href', wa);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
}

/* ---------- Google Map embed ---------- */
function initMap() {
  const src = window.WASHON.mapsEmbed;
  if (!src) return;
  document.querySelectorAll('.location-map').forEach(box => {
    box.innerHTML = `<iframe src="${src}" title="WashOn location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
  });
}

/* ---------- Graceful image fallback ---------- */
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
