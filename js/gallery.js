/* ==========================================================================
   WASHON — GALLERY.JS
   Loads data/gallery.json, renders a filterable grid, and powers a
   fullscreen lightbox with keyboard + prev/next navigation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  loadGallery(grid);
});

let galleryItems = [];
let galleryFiltered = [];
let lightboxIndex = 0;

async function loadGallery(grid) {
  try {
    const res = await fetch('data/gallery.json');
    galleryItems = await res.json();
  } catch (err) {
    grid.innerHTML = `<p style="color:#888">Gallery data could not be loaded.</p>`;
    return;
  }
  galleryFiltered = galleryItems;
  renderGallery(grid, galleryFiltered);
  initGalleryFilters(grid);
  initLightbox();
}

function renderGallery(grid, items) {
  grid.innerHTML = items.map((item, i) => `
    <button class="g-item hud" data-index="${i}" data-reveal="up" aria-label="View ${escapeHtml(item.title)}">
      <div class="photo" data-label="${escapeHtml(item.title)}">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">
      </div>
      <span class="g-item-cat">${escapeHtml(item.category)}</span>
    </button>
  `).join('');

  // re-observe new reveal elements
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    grid.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }

  grid.querySelectorAll('.g-item').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(parseInt(btn.dataset.index, 10)));
  });
}

function initGalleryFilters(grid) {
  const filterBar = document.getElementById('gallery-filters');
  if (!filterBar) return;
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filterBar.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const val = btn.dataset.filter;
    galleryFiltered = val === 'all' ? galleryItems : galleryItems.filter(i => i.category === val);
    renderGallery(grid, galleryFiltered);
  });
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click', () => stepLightbox(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => stepLightbox(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  window.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  renderLightbox();
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  document.body.classList.add('menu-open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.classList.remove('menu-open');
}

function stepLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + galleryFiltered.length) % galleryFiltered.length;
  renderLightbox();
}

function renderLightbox() {
  const item = galleryFiltered[lightboxIndex];
  if (!item) return;
  const lb = document.getElementById('lightbox');
  lb.querySelector('.lb-img').src = item.image;
  lb.querySelector('.lb-img').alt = item.title;
  lb.querySelector('.lb-title').textContent = item.title;
  lb.querySelector('.lb-count').textContent = `${lightboxIndex + 1} / ${galleryFiltered.length}`;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
