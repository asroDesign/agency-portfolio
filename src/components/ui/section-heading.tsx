export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "right",
  compact = false,
}: {
  eyebrow?: string;
  title?: string | null;
  subtitle?: string | null;
  align?: "right" | "center";
  compact?: boolean;
}) {
  if (!title && !subtitle) return null;
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`section-kicker ${centered ? "justify-center" : ""}`}>{eyebrow}</p>}
      {title && <h2 className={`${compact ? "mt-1.5" : "mt-3"} text-3xl font-black leading-tight tracking-tight text-base-content sm:text-4xl`}>{title}</h2>}
      {subtitle && <p className={`${compact ? "mt-1.5" : "mt-3"} text-sm leading-7 text-base-content/65 sm:text-base`}>{subtitle}</p>}
    </div>
  );
}
