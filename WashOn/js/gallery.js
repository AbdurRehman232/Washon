/**
 * WASHON - GALLERY & LIGHTBOX MODULE
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('gallery-grid');
  if (!container) return;

  fetch('data/gallery.json')
    .then(res => res.json())
    .then(data => {
      container.innerHTML = data.map(item => `
        <div class="card gallery-item" data-src="${item.image}" style="cursor:pointer;">
          <div class="card-img-wrapper" style="height:280px;">
            <img src="${item.image}" alt="${item.title}" loading="lazy" onError="this.src='https://via.placeholder.com/400x300/171717/FFFFFF?text=WashOn+Gallery'">
          </div>
          <h4 style="font-size:1rem;">${item.title}</h4>
          <span style="color:var(--text-muted); font-size:0.8rem;">${item.vehicle}</span>
        </div>
      `).join('');

      initLightbox();
    });
});

function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  if (!lightbox) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      lightboxImg.setAttribute('src', src);
      lightbox.style.display = 'flex';
    });
  });

  closeBtn?.addEventListener('click', () => { lightbox.style.display = 'none'; });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });
}