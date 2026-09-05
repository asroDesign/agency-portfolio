import type { Metadata } from "next";
import templatesIllustration from "@/app/uploads/templates-vec.png";
import { CatalogHeader } from "@/components/layout/catalog-header";
import { Container } from "@/components/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TemplatesGrid } from "@/components/templates-grid";
import { getPublishedTemplates, getTemplateCategories } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/templates", {
    title: "فروشگاه قالب وب‌سایت | نکسا تک",
    description: "خرید قالب‌های آماده وب‌سایت با کیفیت بالا و پشتیبانی کامل.",
    keywords: ["قالب وب سایت", "قالب فروشگاهی", "خرید قالب"],
  });
}

export default async function TemplatesPage() {
  const [templates, categories] = await Promise.all([
    getPublishedTemplates(),
    getTemplateCategories(),
  ]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <SiteHeader />
      <main>
        <CatalogHeader eyebrow="فروشگاه قالب" title="فروشگاه" accent="قالب"
          description="قالب‌های آماده و حرفه‌ای برای وب‌سایت شما — خرید آسان، نصب سریع و پشتیبانی کامل."
          target="#templates-list" action="مشاهده قالب‌ها" illustration={templatesIllustration} />

        <section id="templates-list" aria-labelledby="templates-heading" className="section-shell scroll-mt-20 bg-[#edf7fd]">
          <Container>
            <p className="section-kicker">قالب‌های آماده</p>
            <h2 id="templates-heading" className="mt-2 text-2xl font-black sm:text-3xl">همه قالب‌ها</h2>
            <div className="mt-7"><TemplatesGrid templates={templates} categories={categories} /></div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
