"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import GlassCard from "./GlassCard";
import type { Stop } from "@/lib/stops";

/** DOM handles the Stage needs to lay out and animate one stop. */
export type CalloutHandle = {
  root: HTMLDivElement;
  path: SVGPathElement;
  terminal: SVGCircleElement;
  card: HTMLDivElement;
};

type Props = { stop: Stop };

const Callout = forwardRef<CalloutHandle, Props>(function Callout(
  { stop },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const terminalRef = useRef<SVGCircleElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Element refs are attached before imperative handles are created.
  useImperativeHandle(
    ref,
    () => ({
      root: rootRef.current!,
      path: pathRef.current!,
      terminal: terminalRef.current!,
      card: cardRef.current!,
    }),
    [],
  );

  return (
    <div className="callout" ref={rootRef} data-stop={stop.id}>
      <span className="callout__anchor" aria-hidden="true" />
      <svg className="callout__leader" aria-hidden="true">
        <path className="callout__path" ref={pathRef} d="M0 0" />
        <circle className="callout__terminal" ref={terminalRef} r={3.5} />
      </svg>
      <div className="callout__card" ref={cardRef}>
        <GlassCard
          kicker={stop.kicker}
          title={stop.title}
          body={stop.body}
          href={stop.href}
          cta={stop.cta}
        />
      </div>
    </div>
  );
});

export default Callout;
