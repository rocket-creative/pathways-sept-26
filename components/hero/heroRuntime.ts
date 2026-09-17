import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Homepage hero controller.
 *
 * Rules this file is built around (home.md SEO notes, 00-cursor-master-prompt
 * section 2, 01-cursor-audit-prompt Part 1):
 *
 *  - Pinning is ScrollTrigger `pin: true` scrubbed by native scroll. No wheel
 *    or touch listener, no scroll container, no preventDefault.
 *  - Cards move by transform only. Nothing is ever faded, hidden, or clipped
 *    as a resting state; the settle in is a y offset that lands at 0.
 *  - The pan finishes and holds before image 2 fades in. Image 1 only ever
 *    changes opacity; no blur, scale, or frost. Image 2 sits fixed behind the
 *    page; its src is attached at 40% progress so it never competes with the
 *    first paint.
 *  - The URL hash is never written. Arriving with #<stop-id> scrolls native
 *    scroll to that card's pin progress instead of letting the pin swallow it.
 *  - Under 768px or prefers-reduced-motion the pin is never created; the CSS
 *    stacked layout stands and only the image 2 hand off is wired.
 */

const DESKTOP = "(min-width: 768px)";
const MOBILE = "(max-width: 767px)";
const REDUCE = "(prefers-reduced-motion: reduce)";

/** Scroll distance relative to the track overflow: a little slower than 1:1. */
const SCROLL_FACTOR = 1.1;
/** Extra pin distance, in viewports, after the pan finishes and before image 2. */
const END_HOLD_VH = 0.55;
/** Pin distance, in viewports, for the image 1 → image 2 fade. */
const HANDOFF_VH = 0.45;
/** Progress at which image 2 starts downloading. */
const PRELOAD_AT = 0.4;
/** A card is "active" while its centre sits inside this band of the viewport. */
const ACTIVE_MIN = 0.08;
const ACTIVE_MAX = 0.92;
/** Pixels a card settles down from as it becomes active. Transform only. */
const SETTLE_Y = 18;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

interface Parts {
  root: HTMLElement;
  pin: HTMLElement;
  track: HTMLElement;
  image1: HTMLImageElement;
  handoff: HTMLElement;
  image2: HTMLImageElement;
  stops: HTMLElement[];
}

function collect(root: HTMLElement): Parts | null {
  const pin = root.querySelector<HTMLElement>("[data-hero-pin]");
  const track = root.querySelector<HTMLElement>(".hero-stage__track");
  const image1 = root.querySelector<HTMLImageElement>("[data-hero-image-1]");
  const handoff = root.querySelector<HTMLElement>("[data-hero-image-2]");
  const image2 = handoff?.querySelector<HTMLImageElement>("img") ?? null;
  const stops = [...root.querySelectorAll<HTMLElement>("section.hero-stop")];
  if (!pin || !track || !image1 || !handoff || !image2 || !stops.length) return null;
  return { root, pin, track, image1, handoff, image2, stops };
}

/** Attaches image 2's src once. Idempotent. */
function preloadHandoff(image2: HTMLImageElement): void {
  if (image2.getAttribute("src")) return;
  const src = image2.dataset.src;
  if (src) image2.setAttribute("src", src);
}

function stopForHash(stops: HTMLElement[]): HTMLElement | null {
  const raw = window.location.hash.slice(1);
  if (!raw) return null;
  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    /* leave as is */
  }
  return stops.find((stop) => stop.querySelector("h2")?.id === id) ?? null;
}

export function mountHero(root: HTMLElement): () => void {
  const parts = collect(root);
  if (!parts) {
    root.dataset.heroReady = "true";
    return () => undefined;
  }

  gsap.registerPlugin(ScrollTrigger);
  const html = document.documentElement;
  const mm = gsap.matchMedia();

  // `mobile` is listed so the context re-runs when the viewport crosses 768px
  // in either direction, not only when `desktop` starts matching.
  mm.add({ desktop: DESKTOP, mobile: MOBILE, reduce: REDUCE }, (context) => {
    const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
    return desktop && !reduce ? mountPinned(parts, html) : mountStacked(parts, html);
  });

  return () => {
    mm.revert();
    delete root.dataset.heroReady;
    delete root.dataset.heroPinned;
  };
}

