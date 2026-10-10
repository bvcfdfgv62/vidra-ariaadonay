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
  const revealDuration = isMobile ? 950 : 1_250;
  const shadeDelay = isMobile ? 880 : 1_160;
  const shadeDuration = isMobile ? 360 : 520;
  glassIntro.classList.add("is-circle-reveal");

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
    animate(glassIntro, [
      { maskImage: "radial-gradient(circle at 50% 50%, transparent 0, transparent 0%, #000 .8%, #000 100%)", webkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0, transparent 0%, #000 .8%, #000 100%)" },
      { maskImage: "radial-gradient(circle at 50% 50%, transparent 0, transparent 150%, #000 150.8%, #000 151%)", webkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0, transparent 150%, #000 150.8%, #000 151%)" },
    ], revealDuration);
    animate(glassIntro.querySelector(".glass-intro__shade"), [{ opacity: .95 }, { opacity: 0 }], shadeDuration, shadeDelay);
    animate(glassIntro.querySelector(".glass-intro__photo"), [{ opacity: .46, transform: "scale(1.025)" }, { opacity: 0, transform: "scale(1)" }], shadeDuration, shadeDelay);
  } catch {
    finishGlassIntro(true);
    return;
  }

  const endAt = Math.max(revealDuration, shadeDelay + shadeDuration);
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
    

(function initMirrorFrameSequence() {
  const track = document.querySelector("[data-frame-sequence]");
  if (!track) return;

  const stage = track.querySelector(".mirror-sequence__sticky");
  const canvas = track.querySelector("[data-frame-canvas]");
  const context = canvas && canvas.getContext("2d", { alpha: false });
  if (!stage || !canvas || !context) return;

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!motionPreference.matches) track.classList.add("is-sequence-loading");
  const frameCount = 40;
  const frames = new Array(frameCount).fill(null);
  const framePath = (number) => "frames/frame-" + String(number).padStart(4, "0") + ".jpg";
  let resizeObserver = null;
  let trackObserver = null;
  let currentFrame = -1;
  let drawFrameId = 0;
  let isNearViewport = false;
  let loadPromise = null;

  const loadFrame = (index) => new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (typeof image.decode === "function") {
        image.decode().then(() => resolve(image)).catch(() => resolve(image));
      } else {
        resolve(image);
      }
    };
    image.decoding = "async";
    image.onload = finish;
    image.onerror = () => reject(new Error("Frame " + (index + 1) + " failed to load."));
    image.src = framePath(index + 1);
    if (image.complete && image.naturalWidth > 0) finish();
  });

  const resizeCanvas = () => {
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(bounds.width * pixelRatio);
    const height = Math.round(bounds.height * pixelRatio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    drawCurrentFrame();
  };

  const drawImageCover = (image) => {
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height || !image || !image.naturalWidth) return;
    const scale = Math.max(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.clearRect(0, 0, bounds.width, bounds.height);
    context.drawImage(image, (bounds.width - width) / 2, (bounds.height - height) / 2, width, height);
  };

  const drawCurrentFrame = () => {
    const selected = frames[currentFrame] || frames[0];
    if (selected) drawImageCover(selected);
  };

  const getProgressFrame = () => {
    const scrollableDistance = track.offsetHeight - stage.getBoundingClientRect().height;
    if (scrollableDistance <= 0) return 0;
    const progress = Math.max(0, Math.min(1, -track.getBoundingClientRect().top / scrollableDistance));
    return Math.round(progress * (frameCount - 1));
  };

  const updateFromScroll = () => {
    drawFrameId = 0;
    if (!isNearViewport || motionPreference.matches) return;
    const nextFrame = getProgressFrame();
    if (nextFrame !== currentFrame) {
      currentFrame = nextFrame;
      drawCurrentFrame();
    }
  };

  const queueScrollDraw = () => {
    if (!drawFrameId && isNearViewport && !motionPreference.matches) {
      drawFrameId = window.requestAnimationFrame(updateFromScroll);
    }
  };

  const removeScrollMotion = () => {
    window.removeEventListener("scroll", queueScrollDraw);
    window.removeEventListener("resize", resizeCanvas);
    resizeObserver?.disconnect();
    trackObserver?.disconnect();
    resizeObserver = null;
    trackObserver = null;
    isNearViewport = false;
    if (drawFrameId) window.cancelAnimationFrame(drawFrameId);
    drawFrameId = 0;
  };

  const showPoster = () => {
    currentFrame = 0;
    track.classList.remove("is-sequence-ready");
    track.classList.add("is-sequence-poster");
    resizeCanvas();
  };

  const activateScrollSequence = () => {
    if (motionPreference.matches || !frames.every(Boolean) || track.classList.contains("is-sequence-ready")) return;
    track.classList.remove("is-sequence-loading", "is-sequence-error");
    track.classList.remove("is-sequence-poster");
    track.classList.add("is-sequence-ready");
    currentFrame = -1;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(stage);
    } else {
      window.addEventListener("resize", resizeCanvas, { passive: true });
    }
    if ("IntersectionObserver" in window) {
      trackObserver = new IntersectionObserver(([entry]) => {
        isNearViewport = entry.isIntersecting;
        if (isNearViewport) queueScrollDraw();
        else if (drawFrameId) {
          window.cancelAnimationFrame(drawFrameId);
          drawFrameId = 0;
        }
      }, { rootMargin: "100% 0px" });
      trackObserver.observe(track);
    } else {
      isNearViewport = true;
    }
    window.addEventListener("scroll", queueScrollDraw, { passive: true });
    resizeCanvas();
    queueScrollDraw();
  };

  const loadSequence = () => {
    if (motionPreference.matches) return Promise.resolve();
    if (loadPromise) {
      return loadPromise.then(() => {
        if (!motionPreference.matches && !track.classList.contains("is-sequence-ready")) {
          activateScrollSequence();
        }
      });
    }
    loadPromise = loadFrame(0)
      .then((firstFrame) => {
        frames[0] = firstFrame;
        showPoster();
        return Promise.all(Array.from({ length: frameCount - 1 }, (_, offset) =>
          loadFrame(offset + 1).then((image) => { frames[offset + 1] = image; })
        ));
      })
      .then(activateScrollSequence)
      .catch(() => {
        removeScrollMotion();
        track.classList.remove("is-sequence-loading", "is-sequence-ready", "is-sequence-poster");
        track.classList.add("is-sequence-error");
      });
    return loadPromise;
  };

  const onMotionPreferenceChange = () => {
    if (motionPreference.matches) {
      removeScrollMotion();
      track.classList.remove("is-sequence-loading");
      if (frames[0]) showPoster();
    } else {
      loadSequence();
    }
  };

  if (typeof motionPreference.addEventListener === "function") {
    motionPreference.addEventListener("change", onMotionPreferenceChange);
  } else if (typeof motionPreference.addListener === "function") {
    motionPreference.addListener(onMotionPreferenceChange);
  }
  loadSequence();
})();
