// global page load animation //
window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});

// shrink nav bar on scroll //
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.innerWidth > 600) {
    if (window.scrollY > 50) navbar.classList.add("shrink");
    else navbar.classList.remove("shrink");
  } else {
    navbar.classList.remove("shrink");
  }
});

// load coursework cards animation
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll(".project").forEach(el => observer.observe(el));
});

// menu animations
const menuBtn = document.getElementById("menu-btn");
const menu = document.querySelector(".menu-links");
const navLinks = document.querySelectorAll(".nav-links-left, .nav-links-right");
let menuOpen = false;

menuBtn?.addEventListener("click", () => {
  menu.classList.remove("inactive");
  menu.classList.toggle("active");
  menuOpen = menu.classList.contains("active");
});
navLinks.forEach(link =>
  link.addEventListener("click", () => {
    if (menuOpen) {
      menu.classList.remove("active");
      menu.classList.add("inactive");
      menuOpen = false;
    }
  })
);

// =====================
//      CAROUSEL
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const track     = document.getElementById("carousel-track");
  if (!track) return; // nothing to do

  const container = track.closest(".carousel-container");
  const prevBtn   = document.getElementById("prev-btn");
  const nextBtn   = document.getElementById("next-btn");
  const dotsWrap  = document.getElementById("carousel-dots");

  // input / breakpoints
  const mqMobile  = window.matchMedia("(max-width: 600px)");
  const mqCoarse  = window.matchMedia("(pointer: coarse)");
  const swipeAllowed = () => mqMobile.matches || mqCoarse.matches;

  let slides = [];
  let index  = 0;
  let slideW = 0;

  function collectSlides() {
    slides = Array.from(
      track.querySelectorAll(mqMobile.matches ? ".project-link" : ".carousel-slide")
    );
  }
  function getSlideWidth() {
    const el = slides[0];
    return el ? Math.round(el.getBoundingClientRect().width) : 0;
  }
  function buildDots() {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });
    updateDots();
  }
  function updateDots() {
    Array.from(dotsWrap.children).forEach((d, i) =>
      d.classList.toggle("active", i === index)
    );
  }
  function updateArrows() {
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
  }
  function goTo(i, animate = true) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    track.style.transition = animate ? "transform .45s ease" : "none";
    track.style.transform  = `translateX(${-index * slideW}px)`;
    updateDots();
    updateArrows();
  }
  function setSizes() {
    collectSlides();
    slideW = getSlideWidth();
    goTo(index, false);
    buildDots();
    updateArrows();
  }

  // Buttons (work everywhere)
  prevBtn?.addEventListener("click", () => goTo(index - 1, true));
  nextBtn?.addEventListener("click", () => goTo(index + 1, true));

  // ----- Swipe (touch only) -----
  let dragging = false, startX = 0, dx = 0, didDrag = false;
  let swipeAttached = false;

  function onPointerDown(e) {
    if (!swipeAllowed() || e.pointerType === "mouse") return; // no desktop mouse drags
    dragging = true;
    didDrag  = false;
    startX   = e.clientX;
    dx       = 0;
    track.setPointerCapture(e.pointerId);
    track.style.transition = "none";
  }
  function onPointerMove(e) {
    if (!dragging) return;
    dx = e.clientX - startX;
    if (Math.abs(dx) > 3) didDrag = true;
    track.style.transform = `translateX(${(-index * slideW) + dx}px)`;
  }
  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    const threshold = Math.min(80, slideW * 0.15);
    if (dx >  threshold && index > 0) index--;
    if (dx < -threshold && index < slides.length - 1) index++;
    goTo(index, true);
  }
  // Cancel link clicks only if it was a drag
  function onClickCapture(e) {
    if (didDrag) { e.preventDefault(); e.stopPropagation(); }
  }

  function attachSwipe() {
    if (swipeAttached) return;
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("click", onClickCapture, true);
    track.style.cursor = "grab";
    swipeAttached = true;
  }
  function detachSwipe() {
    if (!swipeAttached) return;
    track.removeEventListener("pointerdown", onPointerDown);
    track.removeEventListener("pointermove", onPointerMove);
    track.removeEventListener("pointerup", onPointerUp);
    track.removeEventListener("pointercancel", onPointerUp);
    track.removeEventListener("click", onClickCapture, true);
    track.style.cursor = "auto";
    swipeAttached = false;
  }
  function updateSwipeBinding() {
    if (swipeAllowed()) attachSwipe();
    else detachSwipe();
  }

  // init
  setSizes();
  updateSwipeBinding();

  // keep in sync on changes
  window.addEventListener("resize", () => {
    slideW = getSlideWidth();
    goTo(index, false);
    updateSwipeBinding();
  });
  mqMobile.addEventListener("change", () => { index = 0; setSizes(); updateSwipeBinding(); });
  mqCoarse.addEventListener("change", updateSwipeBinding);
});

// measure nav right text widths for L→R grow
function measureRightTxt() {
  document.querySelectorAll(".nav-links-right .right-txt").forEach(span => {
    const prev = { maxWidth: span.style.maxWidth, opacity: span.style.opacity };
    span.style.maxWidth = "none";
    span.style.opacity  = "1";
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    const w = span.scrollWidth;
    span.style.maxWidth  = prev.maxWidth;
    span.style.opacity   = prev.opacity;
    span.style.position  = "";
    span.style.visibility = "";
    span.parentElement.style.setProperty("--w", w + "px");
  });
}
window.addEventListener("load", measureRightTxt);
window.addEventListener("resize", measureRightTxt);




