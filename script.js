'use strict';

/* ══════════════════════════════
   ELEMENT REFS
══════════════════════════════ */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const mobileOverlay= document.getElementById('mobileOverlay');
const mobClose     = document.getElementById('mobClose');
const scrollBar    = document.getElementById('scrollProgress');
const backTop      = document.getElementById('backTop');
const themeToggle  = document.getElementById('themeToggle');
const themeIcon    = document.getElementById('themeIcon');
const cursorGlow   = document.getElementById('cursorGlow');
const servicesDrop = document.getElementById('servicesDrop');
const servicesBtn  = document.getElementById('servicesBtn');
const mobServicesBtn = document.getElementById('mobServicesBtn');
const mobAccordBody  = document.getElementById('mobAccordBody');
const navLinks     = document.querySelectorAll('.nav-link[href]');
const sections     = document.querySelectorAll('section[id]');

/* ══════════════════════════════
   MOBILE MENU — OPEN / CLOSE
══════════════════════════════ */
function openMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

mobClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);

/* Close on Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
    closeDrop();
  }
});

/* Close menu when a mobile link is clicked */
document.querySelectorAll('.mob-link:not(.mob-accord-btn), .mob-sub-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ══════════════════════════════
   MOBILE ACCORDION (Services)
══════════════════════════════ */
mobServicesBtn.addEventListener('click', () => {
  const isOpen = mobAccordBody.classList.contains('open');
  mobAccordBody.classList.toggle('open');
  mobServicesBtn.setAttribute('aria-expanded', String(!isOpen));
});

/* ══════════════════════════════
   DESKTOP DROPDOWN (Services)
══════════════════════════════ */
function openDrop() {
  servicesDrop.classList.add('open');
  servicesBtn.setAttribute('aria-expanded', 'true');
}

function closeDrop() {
  servicesDrop.classList.remove('open');
  servicesBtn.setAttribute('aria-expanded', 'false');
}

// Toggle on button click
servicesBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  servicesDrop.classList.contains('open') ? closeDrop() : openDrop();
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (!servicesDrop.contains(e.target)) closeDrop();
});

// Keep open on hover for pointer devices
servicesDrop.addEventListener('mouseenter', openDrop);
servicesDrop.addEventListener('mouseleave', closeDrop);

/* ══════════════════════════════
   SCROLL EFFECTS
══════════════════════════════ */
function onScroll() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  /* Progress bar */
  scrollBar.style.width = scrollPct + '%';

  /* Sticky shrink */
  navbar.classList.toggle('scrolled', scrollTop > 20);

  /* Back-to-top button */
  backTop.classList.toggle('visible', scrollTop > 400);

  /* Active nav link based on section in view */
  updateActiveLink();
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ══════════════════════════════
   ACTIVE LINK ON SCROLL
══════════════════════════════ */
function updateActiveLink() {
  let currentId = '';
  const offset = 100;

  sections.forEach(section => {
    const top = section.offsetTop - offset;
    if (window.scrollY >= top) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${currentId}`);
  });
}

/* ══════════════════════════════
   THEME TOGGLE (dark / light)
══════════════════════════════ */
const savedTheme = localStorage.getItem('ss-theme') || 'dark';
if (savedTheme === 'light') applyLight();

function applyLight() {
  document.body.classList.add('light');
  themeIcon.textContent = '☀️';
}

function applyDark() {
  document.body.classList.remove('light');
  themeIcon.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light');
  if (isLight) {
    applyDark();
    localStorage.setItem('ss-theme', 'dark');
  } else {
    applyLight();
    localStorage.setItem('ss-theme', 'light');
  }
});

/* ══════════════════════════════
   BACK TO TOP BUTTON
══════════════════════════════ */
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════
   CURSOR GLOW (desktop only)
══════════════════════════════ */
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.opacity = '1';
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });
}

/* ══════════════════════════════
   SMOOTH SECTION TRANSITIONS
   (IntersectionObserver fade-in)
══════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.content-section, .card').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});
