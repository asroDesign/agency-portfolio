import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  HeroSection,
  StatsSection,
  ServicesSection,
  FeaturedProjectsSection,
  CoursesSection,
  BlogSection,
  TestimonialsSection,
  TestimonialFormSection,
  CallToActionSection,
  WhyChooseUsSection,
} from "@/components/home";
import { getPageSections } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { PageSection } from "@/db/schema";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/", {
    title: "نکسا تک | طراحی وب‌سایت، اپلیکیشن و سئو",
    description: "تیم حرفه‌ای برنامه‌نویسان برای طراحی وب‌سایت، توسعه اپلیکیشن و ارتقای سئو.",
    keywords: ["طراحی سایت", "سئو", "اپلیکیشن", "فروشگاه اینترنتی"],
  });
}

export default async function HomePage() {
  const sections = await getPageSections();
  const renderedSections: ReactNode[] = [];
  const hasHero = sections.some((section) => section.type === "hero");
  let insertedWhy = false;

  function renderSection(s: PageSection) {
    switch (s.type) {
      case "hero":
        return <HeroSection key={s.id} title={s.title} subtitle={s.subtitle} />;
      case "stats":
        // The hero owns the compact stats strip; keep the standalone section as a
        // fallback for custom pages where the hero has been disabled.
        return hasHero ? null : <StatsSection key={s.id} />;
      case "services":
        return <ServicesSection key={s.id} title={s.title} subtitle={s.subtitle} />;
      case "portfolio":
        return (
          <FeaturedProjectsSection key={s.id} title={s.title} subtitle={s.subtitle} count={s.count} />
        );
      case "courses":
        return <CoursesSection key={s.id} title={s.title} subtitle={s.subtitle} count={s.count} />;
      case "blog":
        return <BlogSection key={s.id} title={s.title} subtitle={s.subtitle} count={s.count} />;
      case "testimonials":
        return <TestimonialsSection key={s.id} title={s.title} subtitle={s.subtitle} />;
      case "testimonial_form":
        return <TestimonialFormSection key={s.id} title={s.title} subtitle={s.subtitle} />;
      case "cta":
        return <CallToActionSection key={s.id} title={s.title} subtitle={s.subtitle} />;
      default:
        return null;
    }
  }

  for (const section of sections) {
    if (!insertedWhy && ["testimonials", "testimonial_form", "cta"].includes(section.type)) {
      renderedSections.push(<WhyChooseUsSection key="why-choose-us" />);
      insertedWhy = true;
    }
    renderedSections.push(renderSection(section));
  }
  if (sections.length > 0 && !insertedWhy) renderedSections.push(<WhyChooseUsSection key="why-choose-us" />);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0d1a] dark:text-white">
      <SiteHeader />
      {renderedSections}
      <SiteFooter />
    </div>
  );
}
