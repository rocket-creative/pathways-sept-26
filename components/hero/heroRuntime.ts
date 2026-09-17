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
 *  - The pan finishes and holds, then the hand off: image 1, cards 1 to 5
 *    and the h1 lockup fade out while card 6 slides to the centre of the
 *    viewport, widening to the width of the page's wide cards (the 62rem
 *    stream in backdrop.css) so it lands on the same grid as the copy that
 *    follows, and image 2 fades in behind it. The widening is the one
 *    non-transform animation: card 6 is absolutely positioned inside the
 *    pinned stage, so the reflow stays inside the card. When the pin
 *    releases, card 6 is the first card on the page and the copy below is
 *    pulled up to start under it. No blur or frost on either image. Image 2
 *    sits fixed behind the page; its src is attached at 40% progress so it
 *    never competes with the first paint.
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
/** Pin distance, in viewports, for the hand off: fade out, card 6 to centre, image 2 in. */
const HANDOFF_VH = 0.6;
/** Card 6 widens to this as it takes the stage: backdrop.css --bento-w. */
const STREAM_REM = 76;
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
  /** The h1 lockup inside the pin. Optional: the stacked layout has none. */
  intro: HTMLElement | null;
}

function collect(root: HTMLElement): Parts | null {
  const pin = root.querySelector<HTMLElement>("[data-hero-pin]");
  const track = root.querySelector<HTMLElement>(".hero-stage__track");
  const image1 = root.querySelector<HTMLImageElement>("[data-hero-image-1]");
  const handoff = root.querySelector<HTMLElement>("[data-hero-image-2]");
  const image2 = handoff?.querySelector<HTMLImageElement>("img") ?? null;
  const stops = [...root.querySelectorAll<HTMLElement>("section.hero-stop")];
  const intro = root.querySelector<HTMLElement>(".home-intro");
  if (!pin || !track || !image1 || !handoff || !image2 || !stops.length) return null;
  return { root, pin, track, image1, handoff, image2, stops, intro };
}

/** Attaches image 2's src and srcset once. Idempotent. */
function preloadHandoff(image2: HTMLImageElement): void {
  if (image2.getAttribute("src")) return;
  const { src, srcset } = image2.dataset;
  if (srcset) image2.setAttribute("srcset", srcset);
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
  const { root, pin, track, image1, handoff, image2, stops, intro } = parts;

  html.setAttribute("data-hero-mode", "pin");
  html.setAttribute("data-hero-live", "1");
  root.dataset.heroPinned = "true";

  const active = stops.map(() => false);
  const inners = stops.map((stop) => stop.querySelector<HTMLElement>(".hero-stop__inner") ?? stop);

  /* Card 6 takes the stage in the hand off; everything else leaves. */
  const cta = stops[stops.length - 1];
  const leaving: HTMLElement[] = [...stops.slice(0, -1), ...(intro ? [intro] : [])];
  /* The page copy after the hero. hero.css pulls it up to sit under card 6,
     so it would otherwise show at the foot of the screen mid hand off; it
     fades in through the second half instead and is simply there on release. */
  const next = root.nextElementSibling;
  const after = next instanceof HTMLElement && next.matches(".prose") ? next : null;

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

  /* Card 6's two sizes: as the pan leaves it, and at the width of the wide
     cards below (the copy's content width, capped at 62rem), with the height
     it takes at that width. offsetLeft/Top/Width ignore transforms, so the
     measurements are stable whatever the scrub is doing. */
  let ctaLeft = 0;
  let ctaTop = 0;
  let ctaW0 = 0;
  let ctaW1 = 0;
  let ctaH0 = 0;
  let ctaH1 = 0;
  const streamWidth = () => {
    const rem = parseFloat(getComputedStyle(html).fontSize) || 16;
    let width = STREAM_REM * rem;
    if (after) {
      const cs = getComputedStyle(after);
      const content = after.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (content > 0) width = Math.min(width, content);
    }
    return width;
  };
  const measureCta = () => {
    const current = cta.style.width;
    cta.style.width = "";
    ctaLeft = cta.offsetLeft;
    ctaTop = cta.offsetTop;
    ctaW0 = cta.offsetWidth;
    ctaH0 = cta.offsetHeight;
    ctaW1 = Math.max(ctaW0, streamWidth());
    cta.style.width = `${ctaW1}px`;
    ctaH1 = cta.offsetHeight;
    cta.style.width = current;
    /* hero.css pulls the copy below the hero up to sit under card 6. */
    html.style.setProperty("--hero-cta-h", `${Math.round(ctaH1)}px`);
  };

  /* The hand off, after the pan has finished and held. Image 1, cards 1 to 5
     and the lockup fade out; card 6 widens and slides to the centre; image 2
     fades in. Opacity, transform and card 6's width: no blur, no frost. */
  let preloaded = false;
  const onHandoff = (t: number) => {
    if (t > 0) {
      const eased = t * t * (3 - 2 * t); // smoothstep
      const out = (1 - eased).toFixed(3);
      image1.style.opacity = out;
      handoff.style.opacity = eased.toFixed(3);
      for (const el of leaving) el.style.opacity = out;
      /* The card keeps its left edge as it widens, so its centre drifts
         right; aim the translation at where the centre is at this width. */
      const w = ctaW0 + (ctaW1 - ctaW0) * eased;
      const h = ctaH0 + (ctaH1 - ctaH0) * eased;
      const cx = ctaLeft + w / 2 - distPx;
      const cy = ctaTop + h / 2;
      /* html.clientWidth excludes the scrollbar, so the card centres on the
         same line the page's cards do (innerWidth would sit it a few pixels
         to the right of them). */
      gsap.set(cta, {
        width: w,
        x: (html.clientWidth / 2 - cx) * eased,
        y: (window.innerHeight / 2 - cy) * eased,
      });
      if (after) after.style.opacity = clamp((t - 0.5) / 0.5, 0, 1).toFixed(3);
      pin.dataset.heroPhase = t >= 1 ? "out" : "handoff";
    } else {
      image1.style.opacity = "";
      handoff.style.opacity = "";
      for (const el of leaving) el.style.opacity = "";
      gsap.set(cta, { x: 0, y: 0 });
      cta.style.width = "";
      if (after) after.style.opacity = "";
      delete pin.dataset.heroPhase;
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
    measureCta();
    return totalPin();
  };
  measureCta();

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
    for (const el of leaving) el.style.opacity = "";
    gsap.set(cta, { clearProps: "transform,width" });
    if (after) after.style.opacity = "";
    delete pin.dataset.heroPhase;
    pin.style.removeProperty("--hero-ground-alpha");
    html.style.removeProperty("--hero-cta-h");
    stops.forEach((stop) => delete stop.dataset.active);
    html.removeAttribute("data-hero-mode");
    html.removeAttribute("data-hero-live");
  };
}
