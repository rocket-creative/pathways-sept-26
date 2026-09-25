import { FORM_EMBEDS } from "@/lib/content";

/**
 * The live Contact Us embed from pathwayswithin.me/contact. It already
 * routes into Trust Driven Care. Do not add a second form. The sizes reserve
 * layout so the embed cannot shift the page as it loads.
 */
const FORM_META: Record<keyof typeof FORM_EMBEDS, { title: string; width: number; height: number }> =
  {
    therapy: { title: "Contact the Welcome Team", width: 740, height: 900 },
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
