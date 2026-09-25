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
 *    follows, and image 2 fades in behind it. Card 6 is position:fixed on
 *    the body for that move, so the pin releasing cannot carry it off.
 *    When the hand off scroll finishes it is the first card of the page
 *    copy, docked under the header. Scrolling back puts it on the track.
 *    No blur or frost on either image. Image 2 sits fixed behind the page;
 *    its src is attached at 40% progress so it never competes with the first
 *    paint.
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
/** Pin distance, in viewports, for the hand off: fade out, card 6 to the top, image 2 in. */
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
  /** Image 2 behind the page, and its veil under the fixed nav (hero.css).
      Both carry [data-hero-image-2] and are always painted together. */
  handoff: HTMLElement[];
  image2: HTMLImageElement[];
  stops: HTMLElement[];
  /** The h1 lockup inside the pin. Optional: the stacked layout has none. */
  intro: HTMLElement | null;
}

function collect(root: HTMLElement): Parts | null {
  const pin = root.querySelector<HTMLElement>("[data-hero-pin]");
  const track = root.querySelector<HTMLElement>(".hero-stage__track");
  const image1 = root.querySelector<HTMLImageElement>("[data-hero-image-1]");
  const handoff = [...root.querySelectorAll<HTMLElement>("[data-hero-image-2]")];
  const image2 = handoff
    .map((el) => el.querySelector<HTMLImageElement>("img"))
    .filter((img): img is HTMLImageElement => img !== null);
  const stops = [...root.querySelectorAll<HTMLElement>("section.hero-stop")];
  const intro = root.querySelector<HTMLElement>(".home-intro");
  if (!pin || !track || !image1 || !handoff.length || image2.length !== handoff.length || !stops.length) {
    return null;
  }
  return { root, pin, track, image1, handoff, image2, stops, intro };
}

