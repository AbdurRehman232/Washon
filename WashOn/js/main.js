/**
 * WASHON - MAIN CLIENT CONTROLLER
 */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeader();
  initMobileMenu();
  initScrollProgress();
  setActiveNavLink();
  initIntersectionObserver();
});

// Hide Preloader Fast
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 300);
    });
  }
}

// Sticky Header Transition
function initHeader() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

// Mobile Hamburger Navigation
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    nav?.classList.toggle('active');
    const isOpen = nav?.classList.contains('active');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

// Reading / Scroll Progress Bar
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    if (bar) bar.style.width = `${progress}%`;
  });
}

// Auto-Detect Current Page Links
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Reveal Elements on Scroll
function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appeared');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}