"use client";

import { useEffect, useState } from "react";

/**
 * Live reading of prefers-reduced-motion, for components that need to make a
 * different choice rather than skip a tween (the quiz's step transitions, for
 * instance). Starts false so the server and the first client render agree,
 * then corrects itself in an effect.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default useReducedMotion;
