"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { mountHero } from "./heroRuntime";

/**
 * Client shell around the server rendered hero. It owns no markup of its own
 * beyond the wrapper: the stops arrive as children, already in the HTML, and
 * the controller in heroRuntime.ts finds them by class after hydration.
 */
export default function HeroStage({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    /* Park the nav veil on <body>, above the footer and below the bar.
       Left inside the page, main's stacking context holds it under the
       footer, so the footer slides into the pills with no fade. */
    const veil = root.querySelector<HTMLElement>(".hero-handoff--veil");
    const veilParent = veil?.parentElement ?? null;
    if (veil) document.body.appendChild(veil);
    const stop = mountHero(root);
    return () => {
      stop();
      if (veil && veilParent) veilParent.appendChild(veil);
    };
  }, []);

  return (
    <div className="hero-stage" data-hero ref={rootRef}>
      {children}
    </div>
  );
}
