/**
 * WASHON - DRAGGABLE BEFORE & AFTER SLIDER
 */
function initBeforeAfter() {
  const container = document.querySelector('.ba-container');
  if (!container) return;

  const overlay = container.querySelector('.ba-overlay');
  const handle = container.querySelector('.ba-handle');
  let isDragging = false;

  const setPosition = (x) => {
    const rect = container.getBoundingClientRect();
    let position = x - rect.left;
    if (position < 0) position = 0;
    if (position > rect.width) position = rect.width;
    
    const percentage = (position / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  const startDrag = () => { isDragging = true; };
  const stopDrag = () => { isDragging = false; };

  handle.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setPosition(e.clientX);
  });

  // Touch Support
  handle.addEventListener('touchstart', startDrag);
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setPosition(e.touches[0].clientX);
  });
}

document.addEventListener('DOMContentLoaded', initBeforeAfter);