import type { Metadata } from "next";
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
    <div className="page-shell">
      <SiteHeader />
      <main className="page-main">
        <div className="page-intro">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">فروشگاه قالب</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            قالب‌های آماده و حرفه‌ای برای وب‌سایت شما — خرید آسان، نصب سریع و پشتیبانی کامل.
          </p>
        </div>

        <div className="mt-12">
          <TemplatesGrid templates={templates} categories={categories} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
