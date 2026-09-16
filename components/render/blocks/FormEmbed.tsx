import { FORM_EMBEDS } from "@/lib/content";

/**
 * The two Trust Driven Care iframes, used exactly as the client already runs
 * them. The sizes reserve layout so the embed cannot shift the page as it
 * loads; they are the widget defaults and want confirming against the live
 * Squarespace embeds.
 */
const FORM_META: Record<keyof typeof FORM_EMBEDS, { title: string; width: number; height: number }> =
  {
    therapy: { title: "Therapy intake form", width: 740, height: 900 },
    wellness: { title: "Wellness intake form", width: 740, height: 900 },
  };

export default function FormEmbed({
  variant,
  eager,
}: {
  variant: keyof typeof FORM_EMBEDS;
  eager: boolean;
}) {
  const { title, width, height } = FORM_META[variant];

  return (
    <iframe
      className="form-embed"
      src={FORM_EMBEDS[variant]}
      title={title}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      data-form={variant}
    />
  );
}
