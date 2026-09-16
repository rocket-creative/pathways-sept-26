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
    return mountHero(root);
  }, []);

  return (
    <div className="hero-stage" data-hero ref={rootRef}>
      {children}
    </div>
  );
}
