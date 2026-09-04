export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "right",
}: {
  eyebrow?: string;
  title?: string | null;
  subtitle?: string | null;
  align?: "right" | "center";
}) {
  if (!title && !subtitle) return null;
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`section-kicker ${centered ? "justify-center" : ""}`}>{eyebrow}</p>}
      {title && <h2 className="mt-4 text-3xl font-black tracking-tight text-base-content sm:text-4xl lg:text-[2.8rem]">{title}</h2>}
      {subtitle && <p className="mt-4 text-base leading-8 text-base-content/65 sm:text-lg">{subtitle}</p>}
    </div>
  );
}
