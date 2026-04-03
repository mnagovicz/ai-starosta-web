// Apple-style IntersectionObserver with staggered animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Staggered animation for cards/steps within same parent
      const parent = entry.target.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (el) => el.classList.contains('fade-up')
        );
        const index = siblings.indexOf(entry.target);
        if (index > 0 && (parent.classList.contains('grid-3') || parent.classList.contains('grid-2') || parent.classList.contains('steps'))) {
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
      }
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach((el) => {
  observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Parallax effect on hero blob
const blob = document.querySelector('.hero-blob');
if (blob) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    blob.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
  }, { passive: true });
}

// Contact form submission
const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.hidden = true;
  success.hidden = false;
});
