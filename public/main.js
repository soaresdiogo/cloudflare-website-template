// Marks the page as JavaScript-enabled so scroll reveals never hide content without JS.
document.documentElement.classList.add("js");

const SCROLLED_OFFSET_PX = 8;
const MAX_CARD_TILT_DEGREES = 8;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setUpMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  const setOpen = (isOpen) => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    nav.classList.toggle("is-open", isOpen);
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
}

function setUpHeaderBorder() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > SCROLLED_OFFSET_PX);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setUpScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
}

function setUpCardTilt() {
  if (prefersReducedMotion || !window.matchMedia("(hover: hover)").matches) return;

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-y", `${horizontal * MAX_CARD_TILT_DEGREES * 2}deg`);
      card.style.setProperty("--tilt-x", `${-vertical * MAX_CARD_TILT_DEGREES * 2}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

// Progressive enhancement: the page is complete without this module.
async function setUpMotion() {
  if (prefersReducedMotion) return;

  try {
    const { startMotion } = await import("/js/motion.js");
    startMotion();
  } catch (error) {
    console.warn("Motion layer unavailable, showing the static page.", error);
  }
}

function showCurrentYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setUpMobileMenu();
  setUpHeaderBorder();
  setUpScrollReveal();
  setUpCardTilt();
  setUpMotion();
  showCurrentYear();
});
