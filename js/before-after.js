/* ==========================================================================
   WASHON — BEFORE-AFTER.JS
   Draggable vertical-line comparison slider. Works with mouse, touch and
   keyboard, and supports multiple instances per page (e.g. gallery page).
   Markup expected:
   <div class="ba-wrap" tabindex="0" role="slider" aria-label="Before and after">
     <div class="ba-layer ba-after"><div class="photo">...</div></div>
     <div class="ba-layer ba-before"><div class="photo">...</div></div>
     <span class="ba-tag before-tag">Before</span>
     <span class="ba-tag after-tag">After</span>
     <div class="ba-handle"><div class="ba-grip">...</div></div>
   </div>
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ba-wrap').forEach(initBeforeAfter);
});

function initBeforeAfter(wrap) {
  const before = wrap.querySelector('.ba-before');
  const handle = wrap.querySelector('.ba-handle');
  if (!before || !handle) return;

  let dragging = false;

  const setPosition = (pct) => {
    const clamped = Math.max(0, Math.min(100, pct));
    before.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    handle.style.left = clamped + '%';
    wrap.setAttribute('aria-valuenow', Math.round(clamped));
  };

  const pctFromEvent = (clientX) => {
    const rect = wrap.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  const start = () => { dragging = true; wrap.classList.add('dragging'); };
  const stop = () => { dragging = false; wrap.classList.remove('dragging'); };
  const move = (clientX) => { if (dragging) setPosition(pctFromEvent(clientX)); };

  // Mouse
  wrap.addEventListener('mousedown', (e) => { start(); setPosition(pctFromEvent(e.clientX)); });
  window.addEventListener('mousemove', (e) => move(e.clientX));
  window.addEventListener('mouseup', stop);

  // Touch
  wrap.addEventListener('touchstart', (e) => { start(); move(e.touches[0].clientX); }, { passive: true });
  wrap.addEventListener('touchmove', (e) => { move(e.touches[0].clientX); }, { passive: true });
  wrap.addEventListener('touchend', stop);

  // Click-to-set
  wrap.addEventListener('click', (e) => { if (!dragging) setPosition(pctFromEvent(e.clientX)); });

  // Keyboard
  wrap.setAttribute('role', wrap.getAttribute('role') || 'slider');
  wrap.setAttribute('aria-valuemin', '0');
  wrap.setAttribute('aria-valuemax', '100');
  wrap.addEventListener('keydown', (e) => {
    const current = parseFloat(wrap.getAttribute('aria-valuenow') || '50');
    if (e.key === 'ArrowLeft') { setPosition(current - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPosition(current + 5); e.preventDefault(); }
  });

  setPosition(50);
}
