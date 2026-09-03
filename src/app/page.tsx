import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  HeroSection,
  StatsSection,
  ServicesSection,
  PortfolioSection,
  CoursesSection,
  BlogSection,
  TestimonialsSection,
  TestimonialFormSection,
  CtaSection,
  WhyUsSection,
} from "@/components/home-sections";
import { getPageSections } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { PageSection } from "@/db/schema";

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

  function renderSection(s: PageSection) {
    switch (s.type) {
      case "hero":
        return <HeroSection key={s.id} title={s.title} subtitle={s.subtitle} />;
      case "stats":
        return <StatsSection key={s.id} />;
      case "services":
        return <ServicesSection key={s.id} title={s.title} subtitle={s.subtitle} />;
      case "portfolio":
        return (
          <PortfolioSection key={s.id} title={s.title} subtitle={s.subtitle} count={s.count} />
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
        return <CtaSection key={s.id} title={s.title} subtitle={s.subtitle} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0d1a] dark:text-white">
      <SiteHeader />
      {sections.map((s) => renderSection(s))}
      {sections.length > 0 && <WhyUsSection />}
      <SiteFooter />
    </div>
  );
}
