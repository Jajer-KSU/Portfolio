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
// make menu cover entire screen
const menuBtn = document.getElementById('menu-btn');
const menu = document.querySelector('.menu-links');
const navLinks = document.querySelectorAll('.nav-links-left, .nav-links-right');

let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menu.classList.remove('inactive');
  menu.classList.toggle('active');
  menuOpen = menu.classList.contains('active');
});

// close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (menuOpen) {
      menu.classList.remove('active');
      menu.classList.add('inactive');
      menuOpen = false;
    }
  });
});

/* close on scroll
window.addEventListener('scroll', () => {
  if (menuOpen) {
    menu.classList.remove('active');
    menu.classList.add('inactive');
    menuOpen = false;
  }
});
*/

// carousel
document.addEventListener('DOMContentLoaded', () => {
  const track     = document.getElementById('carousel-track');
  const container = track.closest('.carousel-container');
  const prevBtn   = document.getElementById('prev-btn');
  const nextBtn   = document.getElementById('next-btn');
  const dotsWrap  = document.getElementById('carousel-dots');
  const mqMobile  = window.matchMedia('(max-width: 600px)');

  let slides = [];
  let index  = 0;
  let slideW = 0;
  let dragging = false, startX = 0, dx = 0;

  function collectSlides() {
    slides = Array.from(track.querySelectorAll(
      mqMobile.matches ? '.project-link' : '.carousel-slide'
    ));
  }

  // NEW: always measure the real width of one slide
  function getSlideWidth() {
    const el = slides[0];
    return el ? Math.round(el.getBoundingClientRect().width) : 0;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });
    updateDots();
  }

  function updateDots() {
    Array.from(dotsWrap.children).forEach((d, i) =>
      d.classList.toggle('active', i === index)
    );
  }

  function updateArrows() {
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
  }

  function goTo(i, animate = true) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    track.style.transition = animate ? 'transform .45s ease' : 'none';
    track.style.transform  = `translateX(${-index * slideW}px)`;
    updateDots();
    updateArrows();
  }

  function setSizes() {
    collectSlides();
    slideW = getSlideWidth();              // <-- replaced
    goTo(index, false);
    buildDots();
    updateArrows();
  }

  // Buttons
  prevBtn.addEventListener('click', () => goTo(index - 1, true));
  nextBtn.addEventListener('click', () => goTo(index + 1, true));

  // Swipe
  track.addEventListener('pointerdown', (e) => {
    dragging = true; startX = e.clientX; dx = 0;
    track.setPointerCapture(e.pointerId);
    track.style.transition = 'none';
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    track.style.transform = `translateX(${(-index * slideW) + dx}px)`;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    const threshold = Math.min(80, slideW * 0.15);
    if (dx >  threshold && index > 0) index--;
    if (dx < -threshold && index < slides.length - 1) index++;
    goTo(index, true);
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // Recalc on resize & when breakpoint flips
  window.addEventListener('resize', () => { slideW = getSlideWidth(); goTo(index, false); });
  mqMobile.addEventListener('change', () => { index = 0; setSizes(); });

  setSizes();
});


function measureRightTxt() {
  document.querySelectorAll('.nav-links-right .right-txt').forEach(span => {
    // temporarily reveal to measure true width without affecting layout
    const prev = { maxWidth: span.style.maxWidth, opacity: span.style.opacity };
    span.style.maxWidth = 'none';
    span.style.opacity = '1';
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';

    const w = span.scrollWidth;                // natural width in px

    // restore then set CSS variable on the parent link
    span.style.maxWidth = prev.maxWidth; 
    span.style.opacity = prev.opacity;
    span.style.position = '';
    span.style.visibility = '';

    span.parentElement.style.setProperty('--w', w + 'px');
  });
}

  // run on load and when fonts/zoom/layout change
  window.addEventListener('load', measureRightTxt);
  window.addEventListener('resize', measureRightTxt);






