/* ==========================================================================
   WASHON — REVIEWS.JS
   Loads data/reviews.json and renders review cards (homepage preview and
   the full reviews page). Also wires up the review submission form.

   GOOGLE SHEET STORAGE: if window.WASHON.reviewsSheetUrl is set (a Google
   Apps Script Web App URL), each new submission is also sent there so it
   lands as a new row in a Google Sheet. See GOOGLE_SHEET_SETUP.md for the
   one-time setup. Until that URL is added, submissions only display in the
   current browser session and are not saved permanently anywhere.
   ========================================================================== */

let allReviews = [];

document.addEventListener('DOMContentLoaded', async () => {
  const preview = document.querySelector('[data-reviews-preview]');
  const full = document.getElementById('reviews-grid');
  if (!preview && !full) return;

  try {
    const res = await fetch('data/reviews.json');
    allReviews = await res.json();
  } catch (err) {
    if (full) full.innerHTML = `<p style="color:#888">Reviews could not be loaded.</p>`;
    return;
  }

  if (preview) renderReviews(preview, allReviews.slice(0, 3));
  if (full) renderReviews(full, allReviews);

  initReviewForm(full);
});

function renderReviews(container, items) {
  container.innerHTML = items.map(r => `
    <article class="review-card" data-reveal="up">
      <div class="stars" aria-label="${r.rating} out of 5 stars">${starSvgs(r.rating)}</div>
      <p class="rv-text">${escapeHtml(r.review)}</p>
      <div class="rv-who">
        <div class="rv-name">${escapeHtml(r.name)}</div>
        <div class="rv-meta">${escapeHtml(r.vehicle)} &middot; ${escapeHtml(r.service)}${r.date ? ' &middot; ' + escapeHtml(r.date) : ''}</div>
      </div>
    </article>
  `).join('');

  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    container.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }
}

function starSvgs(rating) {
  let out = '';
  for (let i = 0; i < 5; i++) {
    out += `<svg viewBox="0 0 20 20" style="${i >= rating ? 'opacity:.25' : ''}"><path d="M10 1l2.6 5.8 6.4.6-4.8 4.2 1.4 6.3L10 14.9 4.4 17.9l1.4-6.3L1 7.4l6.4-.6z"/></svg>`;
  }
  return out;
}

function initReviewForm(full) {
  const form = document.getElementById('review-form');
  const successMsg = document.getElementById('review-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const newReview = {
      name: data.get('name') || 'Anonymous',
      vehicle: data.get('vehicle') || '',
      service: data.get('service') || '',
      rating: parseInt(data.get('rating'), 10) || 5,
      review: data.get('review') || '',
      date: 'Just now'
    };

    sendReviewToSheet(newReview);

    if (full) {
      allReviews.unshift(newReview);
      renderReviews(full, allReviews);
    }

    form.reset();
    form.hidden = true;
    if (successMsg) successMsg.hidden = false;
  });
}

/* ---------- Send a copy of the review to a Google Sheet ----------
   Requires window.WASHON.reviewsSheetUrl to be set to a deployed Google
   Apps Script Web App URL. See GOOGLE_SHEET_SETUP.md for setup. Uses
   mode: 'no-cors' because Apps Script Web Apps don't return CORS headers
   for simple deployments — the request still goes through and the row
   still gets appended, we just can't read the response back. */
function sendReviewToSheet(reviewData) {
  const url = window.WASHON && window.WASHON.reviewsSheetUrl;
  if (!url) return; // not configured yet — see GOOGLE_SHEET_SETUP.md
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(reviewData)
  }).catch(() => {
    // Silently ignore network errors — the review still shows locally.
  });
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
