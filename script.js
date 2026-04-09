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

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Odesílám…';

  const data = {
    name: form.querySelector('[name="name"]')?.value.trim() || '',
    obec: form.querySelector('[name="city"]')?.value.trim() || '',
    email: form.querySelector('[name="email"]')?.value.trim() || '',
    telefon: form.querySelector('[name="phone"]')?.value.trim() || '',
  };

  if (!data.name || !data.obec || !data.email || !data.telefon) {
    btn.disabled = false;
    btn.textContent = 'Požádat o demo';
    alert('Prosím vyplňte všechna pole formuláře.');
    return;
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      form.hidden = true;
      success.hidden = false;
    } else {
      btn.disabled = false;
      btn.textContent = 'Požádat o demo';
      alert('Nepodařilo se odeslat formulář. Zkuste to prosím znovu.');
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Požádat o demo';
    alert('Chyba připojení. Zkuste to prosím znovu.');
  }
});

// Photo slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-img');
const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

if (slides.length > 0) {
  setInterval(() => goToSlide(currentSlide + 1), 4000);
}

// ── MEDIA STACK — scroll-driven sticky cards ──
(function() {
  const cards = document.querySelectorAll('.media-card');
  if (!cards.length) return;

  // Prahové hodnoty scrollu pro každou kartu
  // Karta se "odhalí" když se její sticky kontejner dostane do viewportu
  const stickies = document.querySelectorAll('.media-card-sticky');

  function checkCards() {
    stickies.forEach((sticky, i) => {
      const rect = sticky.getBoundingClientRect();
      const card = sticky.querySelector('.media-card');
      if (!card) return;

      // Karta se zobrazí když sticky kontejner je viditelný
      if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        card.classList.add('is-visible');
      }
    });
  }

  window.addEventListener('scroll', checkCards, { passive: true });
  checkCards(); // Init check
})();

// FAQ accordion
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});
