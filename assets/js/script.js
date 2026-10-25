'use strict';

/**
 * Add event listener on multiple elements
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};



/**
 * THEME TOGGLE
 * Saves choice in localStorage, applies before first paint (see inline script in <head>).
 */
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    if (next === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }

    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
  });
}



/**
 * NAVBAR TOGGLE FOR MOBILE
 */
const navbar = document.querySelector('[data-navbar]');
const navTogglers = document.querySelectorAll('[data-nav-toggler]');
const overlay = document.querySelector('[data-overlay]');

const toggleNavbar = function () {
  navbar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.classList.toggle('nav-active');
};

addEventOnElements(navTogglers, 'click', toggleNavbar);

// Close mobile nav when a link is clicked
const mobileNavLinks = navbar.querySelectorAll('.navbar-link');
mobileNavLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    if (navbar.classList.contains('active')) {
      toggleNavbar();
    }
  });
});



/**
 * HEADER
 * Sticky header when scrolled past 100px
 */
const header = document.querySelector('[data-header]');

window.addEventListener('scroll', function () {
  if (window.scrollY > 100) {
    header.classList.add('active');
  } else {
    header.classList.remove('active');
  }
});



/**
 * ACTIVE SECTION HIGHLIGHT IN NAVBAR
 */
const navLinks = document.querySelectorAll('[data-nav-link]');
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollY = window.scrollY + 120;

  sections.forEach(function (section) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavLink);
window.addEventListener('load', highlightNavLink);



/**
 * SCROLL REVEAL
 */
const revealElements = document.querySelectorAll('[data-reveal]');
const revealDelayElements = document.querySelectorAll('[data-reveal-delay]');

const reveal = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15) {
      revealElements[i].classList.add('revealed');
    }
  }
};

for (let i = 0, len = revealDelayElements.length; i < len; i++) {
  revealDelayElements[i].style.transitionDelay = revealDelayElements[i].dataset.revealDelay;
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);



/**
 * SMOOTH SCROLL FOR IN-PAGE ANCHORS
 * Ensures hash links like #featured, #about-sec work reliably across all environments (including preview iframes)
 */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = window.innerWidth >= 992 ? 90 : 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});