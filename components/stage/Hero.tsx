export function HeroCopy() {
  return (
    <>
      <h1>
        Find your <em>way</em> within.
      </h1>
      <p>
        Pathways Within is a Long Island collaborative of therapists and
        wellness practitioners. Whatever brought you here, we&rsquo;ll walk the
        next stretch with you.
      </p>
      <div className="scroll-hint" aria-hidden="true">
        <span className="scroll-hint__rail">
          <span className="scroll-hint__dot" />
        </span>
        <span>Scroll to walk the path</span>
      </div>
    </>
  );
}

export default function Hero() {
  return (
    <div className="hero">
      <HeroCopy />
    </div>
  );
}