/* ------------------------------------------------------------------ */
/* Stacked: mobile, reduced motion. No pin is ever created.            */
/* ------------------------------------------------------------------ */

function mountStacked({ root, stops, handoff, image2 }: Parts, html: HTMLElement): () => void {
  html.removeAttribute("data-hero-mode");
  html.setAttribute("data-hero-live", "1");
  root.dataset.heroPinned = "false";

  let observer: IntersectionObserver | null = null;
  if ("IntersectionObserver" in window) {
    const preloadStop = stops[Math.min(stops.length - 1, Math.floor(stops.length * PRELOAD_AT))];
    const showStop = stops[Math.max(0, stops.length - 2)];
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (entry.target === preloadStop) preloadHandoff(image2);
        if (entry.target === showStop) {
          preloadHandoff(image2);
          handoff.dataset.show = "true";
        }
      }
    });
    observer.observe(preloadStop);
    observer.observe(showStop);
  }

  root.dataset.heroReady = "true";

  return () => {
    observer?.disconnect();
    delete handoff.dataset.show;
    html.removeAttribute("data-hero-live");
  };
}

/* ------------------------------------------------------------------ */
/* Pinned: desktop with motion allowed.                                */
/* ------------------------------------------------------------------ */

function mountPinned(parts: Parts, html: HTMLElement): () => void {
  const { root, pin, track, image1, handoff, image2, stops } = parts;

  html.setAttribute("data-hero-mode", "pin");
  html.setAttribute("data-hero-live", "1");
  root.dataset.heroPinned = "true";

  const active = stops.map(() => false);
  const inners = stops.map((stop) => stop.querySelector<HTMLElement>(".hero-stop__inner") ?? stop);

  /* The track runs exactly to the image's right edge: no band after it. */
  const distance = () => Math.max(track.offsetWidth - window.innerWidth, 1);
  /* Intro lives inside the pin, so it stays on screen for the side-scroll.
     The pan starts immediately; there is no opening hold. */
  const hold = () => 0;
  const travel = () => Math.round(distance() * SCROLL_FACTOR);
  const endHold = () => Math.round(window.innerHeight * END_HOLD_VH);
  const handoffSpan = () => Math.round(window.innerHeight * HANDOFF_VH);

  /* Which cards are on stage. Activation is a small y settle, never a fade. */
  const checkStops = () => {
    const x = Number(gsap.getProperty(track, "x")) || 0;
    const vw = window.innerWidth;
    stops.forEach((stop, index) => {
      const centre = stop.offsetLeft + stop.offsetWidth / 2 + x;
      const on = centre > ACTIVE_MIN * vw && centre < ACTIVE_MAX * vw;
      if (on === active[index]) return;
      active[index] = on;
      stop.dataset.active = on ? "true" : "false";
      if (on) {
        gsap.fromTo(
          inners[index],
          { y: SETTLE_Y },
          { y: 0, duration: 0.7, ease: "power2.out", overwrite: true },
        );
      }
    });
  };

  /* Image 2 fades in only after the pan has finished and held. Opacity only;
     no blur, scale, or frost on either image. */
  let preloaded = false;
  const onHandoff = (t: number) => {
    if (t > 0) {
      const eased = t * t * (3 - 2 * t); // smoothstep
      image1.style.opacity = (1 - eased).toFixed(3);
      handoff.style.opacity = eased.toFixed(3);
    } else {
      image1.style.opacity = "";
      handoff.style.opacity = "";
    }
    pin.style.setProperty("--hero-ground-alpha", (1 - t).toFixed(3));
  };

  /* Measurements, taken on every ScrollTrigger refresh rather than per frame. */
  let holdPx = hold();
  let travelPx = travel();
  let endHoldPx = endHold();
  let handoffPx = handoffSpan();
  let distPx = distance();
  const totalPin = () => holdPx + travelPx + endHoldPx + handoffPx;
  const measure = () => {
    holdPx = hold();
    travelPx = travel();
    endHoldPx = endHold();
    handoffPx = handoffSpan();
    distPx = distance();
    return totalPin();
  };

  /* One scrubbed value drives everything: the track's x (transform only),
     the card activation, then a hold, then the image 2 fade. */
  const state = { p: 0 };
  const apply = () => {
    const px = state.p * totalPin();
    const afterHold = px - holdPx;
    let tp = 0;
    let ht = 0;
    if (afterHold <= 0) {
      tp = 0;
      ht = 0;
    } else if (afterHold < travelPx) {
      tp = afterHold / travelPx;
      ht = 0;
    } else if (afterHold < travelPx + endHoldPx) {
      tp = 1;
      ht = 0;
    } else {
      tp = 1;
      ht = clamp((afterHold - travelPx - endHoldPx) / Math.max(handoffPx, 1), 0, 1);
    }

    if (!preloaded && tp >= PRELOAD_AT) {
      preloaded = true;
      preloadHandoff(image2);
    }

    gsap.set(track, { x: -distPx * tp });
    checkStops();
    onHandoff(ht);
  };

  const tween = gsap.to(state, {
    p: 1,
    ease: "none",
    onUpdate: apply,
    scrollTrigger: {
      trigger: pin,
      start: "top top",
      end: () => `+=${measure()}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: apply,
    },
  });
  const trigger = tween.scrollTrigger!;
  apply();

  /* Native scroll to the scroll position where a card is centred on screen. */
  const scrollToStop = (stop: HTMLElement, smooth: boolean) => {
    const rect = stop.getBoundingClientRect();
    const onScreen =
      rect.left >= 0 && rect.right <= window.innerWidth && trigger.isActive && window.scrollY >= holdPx;
    if (onScreen) return;

    const centre = stop.offsetLeft + stop.offsetWidth / 2;
    const x = clamp(centre - window.innerWidth / 2, 0, distPx);
    const top = trigger.start + holdPx + (x / distPx) * travelPx;
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  /* Deep links: /#<stop-id> lands on that card instead of the pin's start. */
  const applyHash = (smooth: boolean) => {
    const stop = stopForHash(stops);
    if (stop) scrollToStop(stop, smooth);
  };
  const onHashChange = () => applyHash(true);
  window.addEventListener("hashchange", onHashChange);

  /* Keyboard: a focused card is brought on stage. Responds to user input only. */
  const onFocusIn = (event: FocusEvent) => {
    const target = event.target as Element | null;
    const stop = target?.closest<HTMLElement>("section.hero-stop");
    if (stop) scrollToStop(stop, false);
  };
  track.addEventListener("focusin", onFocusIn);

  /* Pin height depends on fonts and the image; measure again once they land. */
  let settled = false;
  const settle = () => {
    ScrollTrigger.refresh();
    if (!settled) {
      settled = true;
      applyHash(false);
    }
  };
  const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
  let cancelled = false;
  fontsReady.then(() => {
    if (!cancelled) settle();
  });
  const onImageLoad = () => {
    if (!cancelled) ScrollTrigger.refresh();
  };
  if (!image1.complete) image1.addEventListener("load", onImageLoad, { once: true });

  // Browsers re-run their own fragment jump at load; run ours after it.
  const onLoad = () => {
    if (!cancelled) settle();
  };
  if (document.readyState === "complete") {
    // Already loaded: refresh and land once fonts are in (above).
  } else {
    window.addEventListener("load", onLoad, { once: true });
  }

  root.dataset.heroReady = "true";

  return () => {
    cancelled = true;
    window.removeEventListener("hashchange", onHashChange);
    window.removeEventListener("load", onLoad);
    track.removeEventListener("focusin", onFocusIn);
    image1.removeEventListener("load", onImageLoad);
    image1.style.opacity = "";
    handoff.style.opacity = "";
    pin.style.removeProperty("--hero-ground-alpha");
    stops.forEach((stop) => delete stop.dataset.active);
    html.removeAttribute("data-hero-mode");
    html.removeAttribute("data-hero-live");
  };
}
