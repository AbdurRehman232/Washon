/* ==========================================================================
   WASHON — PRODUCTS.JS
   Loads data/products.json, renders the catalog grid, and supports
   category filtering, text search, and a product detail modal.
   Also powers the "featured products" preview on the homepage via
   [data-products-preview].
   ========================================================================== */

let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('products-grid');
  const preview = document.querySelector('[data-products-preview]');
  if (!grid && !preview) return;

  try {
    const res = await fetch('data/products.json');
    allProducts = await res.json();
  } catch (err) {
    if (grid) grid.innerHTML = `<p style="color:#888">Product data could not be loaded.</p>`;
    return;
  }

  if (preview) renderProducts(preview, allProducts.slice(0, 4));

  if (grid) {
    renderProducts(grid, allProducts);
    initFilters(grid);
    initSearch(grid);
    initModal();
  }
});

function renderProducts(container, items) {
  if (!items.length) {
    container.innerHTML = `<p class="no-results">No products match your search.</p>`;
    return;
  }
  container.innerHTML = items.map(p => `
    <article class="product-card hud" data-reveal="up" data-id="${p.id}">
      <button class="pc-open" data-id="${p.id}" aria-label="View ${escapeHtml(p.name)}">
        <div class="photo pc-photo" data-label="${escapeHtml(p.category)}">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
        </div>
      </button>
      <div class="pc-body">
        <span class="pc-cat">${escapeHtml(p.category)}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <div class="pc-foot">
          <span class="pc-price">${escapeHtml(p.price)}</span>
          <button class="pc-view" data-id="${p.id}">View Product</button>
        </div>
      </div>
    </article>
  `).join('');

  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    container.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }

  container.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', () => openProductModal(parseInt(el.dataset.id, 10)));
  });
}

function initFilters(grid) {
  const bar = document.getElementById('product-filters');
  if (!bar) return;
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    bar.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters(grid);
  });
}

function initSearch(grid) {
  const input = document.getElementById('product-search');
  if (!input) return;
  input.addEventListener('input', () => applyFilters(grid));
}

function applyFilters(grid) {
  const activeBtn = document.querySelector('#product-filters [data-filter].active');
  const cat = activeBtn ? activeBtn.dataset.filter : 'all';
  const query = (document.getElementById('product-search')?.value || '').trim().toLowerCase();

  let items = allProducts;
  if (cat !== 'all') items = items.filter(p => p.category === cat);
  if (query) items = items.filter(p =>
    p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
  );
  renderProducts(grid, items);
}

/* ---------- Product modal ---------- */
function initModal() {
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  modal.querySelector('.pm-close').addEventListener('click', closeProductModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeProductModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProductModal(); });
}

function openProductModal(id) {
  const modal = document.getElementById('product-modal');
  const p = allProducts.find(x => x.id === id);
  if (!modal || !p) return;
  modal.querySelector('.pm-cat').textContent = p.category;
  modal.querySelector('.pm-name').textContent = p.name;
  modal.querySelector('.pm-desc').textContent = p.description;
  modal.querySelector('.pm-price').textContent = p.price;
  const img = modal.querySelector('.pm-photo img');
  img.src = p.image;
  img.alt = p.name;
  modal.querySelector('.pm-photo').dataset.label = p.category;
  modal.classList.add('open');
  document.body.classList.add('menu-open');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('open');
  document.body.classList.remove('menu-open');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
