"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Callout, { type CalloutHandle } from "./Callout";
import Chrome from "./Chrome";
import Hero from "./Hero";
import Closing from "./Closing";
import MobileFallback from "./MobileFallback";
import { BRANCH, stops } from "@/lib/stops";

/* Layout constants (fractions of the viewport unless noted). */
const ASPECT = BRANCH.width / BRANCH.height;
const IMAGE_SCALE = 2.15; // image height = 2.15 × viewport height
const IMAGE_CENTER_Y = 0.58; // image vertically centred at 58vh
const SCROLL_FACTOR = 1.1; // scroll distance = (track − viewport) × 1.1
const ACTIVE_MIN_X = 0.18; // stop turns on when anchor is inside this band
const ACTIVE_MAX_X = 0.78;
const CARD_TOP_MIN = 0.14; // card never closer than 14vh to the top…
const CARD_BOTTOM_MIN = 0.12; // …or 12vh to the bottom
const LEADER_GAP = 7; // px between anchor dot and start of the leader
const CARD_RISE = 24; // px the card rises while fading in
const RESIZE_DEBOUNCE = 150;

type Metrics = { vw: number; vh: number; W: number; H: number; imgTop: number };
type StopLayout = { x: number; y: number; length: number };

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/**
 * Leader from the anchor (origin) to the nearest edge of the card.
 * Card rect is given relative to the anchor. Returns the SVG path and the
 * terminal point where the small circle sits.
 */
function leaderPath(cl: number, ct: number, w: number, h: number) {
  const cr = cl + w;
  const cb = ct + h;

  // Anchor sits within the card's horizontal span → straight vertical line.
  if (cl <= 0 && cr >= 0) {
    const ty = cb < 0 ? cb : ct;
    const sy = ty < 0 ? -LEADER_GAP : LEADER_GAP;
    return { d: `M0 ${sy} L0 ${ty}`, tx: 0, ty };
  }

  // Otherwise an elbow: vertical to the card's mid-height, then across.
  const tx = cr < 0 ? cr : cl;
  const ty = ct <= 0 && cb >= 0 ? 0 : ct + h / 2;
  if (ty === 0) {
    const sx = tx < 0 ? -LEADER_GAP : LEADER_GAP;
    return { d: `M${sx} 0 L${tx} 0`, tx, ty };
  }
  const sy = ty < 0 ? -LEADER_GAP : LEADER_GAP;
  return { d: `M0 ${sy} L0 ${ty} L${tx} ${ty}`, tx, ty };
}

