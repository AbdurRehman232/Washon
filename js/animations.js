/* ==========================================================================
   WASHON — ANIMATIONS.JS
   Scroll-triggered reveals (fade-up / left / right / zoom, staggered),
   animated stat counters, HUD corner-bracket triggers.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initReveal(reduceMotion);
  initCounters(reduceMotion);
  initHudTriggers(reduceMotion);
});

function initReveal(reduceMotion) {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (reduceMotion) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  // Stagger children inside a common container
  document.querySelectorAll('[data-stagger]').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.classList.add('stagger');
      child.style.setProperty('--d', `${i * 90}ms`);
      if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', 'up');
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => io.observe(el));
}

function initCounters(reduceMotion) {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

function initHudTriggers(reduceMotion) {
  const items = document.querySelectorAll('.hud[data-reveal]');
  if (!items.length || reduceMotion) return;
  items.forEach(el => {
    el.addEventListener('transitionend', () => {
      if (el.classList.contains('in-view')) el.classList.add('hud-ready');
    });
  });
}
