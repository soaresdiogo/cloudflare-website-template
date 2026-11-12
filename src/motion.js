// Source of public/js/motion.js. Run `npm run build:js` after editing it.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CURSOR_PARALLAX_PX = 36;
const BAG_TILT_DEGREES = 10;

function playIntro() {
  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".hero-copy > *", { y: 40, opacity: 0, duration: 0.9, stagger: 0.08 })
    .from(".hero-bag", { y: 120, opacity: 0, scale: 0.92, duration: 1.2 }, 0.2)
    .from(".hero-beans-left", { x: -140, opacity: 0, duration: 1.4 }, 0.1)
    .from(".hero-beans-right", { x: 140, opacity: 0, duration: 1.4 }, 0.1)
    .from(".callout", { y: 30, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.7);
}

// Scroll scrubbing: the hero layers move at different speeds, which reads as depth.
function linkHeroToScroll() {
  const hero = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".bag-wrap", { y: -90, rotation: 4, scale: 1.05, ease: "none", scrollTrigger: hero });
  gsap.to(".hero-beans-left", { y: 160, x: -60, rotation: -8, ease: "none", scrollTrigger: hero });
  gsap.to(".hero-beans-right", { y: 220, x: 60, rotation: 8, ease: "none", scrollTrigger: hero });
  gsap.to(".hero-copy", { y: 80, opacity: 0.2, ease: "none", scrollTrigger: hero });

  gsap.fromTo("[data-parallax-media]", { yPercent: -8 }, {
    yPercent: 8,
    ease: "none",
    scrollTrigger: { trigger: ".process", start: "top bottom", end: "bottom top", scrub: true },
  });
}

function followCursor() {
  if (!window.matchMedia("(hover: hover)").matches) return;

  const layers = [...document.querySelectorAll("[data-depth]")].map((element) => ({
    depth: Number(element.dataset.depth),
    moveX: gsap.quickTo(element, "x", { duration: 1.2, ease: "power3" }),
    moveY: gsap.quickTo(element, "y", { duration: 1.2, ease: "power3" }),
  }));

  const bag = document.querySelector(".hero-bag");
  gsap.set(bag, { transformPerspective: 900 });
  const tiltX = gsap.quickTo(bag, "rotationX", { duration: 0.8, ease: "power3" });
  const tiltY = gsap.quickTo(bag, "rotationY", { duration: 0.8, ease: "power3" });

  window.addEventListener("pointermove", (event) => {
    const horizontal = event.clientX / window.innerWidth - 0.5;
    const vertical = event.clientY / window.innerHeight - 0.5;
    layers.forEach(({ depth, moveX, moveY }) => {
      moveX(-horizontal * 2 * CURSOR_PARALLAX_PX * depth);
      moveY(-vertical * 2 * CURSOR_PARALLAX_PX * depth);
    });
    tiltY(horizontal * BAG_TILT_DEGREES * 2);
    tiltX(-vertical * BAG_TILT_DEGREES);
  }, { passive: true });
}

const RITUAL_VIDEO_SOURCE = "/video/chemex-brew.mp4";
const RITUAL_SCROLL_LENGTH = "+=250%";
// Where each brewing step starts in the clip, as a share of its length.
const RITUAL_STEP_STARTS = [0, 0.21, 0.63];

function activeStepIndex(progress) {
  return RITUAL_STEP_STARTS.findLastIndex((start) => progress >= start);
}

// Seeking needs HTTP range requests, which not every server answers.
// A blob URL keeps the whole clip in memory, so any frame is one seek away.
async function loadRitualVideo(video) {
  try {
    const response = await fetch(RITUAL_VIDEO_SOURCE);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    video.addEventListener("loadeddata", () => video.classList.add("is-ready"), { once: true });
    video.src = URL.createObjectURL(await response.blob());
    // iOS Safari only paints seeked frames after the video has started once.
    await video.play().then(() => video.pause()).catch(() => {});
  } catch (error) {
    console.warn("Brew clip unavailable, showing the still image.", error);
  }
}

// The clip never plays on its own: the scroll position sets currentTime,
// so scrolling back rewinds the shot.
function scrubRitualVideo() {
  const section = document.querySelector("[data-ritual]");
  if (!section) return;

  const video = section.querySelector("[data-ritual-video]");
  const steps = [...section.querySelectorAll("[data-ritual-step]")];
  const showStep = (index) => steps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === index));

  section.classList.add("is-scrubbing");
  showStep(0);

  // Download the clip only when the visitor gets close to the section.
  ScrollTrigger.create({
    trigger: section,
    start: "top 200%",
    once: true,
    onEnter: () => loadRitualVideo(video),
  });

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: RITUAL_SCROLL_LENGTH,
    pin: true,
    scrub: true,
    onUpdate: ({ progress }) => {
      showStep(activeStepIndex(progress));
      if (Number.isFinite(video.duration)) video.currentTime = progress * (video.duration - 0.05);
    },
  });
}

export function startMotion() {
  gsap.registerPlugin(ScrollTrigger);
  playIntro();
  linkHeroToScroll();
  followCursor();
  scrubRitualVideo();
}
