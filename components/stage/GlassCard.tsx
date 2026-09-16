import Link from "next/link";
import type { Stop } from "@/lib/stops";

type Props = Pick<Stop, "kicker" | "title" | "body" | "href" | "cta"> & {
  className?: string;
};

export default function GlassCard({
  kicker,
  title,
  body,
  href,
  cta,
  className = "",
}: Props) {
  return (
    <div className={`glass ${className}`.trim()}>
      <div className="glass__body">
        <p className="glass__kicker">{kicker}</p>
        <h3 className="glass__title">{title}</h3>
        <p className="glass__text">{body}</p>
        <Link href={href} className="glass__link">
          {cta}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
