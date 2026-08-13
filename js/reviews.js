/**
 * WASHON - REVIEWS MODULE & FRONTEND FORM
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('reviews-grid');
  const form = document.getElementById('review-form');

  if (container) {
    fetch('data/reviews.json')
      .then(res => res.json())
      .then(data => {
        container.innerHTML = data.map(r => `
          <div class="card">
            <div style="color:var(--accent-red); margin-bottom:10px;">${'★'.repeat(r.rating)}</div>
            <p style="font-style:italic; font-size:0.95rem; margin-bottom:15px;">"${r.review}"</p>
            <h4 style="font-size:1rem;">${r.name}</h4>
            <span style="color:var(--text-muted); font-size:0.8rem;">${r.vehicle} • ${r.service}</span>
          </div>
        `).join('');
      });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = document.getElementById('review-feedback');
      if (feedback) {
        feedback.style.display = 'block';
        feedback.innerText = 'Thank you for your feedback! Your review has been submitted for verification.';
        form.reset();
      }
    });
  }
});