export default function HorizontalStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const calloutRefs = useRef<(CalloutHandle | null)[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    const img = imgRef.current;
    if (!section || !track || !img) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 900px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { desktop, reduce } = ctx.conditions as {
          desktop: boolean;
          reduce: boolean;
        };
        if (!desktop) return; // < 900px: CSS shows the stacked fallback

        const handles = calloutRefs.current.filter(
          (h): h is CalloutHandle => h !== null,
        );
        const metrics: Metrics = { vw: 0, vh: 0, W: 0, H: 0, imgTop: 0 };
        const layouts: StopLayout[] = stops.map(() => ({
          x: 0,
          y: 0,
          length: 0,
        }));
        const active: boolean[] = stops.map(() => false);

        /* ---------------------------------------------------------- */
        /* Layout: size the track/image and place every callout        */
        /* ---------------------------------------------------------- */
        const layout = () => {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const H = vh * IMAGE_SCALE;
          const W = H * ASPECT;
          const imgTop = vh * IMAGE_CENTER_Y - H / 2;
          Object.assign(metrics, { vw, vh, W, H, imgTop });

          track.style.width = `${W}px`;
          img.style.width = `${W}px`;
          img.style.height = `${H}px`;
          img.style.top = `${imgTop}px`;

          handles.forEach((h, i) => {
            const stop = stops[i];
            const ax = stop.x * W;
            const ay = imgTop + stop.y * H;
            h.root.style.left = `${ax}px`;
            h.root.style.top = `${ay}px`;

            // Card: centred horizontally at dx, top at dy, clamped into view.
            const w = h.card.offsetWidth;
            const ch = h.card.offsetHeight;
            const cl = stop.dx * vw - w / 2;
            const minTop = CARD_TOP_MIN * vh - ay;
            const maxTop = (1 - CARD_BOTTOM_MIN) * vh - ch - ay;
            const ct = clamp(stop.dy * vh, minTop, Math.max(minTop, maxTop));
            h.card.style.left = `${cl}px`;
            h.card.style.top = `${ct}px`;

            // Leader + terminal circle.
            const { d, tx, ty } = leaderPath(cl, ct, w, ch);
            h.path.setAttribute("d", d);
            h.terminal.setAttribute("cx", String(tx));
            h.terminal.setAttribute("cy", String(ty));
            const length = h.path.getTotalLength();
            layouts[i] = { x: ax, y: ay, length };

            if (reduce) {
              h.path.style.strokeDasharray = "none";
              h.path.style.strokeDashoffset = "0";
            } else {
              h.path.style.strokeDasharray = `${length}`;
              h.path.style.strokeDashoffset = active[i] ? "0" : `${length}`;
              if (!active[i]) gsap.set(h.card, { y: CARD_RISE });
            }
          });
        };

        /* ---------------------------------------------------------- */
        /* Stop on / off                                                */
        /* ---------------------------------------------------------- */
        const setStop = (i: number, on: boolean) => {
          if (reduce) return;
          const h = handles[i];
          const { length } = layouts[i];
          gsap.killTweensOf([h.path, h.terminal, h.card]);

          if (on) {
            gsap
              .timeline()
              .to(
                h.path,
                { strokeDashoffset: 0, duration: 0.9, ease: "power3.inOut" },
                0,
              )
              .to(
                h.terminal,
                { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
                0.85,
              )
              .to(
                h.card,
                { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
                0.4,
              );
          } else {
            gsap.to(h.path, {
              strokeDashoffset: length,
              duration: 0.45,
              ease: "power2.inOut",
            });
            gsap.to(h.terminal, { autoAlpha: 0, duration: 0.2 });
            gsap.to(h.card, {
              autoAlpha: 0,
              y: CARD_RISE,
              duration: 0.35,
              ease: "power2.in",
            });
          }
        };

        const checkStops = () => {
          const x = Number(gsap.getProperty(track, "x"));
          const { vw } = metrics;
          layouts.forEach((l, i) => {
            const vx = l.x + x;
            const on = vx >= ACTIVE_MIN_X * vw && vx <= ACTIVE_MAX_X * vw;
            if (on !== active[i]) {
              active[i] = on;
              setStop(i, on);
            }
          });
        };

        const updateProgress = (p: number) => {
          const fill = progressFillRef.current;
          const label = progressLabelRef.current;
          if (fill) fill.style.transform = `scaleX(${p})`;
          if (label) label.textContent = `${Math.round(p * 100)}% walked`;
        };

        /* ---------------------------------------------------------- */
        /* Pin + scrub                                                  */
        /* ---------------------------------------------------------- */
        layout();
        ScrollTrigger.addEventListener("refreshInit", layout);

        gsap.to(track, {
          x: () => -(metrics.W - metrics.vw),
          ease: "none",
          onUpdate: checkStops,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${(metrics.W - metrics.vw) * SCROLL_FACTOR}`,
            pin: true,
            scrub: reduce ? true : 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => updateProgress(self.progress),
          },
        });

        checkStops();
        updateProgress(0);

        // Card heights depend on web fonts; re-measure once they arrive.
        if (document.fonts?.ready) {
          document.fonts.ready.then(() => ScrollTrigger.refresh());
        }

        // Debounced resize → relayout (via refreshInit) + refresh.
        let timer = 0;
        const onResize = () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(
            () => ScrollTrigger.refresh(),
            RESIZE_DEBOUNCE,
          );
        };
        window.addEventListener("resize", onResize);

        return () => {
          window.clearTimeout(timer);
          window.removeEventListener("resize", onResize);
          ScrollTrigger.removeEventListener("refreshInit", layout);
          updateProgress(0);
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <>
      <Chrome
        progressFillRef={progressFillRef}
        progressLabelRef={progressLabelRef}
      />

      <section className="stage" ref={sectionRef} aria-label="Walk the path">
        <div className="track" ref={trackRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            className="branch"
            src={BRANCH.src}
            srcSet={BRANCH.srcSet}
            sizes={BRANCH.sizes}
            width={BRANCH.width}
            height={BRANCH.height}
            alt="A winding branch carrying a cairn, a still pool, a labyrinth and two figures walking the path"
            decoding="async"
            fetchPriority="high"
          />

          <Hero />

          {stops.map((stop, i) => (
            <Callout
              key={stop.id}
              stop={stop}
              ref={(h) => {
                calloutRefs.current[i] = h;
              }}
            />
          ))}

          <Closing />
        </div>
      </section>

      <MobileFallback />
    </>
  );
}