/** Attaches image 2's src and srcset once. Idempotent. */
function preloadHandoff(images: HTMLImageElement[]): void {
  for (const image of images) {
    if (image.getAttribute("src")) continue;
    const { src, srcset } = image.dataset;
    if (srcset) image.setAttribute("srcset", srcset);
    if (src) image.setAttribute("src", src);
  }
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
          for (const el of handoff) el.dataset.show = "true";
        }
      }
    });
    observer.observe(preloadStop);
    observer.observe(showStop);
  }

  root.dataset.heroReady = "true";

  return () => {
    observer?.disconnect();
    for (const el of handoff) delete el.dataset.show;
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
  /* Opacity on an ancestor of backdrop-filter makes the blur sample an empty
     group, so the photograph shows through sharp until the fade hits 1.
     Fade the glass element itself. The dot and the leader are pseudos on the
     stop, so they follow --stop-fade. */
  const leavingFade = leaving.map((el) => {
    const inner = el.classList.contains("hero-stop")
      ? el.querySelector<HTMLElement>(".hero-stop__inner")
      : null;
    return { host: el, glass: inner ?? el };
  });
  /* The page copy after the hero. hero.css pulls it up to sit under card 6,
     so it would otherwise show at the foot of the screen mid hand off; it
     fades in through the second half instead and is simply there on release.
     Each card is faded on its own, never the prose that wraps them. */
  const next = root.nextElementSibling;
  const after = next instanceof HTMLElement && next.matches(".prose") ? next : null;
  const rising = after
    ? [...after.children].filter((node): node is HTMLElement => node instanceof HTMLElement)
    : [];

  /* The track runs exactly to the image's right edge: no band after it. */
  const distance = () => Math.max(track.offsetWidth - window.innerWidth, 1);
  /* Intro lives inside the pin, so it stays on screen for the side-scroll.
     The pan starts immediately; there is no opening hold. */
  const hold = () => 0;
  const travel = () => Math.round(distance() * SCROLL_FACTOR);
  const endHold = () => Math.round(window.innerHeight * END_HOLD_VH);
  const handoffSpan = () => Math.round(window.innerHeight * HANDOFF_VH);

  /* Which cards are on stage. Activation is a small y settle, never a fade.
     Card 6 is left out: once it docks, that settle reads as a bounce. */
  const checkStops = () => {
    const x = Number(gsap.getProperty(track, "x")) || 0;
    const vw = window.innerWidth;
    stops.forEach((stop, index) => {
      if (stop === cta) return;
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
    /* Mid hand off the card is on the body or in the page copy. Its track
       size does not change with scroll, so keep the last measurement. */
    if (cta.parentElement !== track) {
      if (ctaH1) html.style.setProperty("--hero-cta-h", `${Math.round(ctaH1)}px`);
      return;
    }
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

  /* Where card 6 docks: the top of the vertical page, under the header,
     on the same left edge and width as the cards below it. */
  const dockTop = () => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const bottom = header ? header.getBoundingClientRect().bottom : 72;
    return Math.round(bottom + 16);
  };
  const dockBox = () => {
    const sample = after?.querySelector<HTMLElement>(":scope > .page-section");
    if (sample) {
      const rect = sample.getBoundingClientRect();
      return { left: rect.left, width: rect.width };
    }
    return { left: dockLeftFallback(), width: ctaW1 || ctaW0 };
  };
  const dockLeftFallback = () => {
    if (!after) return 0;
    const cs = getComputedStyle(after);
    return after.getBoundingClientRect().left + parseFloat(cs.paddingLeft);
  };
  const rowGap = () => (after ? parseFloat(getComputedStyle(after).rowGap) || 24 : 24);

  const clearFlight = () => {
    cta.style.position = "";
    cta.style.left = "";
    cta.style.top = "";
    cta.style.right = "";
    cta.style.bottom = "";
    cta.style.width = "";
    cta.style.margin = "";
    cta.style.zIndex = "";
    cta.style.transform = "";
  };

  /* Scroll range of the pin, filled in once the trigger exists. The hand off
     follows this, not the scrubbed tween, so the card cannot lag behind the
     pin and get carried off. */
  const pinScroll = { start: 0, end: 0 };
  let landed = false;

  /* Hold the page copy just under a viewport y. Adjusts from the current
     margin so the document height never collapses mid-frame (that clamps
     the scroll and the card bounces). */
  const placeProseAt = (viewportTop: number) => {
    if (!after) return;
    const current = parseFloat(after.style.marginTop) || 0;
    const without = after.getBoundingClientRect().top - current;
    const next = viewportTop - without;
    if (Math.abs(next - current) < 0.5) return;
    after.style.marginTop = `${next}px`;
  };

  /* Grow card 6 on the viewport. It is position:fixed on the body so the
     pin's overflow and its release cannot scroll it away. */
  const fly = (p: number) => {
    clearInner();
    const eased = p * p * (3 - 2 * p);
    const trackX = Number(gsap.getProperty(track, "x")) || 0;
    const fromLeft = ctaLeft + trackX;
    const fromTop = ctaTop + pin.getBoundingClientRect().top;
    const dock = dockBox();
    const left = fromLeft + (dock.left - fromLeft) * eased;
    const top = fromTop + (dockTop() - fromTop) * eased;
    const width = ctaW0 + ((dock.width || ctaW1) - ctaW0) * eased;
    if (cta.parentElement !== document.body) {
      gsap.set(cta, { clearProps: "transform,x,y,width" });
      document.body.appendChild(cta);
    }
    cta.style.position = "fixed";
    cta.style.left = `${left}px`;
    cta.style.top = `${top}px`;
    cta.style.right = "auto";
    cta.style.bottom = "auto";
    cta.style.width = `${width}px`;
    cta.style.margin = "0";
    cta.style.zIndex = "5";
    cta.style.transform = "none";
    placeProseAt(top + cta.offsetHeight + rowGap());
  };

  const clearInner = () => {
    const inner = cta.querySelector<HTMLElement>(".hero-stop__inner");
    if (inner) gsap.set(inner, { clearProps: "transform" });
  };

  /* Drop card 6 into the page copy without moving it. It is already on
     screen at the dock; the margin keeps that exact top, then the page
     scrolls from there. */
  const land = () => {
    if (!after) return;
    if (landed && cta.parentElement === after) return;
    if (cta.parentElement !== document.body) fly(1);
    const frozenTop = cta.getBoundingClientRect().top;
    clearFlight();
    clearInner();
    gsap.set(cta, { clearProps: "transform,x,y,width" });
    if (cta.parentElement !== after) after.prepend(cta);
    const current = parseFloat(after.style.marginTop) || 0;
    const shift = frozenTop - cta.getBoundingClientRect().top;
    after.style.marginTop = `${current + shift}px`;
    landed = true;
  };

  const restore = () => {
    landed = false;
    clearFlight();
    if (after) after.style.marginTop = "";
    if (cta.parentElement !== track) track.appendChild(cta);
    gsap.set(cta, { x: 0, y: 0 });
    cta.style.width = "";
  };

  const fadeHandoff = (p: number) => {
    if (p <= 0) {
      image1.style.opacity = "";
      for (const el of handoff) el.style.opacity = "";
      for (const { host, glass } of leavingFade) {
        glass.style.opacity = "";
        host.style.removeProperty("--stop-fade");
      }
      for (const el of rising) el.style.opacity = "";
      return;
    }
    const eased = p * p * (3 - 2 * p);
    const out = (1 - eased).toFixed(3);
    image1.style.opacity = out;
    for (const el of handoff) el.style.opacity = eased.toFixed(3);
    for (const { host, glass } of leavingFade) {
      glass.style.opacity = out;
      if (glass !== host) host.style.setProperty("--stop-fade", out);
    }
    const rise = clamp((p - 0.5) / 0.5, 0, 1).toFixed(3);
    for (const el of rising) el.style.opacity = rise;
  };

  /* The hand off, after the pan has finished and held. Image 1, cards 1 to 5
     and the lockup fade out; card 6 widens and moves to the top of the
     vertical page; image 2 fades in. The card follows real scroll. */
  let preloaded = false;
  const onHandoff = (t: number) => {
    const begin = pinScroll.start + holdPx + travelPx + endHoldPx;
    const grow =
      pinScroll.end > pinScroll.start
        ? clamp((window.scrollY - begin) / Math.max(handoffPx, 1), 0, 1)
        : t;
    /* Stay docked through a few pixels of scroll wobble at the boundary.
       Re-flying there is the bounce. */
    const docked = grow >= 1 || (landed && grow > 0.97);

    fadeHandoff(docked ? 1 : grow);
    if (docked) {
      pin.dataset.heroPhase = "out";
      html.dataset.heroPhase = "out";
      land();
    } else if (grow > 0) {
      landed = false;
      pin.dataset.heroPhase = "handoff";
      html.dataset.heroPhase = "handoff";
      fly(grow);
    } else {
      delete pin.dataset.heroPhase;
      delete html.dataset.heroPhase;
      restore();
    }
    pin.style.setProperty("--hero-ground-alpha", (1 - (docked ? 1 : grow)).toFixed(3));
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

  const syncPinScroll = (trigger: ScrollTrigger) => {
    pinScroll.start = trigger.start;
    pinScroll.end = trigger.end;
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
      onRefresh: (self) => {
        syncPinScroll(self);
        apply();
      },
    },
  });
  const trigger = tween.scrollTrigger!;
  syncPinScroll(trigger);
  apply();

  /* The tween scrubs behind the scroll. The card has to move with the scroll
     itself, or the pin releases and takes card 6 with it before the tween
     catches up. */
  const onScroll = () => onHandoff(state.p > 0 ? clamp((state.p * totalPin() - holdPx - travelPx - endHoldPx) / Math.max(handoffPx, 1), 0, 1) : 0);
  window.addEventListener("scroll", onScroll, { passive: true });

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
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("load", onLoad);
    track.removeEventListener("focusin", onFocusIn);
    image1.removeEventListener("load", onImageLoad);
    image1.style.opacity = "";
    for (const el of handoff) el.style.opacity = "";
    for (const { host, glass } of leavingFade) {
      glass.style.opacity = "";
      host.style.removeProperty("--stop-fade");
    }
    clearFlight();
    if (cta.parentElement !== track) track.appendChild(cta);
    if (after) after.style.marginTop = "";
    gsap.set(cta, { clearProps: "transform,width,x,y" });
    for (const el of rising) el.style.opacity = "";
    delete pin.dataset.heroPhase;
    delete html.dataset.heroPhase;
    pin.style.removeProperty("--hero-ground-alpha");
    html.style.removeProperty("--hero-cta-h");
    stops.forEach((stop) => delete stop.dataset.active);
    html.removeAttribute("data-hero-mode");
    html.removeAttribute("data-hero-live");
  };
}
