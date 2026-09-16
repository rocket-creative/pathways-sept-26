import GlassCard from "./GlassCard";
import { HeroCopy } from "./Hero";
import { ClosingCopy } from "./Closing";
import { BRANCH, stops } from "@/lib/stops";

/**
 * Under 900px the stage is not pinned: hero stacks, the branch becomes a
 * horizontally scrollable strip and the stops render as a vertical list.
 * Visibility is handled in CSS so the markup is static-export safe.
 */
export default function MobileFallback() {
  return (
    <div className="mobile">
      <header className="mobile__hero">
        <HeroCopy />
      </header>

      <div className="mobile__strip" aria-label="The path">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRANCH.src}
          srcSet={BRANCH.srcSet}
          sizes={BRANCH.sizes}
          width={BRANCH.width}
          height={BRANCH.height}
          alt="A winding branch carrying a cairn, a still pool, a labyrinth and two figures walking the path"
          decoding="async"
        />
      </div>

      <ul className="mobile__cards">
        {stops.map((stop) => (
          <li key={stop.id}>
            <GlassCard
              kicker={stop.kicker}
              title={stop.title}
              body={stop.body}
              href={stop.href}
              cta={stop.cta}
            />
          </li>
        ))}
      </ul>

      <section className="mobile__closing">
        <ClosingCopy />
      </section>
    </div>
  );
}
