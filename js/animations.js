document.addEventListener("DOMContentLoaded", () => {
  // Check if GSAP library is available
  if (typeof gsap !== "undefined") {
    
    // Animate Hero Section
    gsap.from(".hero-subtitle", { opacity: 0, y: -20, duration: 0.8, delay: 0.2 });
    gsap.from(".hero-title", { opacity: 0, y: 30, duration: 1, delay: 0.4 });
    gsap.from(".hero-desc", { opacity: 0, y: 20, duration: 0.8, delay: 0.7 });
    gsap.from(".hero-actions", { opacity: 0, y: 20, duration: 0.8, delay: 0.9 });

    // Animate Cards on Scroll / Load
    gsap.from(".fade-in-up", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.2,
      delay: 0.5
    });

  } else {
    // Fallback: If GSAP fails to load, make everything visible immediately
    document.querySelectorAll(".fade-in-up, .hero-subtitle, .hero-title, .hero-desc, .hero-actions").forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }
});