// global page load animation //
window.addEventListener("load", function () {
  document.body.classList.add("page-loaded");
});

// shrink nav bar on scroll //
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");

  // only shrink screens wider than 600px
  if (window.innerWidth > 600) {
    if (window.scrollY > 50) {
      navbar.classList.add("shrink");
    } else {
      navbar.classList.remove("shrink");
    }
  } else {
    navbar.classList.remove("shrink");
  }
});

// load coursework
document.addEventListener("DOMContentLoaded", function () {
const observer = new IntersectionObserver(
    (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target); // run only once
        }});
    },
    { threshold: 0.2 } // fire when 20% of element is in view
);

document.querySelectorAll(".project").forEach((el) => {
    observer.observe(el);
    });
});

// menu animations
// Toggle full screen menu
const menuBtn = document.getElementById('menu-btn');
const menu = document.querySelector('.menu-links');
const navLinks = document.querySelectorAll('.nav-links-left, .nav-links-right');

let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menu.classList.remove('inactive');
  menu.classList.toggle('active');
  menuOpen = menu.classList.contains('active');
});

// Close menu when link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (menuOpen) {
      menu.classList.remove('active');
      menu.classList.add('inactive');
      menuOpen = false;
    }
  });
});

// Optional: close on scroll
window.addEventListener('scroll', () => {
  if (menuOpen) {
    menu.classList.remove('active');
    menu.classList.add('inactive');
    menuOpen = false;
  }
});






