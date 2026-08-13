/**
 * WASHON - PRODUCTS DYNAMIC LOADER & FILTER
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('products-grid');
  const filterBtns = document.querySelectorAll('.product-filter-btn');

  if (!container) return;

  fetch('data/products.json')
    .then(res => res.json())
    .then(data => {
      renderProducts(data, container);

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.category;
          const filtered = cat === 'ALL' ? data : data.filter(p => p.category.toUpperCase() === cat);
          renderProducts(filtered, container);
        });
      });
    })
    .catch(err => console.error('Error loading products:', err));
});

function renderProducts(items, target) {
  target.innerHTML = items.map(p => `
    <div class="card fade-in-up appeared">
      <div class="card-img-wrapper">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onError="this.src='https://via.placeholder.com/400x300/171717/FFFFFF?text=WashOn+Product'">
      </div>
      <span class="section-subtitle">${p.category}</span>
      <h3 style="font-size:1.2rem; margin: 10px 0;">${p.name}</h3>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:15px;">${p.description}</p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:bold; color:var(--accent-red);">${p.price}</span>
        <a href="contact.html" class="btn btn-outline" style="padding:8px 16px; font-size:0.75rem;">Inquire</a>
      </div>
    </div>
  `).join('');
}