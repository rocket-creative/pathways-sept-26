/**
 * Gaps the client still owes, in chrome rather than page copy: visible in dev,
 * inert in production. Same convention as the renderer's marker so one grep of
 * `data-needs` in a production build finds every outstanding item.
 */
export default function Needs({ value }: { value: string }) {
  if (process.env.NODE_ENV === "production") {
    return <span data-needs={value} hidden />;
  }
  return <mark className="needs">[NEEDS: {value}]</mark>;
}
