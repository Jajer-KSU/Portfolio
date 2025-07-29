// shrink nav bar on scroll //
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNavbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shrink');
    } else {
        navbar.classList.remove('shrink');
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


