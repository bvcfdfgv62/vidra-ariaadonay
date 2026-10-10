const business = {
  instagramUrl: "https://www.instagram.com/vidracariaadonayof/",
  whatsappNumber: "5571986559552",
  whatsappDisplay: "71 98655-9552",
  whatsappMessage: "Olá! Conheci a Vidraçaria Adonay pelo site e gostaria de solicitar um orçamento.",
};

const header = document.querySelector("[data-header]");
const whatsappNumber = business.whatsappNumber.replace(/\D/g, "");
const whatsappLink = document.querySelector("[data-whatsapp-link]");
const contactLinks = document.querySelectorAll("[data-contact-link]");

document.querySelectorAll("[data-instagram-link]").forEach((link) => {
  link.href = business.instagramUrl;
});

if (whatsappNumber) {
  contactLinks.forEach((link) => {
    const service = link.dataset.service;
    const message = service
      ? `Olá! Conheci a Vidraçaria Adonay pelo site e gostaria de solicitar um orçamento para ${service}.`
      : business.whatsappMessage;
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(business.whatsappMessage)}`;
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
}

const whatsappDisplay = document.querySelector("[data-whatsapp-display]");
if (whatsappDisplay) whatsappDisplay.textContent = business.whatsappDisplay;

const mobileMenu = document.querySelector("[data-mobile-menu]");
mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { mobileMenu.open = false; }));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu) mobileMenu.open = false;
});
document.addEventListener("click", (event) => {
  if (mobileMenu?.open && !mobileMenu.contains(event.target)) mobileMenu.open = false;
});
window.addEventListener("resize", () => {
  if (!window.matchMedia("(max-width: 760px)").matches && mobileMenu) mobileMenu.open = false;
}, { passive: true });

const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
document.querySelector("[data-year]").textContent = new Date().getFullYear();

const root = document.documentElement;
const revealItems = [...document.querySelectorAll('[data-reveal], [data-stagger-title]:not([data-stagger-title="hero"])')];
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const desktopMotion = window.matchMedia("(min-width: 761px)");
const hero = document.querySelector("#inicio");
const gallery = document.querySelector("#galeria");
const heroImage = document.querySelector(".hero-image");
const heroImageStage = document.querySelector(".hero-image-stage");
const heroTitleLines = [...document.querySelectorAll('#hero-title .motion-line > span')];
const parallaxImages = [...document.querySelectorAll("[data-parallax]")].map((image) => ({
  image,
  intensity: Number(image.dataset.parallax) || 0,
}));

let revealObserver;
let contactObserver;
let motionStartFrame = 0;
let motionStartFrameTwo = 0;
let scrollFrame = 0;
let heroEntranceAnimations = [];

const startHeroEntrance = () => {
  if (
    motionPreference.matches ||
    root.classList.contains("hero-entrance-started") ||
    typeof Element.prototype.animate !== "function"
  ) return;

  root.classList.add("hero-entrance-started");
  const easing = "cubic-bezier(.22,.74,.25,1)";
  const addEntrance = (element, keyframes, duration, delay = 0, curve = easing) => {
    if (!element) return;
    heroEntranceAnimations.push(element.animate(keyframes, {
      duration,
      delay,
      easing: curve,
      fill: "both",
    }));
  };

  try {
    addEntrance(header, [
      { opacity: 0, transform: "translate3d(0, 12px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ], 620);

    addEntrance(document.querySelector(".hero-eyebrow"), [
      { opacity: 0, transform: "translate3d(0, 10px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ], 500, 120);

    heroTitleLines.forEach((line, index) => {
      addEntrance(line, [
        { opacity: 0, transform: "translate3d(0, 42px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ], 760, 180 + index * 90);
    });

    addEntrance(heroImageStage, [
      { clipPath: "inset(14% 37% 14% 37% round 50%)" },
      { clipPath: "inset(0% 0% 0% 0% round 0%)" },
    ], 1_250, 0, "cubic-bezier(.215,.61,.355,1)");
    addEntrance(heroImage, [
      { transform: "scale(1.035)" },
      { transform: "scale(1)" },
    ], 1_250, 0, "cubic-bezier(.215,.61,.355,1)");

    addEntrance(document.querySelector(".hero-description"), [
      { opacity: 0, transform: "translate3d(0, 12px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ], 560, 560);

    addEntrance(document.querySelector(".hero-actions"), [
      { opacity: 0, transform: "translate3d(0, 10px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ], 540, 1_120);

    addEntrance(document.querySelector(".hero-footnote"), [
      { opacity: 0, transform: "translate3d(0, 6px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ], 480, 1_300);
    [".image-index", ".hero-image-note", ".scroll-cue", ".hero-coordinate"].forEach((selector) => {
      addEntrance(document.querySelector(selector), [
        { opacity: 0 },
        { opacity: 1 },
      ], 480, 1_340);
    });
  } catch {
    heroEntranceAnimations.forEach((animation) => animation.cancel());
    heroEntranceAnimations = [];
  }
};

const glassIntro = document.querySelector("[data-glass-intro]");
const skipIntro = document.querySelector("[data-skip-intro]");
const introInertTargets = [header, document.querySelector("#conteudo"), document.querySelector(".site-footer")].filter(Boolean);
let introAnimations = [];
let introTimeout = 0;
let introFinished = false;

const finishGlassIntro = (cancelAnimations = false) => {
  if (introFinished || !glassIntro) return;
  introFinished = true;
  if (introTimeout) window.clearTimeout(introTimeout);
  introTimeout = 0;
  if (cancelAnimations) {
    [...introAnimations, ...heroEntranceAnimations].forEach((animation) => animation.cancel());
    heroEntranceAnimations = [];
  }
  introAnimations = [];
  glassIntro.hidden = true;
  skipIntro.hidden = true;
  skipIntro.blur();
  document.body.classList.remove("is-intro-playing");
  introInertTargets.forEach((element) => { element.inert = false; });
  document.removeEventListener("keydown", handleIntroKeydown);
};

const handleIntroKeydown = (event) => {
  if (event.key === "Escape") finishGlassIntro(true);
};
skipIntro?.addEventListener("click", () => finishGlassIntro(true));

const runGlassIntro = async () => {
  if (!glassIntro || !skipIntro || motionPreference.matches || location.hash || document.visibilityState !== "visible") {
    startHeroEntrance();
    return;
  }
  if (typeof Element.prototype.animate !== "function" || !heroImage.complete || heroImage.naturalWidth === 0) {
    startHeroEntrance();
    return;
  }

  const decodeStartedAt = performance.now();
  try {
    if (heroImage.decode) await heroImage.decode();
  } catch {
    startHeroEntrance();
    return;
  }
  if (performance.now() - decodeStartedAt > 450 || motionPreference.matches || !heroImage.naturalWidth) {
    startHeroEntrance();
    return;
  }

  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const easing = "cubic-bezier(.22,1,.36,1)";
  const panelDelay = isMobile ? 320 : 520;
  const panelDuration = isMobile ? 820 : 1_280;
  const lineDuration = isMobile ? 720 : 1_080;
  const shadeDelay = isMobile ? 920 : 1_420;
  const shadeDuration = isMobile ? 460 : 640;
  const leftFrames = isMobile
    ? [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(0,-102%,0)" }]
    : [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(-102%,0,0)" }];
  const rightFrames = isMobile
    ? [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(0,102%,0)" }]
    : [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(102%,0,0)" }];
  const lineFrames = isMobile
    ? [{ transform: "translate3d(0,-110vh,0)", opacity: 0 }, { transform: "translate3d(0,115vh,0)", opacity: 1 }]
    : [{ transform: "translate3d(-120vw,0,0)", opacity: 0 }, { transform: "translate3d(180vw,0,0)", opacity: 1 }];

  document.body.classList.add("is-intro-playing");
  glassIntro.hidden = false;
  skipIntro.hidden = false;
  introInertTargets.forEach((element) => { element.inert = true; });
  document.addEventListener("keydown", handleIntroKeydown);
  startHeroEntrance();

  const animate = (element, frames, duration, delay = 0) => {
    if (!element) return;
    introAnimations.push(element.animate(frames, { duration, delay, easing, fill: "both" }));
  };

  try {
    animate(glassIntro.querySelector(".glass-intro__surface--left"), leftFrames, panelDuration, panelDelay);
    animate(glassIntro.querySelector(".glass-intro__surface--right"), rightFrames, panelDuration, panelDelay);
    animate(glassIntro.querySelector(".glass-intro__light-line"), lineFrames, lineDuration, isMobile ? 0 : 80);
    animate(glassIntro.querySelector(".glass-intro__shade"), [{ opacity: .95 }, { opacity: 0 }], shadeDuration, shadeDelay);
    animate(glassIntro.querySelector(".glass-intro__photo"), [{ opacity: .46, transform: "scale(1.025)" }, { opacity: 0, transform: "scale(1)" }], shadeDuration, shadeDelay);
  } catch {
    finishGlassIntro(true);
    return;
  }

  const endAt = Math.max(panelDelay + panelDuration, shadeDelay + shadeDuration);
  introTimeout = window.setTimeout(() => finishGlassIntro(true), endAt + 500);
  Promise.all(introAnimations.map((animation) => animation.finished.catch(() => undefined)))
    .then(() => finishGlassIntro());
};

const clearScrollTransforms = () => {
  heroImageStage.style.removeProperty("--hero-scroll-scale");
  heroImageStage.style.removeProperty("--hero-scroll-y");
  parallaxImages.forEach(({ image }) => image.style.removeProperty("--parallax-y"));
};

const updateScrollMotion = () => {
  scrollFrame = 0;
  if (motionPreference.matches || !desktopMotion.matches) {
    clearScrollTransforms();
    return;
  }

  const heroRect = hero.getBoundingClientRect();
  const galleryRect = gallery.getBoundingClientRect();
  const distance = galleryRect.top - heroRect.top;
  const progress = distance > 0 ? Math.min(1, Math.max(0, -heroRect.top / distance)) : 0;
  const viewportCenter = window.innerHeight / 2;
  const parallaxValues = parallaxImages.map(({ image, intensity }) => {
    const rect = image.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const offset = Math.max(-12, Math.min(12, (viewportCenter - center) * intensity));
    return { image, offset };
  });

  heroImageStage.style.setProperty("--hero-scroll-scale", (1 + progress * 0.035).toFixed(4));
  heroImageStage.style.setProperty("--hero-scroll-y", `${(progress * 8).toFixed(2)}px`);
  parallaxValues.forEach(({ image, offset }) => {
    image.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
  });
};

const queueScrollMotion = () => {
  if (motionPreference.matches || !desktopMotion.matches) {
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    clearScrollTransforms();
    return;
  }
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollMotion);
};

const onScroll = () => {
  updateHeader();
  queueScrollMotion();
};
const onResize = () => queueScrollMotion();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onResize, { passive: true });

if (!motionPreference.matches) {
  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -5% 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  root.classList.add("has-motion");
  motionStartFrame = window.requestAnimationFrame(() => {
    motionStartFrame = 0;
    motionStartFrameTwo = window.requestAnimationFrame(() => {
      motionStartFrameTwo = 0;
      root.classList.add("motion-started");
    });
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const disableMotionForPreference = () => {
  if (!motionPreference.matches) return;
  finishGlassIntro(true);
  heroEntranceAnimations.forEach((animation) => animation.cancel());
  heroEntranceAnimations = [];
  root.classList.remove("has-motion", "motion-started");
  revealItems.forEach((item) => item.classList.add("is-visible"));
  revealObserver?.disconnect();
  queueScrollMotion();
};
motionPreference.addEventListener("change", disableMotionForPreference);
runGlassIntro();

const contactSection = document.querySelector("#contato");
if ("IntersectionObserver" in window) {
  contactObserver = new IntersectionObserver(([entry]) => {
    document.body.classList.toggle("at-contact", entry.isIntersecting);
  }, { threshold: 0.18 });
  contactObserver.observe(contactSection);
}

const cleanup = () => {
  if (motionStartFrame) window.cancelAnimationFrame(motionStartFrame);
  if (motionStartFrameTwo) window.cancelAnimationFrame(motionStartFrameTwo);
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
  revealObserver?.disconnect();
  contactObserver?.disconnect();
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  motionPreference.removeEventListener("change", disableMotionForPreference);
};
window.addEventListener("pagehide", cleanup, { once: true });
