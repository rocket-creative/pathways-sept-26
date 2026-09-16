/**
 * A gap the client still owes. Loud in development, inert in production, and
 * valid in both block and inline positions because `mark` and `span` are both
 * phrasing content.
 */
export default function Needs({ value }: { value: string }) {
  if (process.env.NODE_ENV === "production") {
    return <span className="needs" data-needs={value} hidden />;
  }

  return (
    <mark className="needs" data-needs={value}>
      [NEEDS: {value}]
    </mark>
  );
}
