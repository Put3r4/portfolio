/* ============================================================
   SAPUTRA BUDIMAN — PORTFOLIO JAVASCRIPT
   Vanilla JS — no dependencies
   ============================================================ */

'use strict';

// ─── DOM Refs ────────────────────────────────────────────────
const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('nav-toggle');
const navMobile  = document.getElementById('nav-mobile');
const backTop    = document.getElementById('back-top');
const avatarImg  = document.getElementById('avatar-img');
const avatarPH   = document.getElementById('avatar-placeholder');
const contactForm = document.getElementById('contact-form');

// ─── Avatar image fallback ───────────────────────────────────
if (avatarImg) {
  avatarImg.addEventListener('error', function () {
    this.style.display = 'none';
    if (avatarPH) avatarPH.style.display = 'flex';
  });

  // If the browser has already settled on error state (cached)
  if (avatarImg.complete && avatarImg.naturalWidth === 0) {
    avatarImg.dispatchEvent(new Event('error'));
  }
}

// ─── Navbar scroll state ─────────────────────────────────────
let lastScrollY = 0;

function onScroll() {
  const scrollY = window.scrollY;

  // Scrolled class for frosted glass effect
  if (scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back-to-top button visibility
  if (scrollY > 500) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }

  // Active nav link highlighting
  updateActiveNavLink();

  lastScrollY = scrollY;
}

// ─── Active section detection ────────────────────────────────
const SECTIONS = ['home', 'about', 'skills', 'experience', 'project', 'education', 'contact'];
const navLinkMap = {
  home:       document.getElementById('nav-home'),
  about:      document.getElementById('nav-about'),
  skills:     document.getElementById('nav-skills'),
  experience: document.getElementById('nav-experience'),
  project:    document.getElementById('nav-project'),
  education:  document.getElementById('nav-education'),
  contact:    document.getElementById('nav-contact'),
};

function updateActiveNavLink() {
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
  let activeId = 'home';

  for (const id of SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= navHeight + 32) {
      activeId = id;
    }
  }

  Object.entries(navLinkMap).forEach(([id, el]) => {
    if (!el) return;
    if (id === activeId) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

// ─── Mobile nav toggle ───────────────────────────────────────
function toggleMobileNav() {
  const isOpen = navMobile.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileNav() {
  navMobile.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (navToggle) {
  navToggle.addEventListener('click', toggleMobileNav);
}

// Close mobile nav when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// Close mobile nav on click outside
document.addEventListener('click', function (e) {
  if (
    navMobile.classList.contains('open') &&
    !navMobile.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    closeMobileNav();
  }
});

// ─── Back to top ─────────────────────────────────────────────
if (backTop) {
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Scroll-triggered reveal animation ───────────────────────
let revealObserver;

function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  };

  revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  }, options);

  targets.forEach(el => revealObserver.observe(el));
}

// ─── Contact form → mailto ────────────────────────────────────
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameEl    = document.getElementById('form-name');
    const emailEl   = document.getElementById('form-email');
    const messageEl = document.getElementById('form-message');

    const name    = nameEl?.value.trim()    || '';
    const email   = emailEl?.value.trim()   || '';
    const message = messageEl?.value.trim() || '';

    // Basic validation
    let valid = true;
    [nameEl, emailEl, messageEl].forEach(el => {
      if (!el) return;
      if (!el.value.trim()) {
        el.style.borderColor = '#f43f5e';
        valid = false;
      } else {
        el.style.borderColor = '';
      }
    });

    if (!valid) {
      showFormFeedback('Please fill in all fields.', false);
      return;
    }

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const mailto = `mailto:saputrabudiman77@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailto;

    showFormFeedback('Your email client has been opened. Thank you!', true);
    contactForm.reset();
  });

  // Re-validate on input
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function () {
      if (this.value.trim()) {
        this.style.borderColor = '';
      }
    });
  });
}

function showFormFeedback(msg, success) {
  let fb = document.getElementById('form-feedback');
  if (!fb) {
    fb = document.createElement('p');
    fb.id = 'form-feedback';
    fb.style.cssText = `
      margin-top: 12px;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: var(--font-sans);
    `;
    contactForm.appendChild(fb);
  }
  fb.textContent = msg;
  fb.style.background   = success ? 'rgba(20,184,166,0.12)' : 'rgba(244,63,94,0.1)';
  fb.style.border       = `1px solid ${success ? 'rgba(20,184,166,0.3)' : 'rgba(244,63,94,0.3)'}`;
  fb.style.color        = success ? '#14B8A6' : '#f43f5e';

  setTimeout(() => { if (fb) fb.textContent = ''; }, 6000);
}

// ─── Smooth scroll for same-page anchor links ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const navH = 68;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Skill tag hover ripple (micro-interaction) ───────────────
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-2px)';
  });
  tag.addEventListener('mouseleave', function () {
    this.style.transform = '';
  });
});

// ─── Number counter animation for stat boxes ──────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.stat-value.mono');
  const obsOptions = { threshold: 0.5 };

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const rawText = el.textContent.replace(/,/g, '');
      const target  = parseInt(rawText, 10);
      if (isNaN(target)) return;

      counterObserver.unobserve(el);
      let start     = 0;
      const duration = 1400;
      const step     = 16;
      const increment = target / (duration / step);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          el.textContent = formatNumber(target);
          clearInterval(timer);
        } else {
          el.textContent = formatNumber(Math.floor(start));
        }
      }, step);
    });
  }, obsOptions);

  counters.forEach(el => counterObserver.observe(el));
}

function formatNumber(n) {
  return n.toLocaleString('en-US');
}

// ─── Init ─────────────────────────────────────────────────────
function init() {
  onScroll(); // set initial state
  initReveal();
  animateCounters();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
