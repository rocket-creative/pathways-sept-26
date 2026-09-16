import Link from "next/link";

export function ClosingCopy() {
  return (
    <>
      <h2>
        The path is <em>yours</em>. We&rsquo;ll walk it with you.
      </h2>
      <p>
        In person across Long Island and by telehealth throughout New York.
        Start with a free 15-minute consultation.
      </p>
      <Link href="/contact" className="pill pill--ghost">
        Start a conversation
        <span aria-hidden="true">→</span>
      </Link>
    </>
  );
}

export default function Closing() {
  return (
    <div className="closing">
      <ClosingCopy />
    </div>
  );
}
