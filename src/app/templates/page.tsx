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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0d1a] dark:text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">فروشگاه قالب</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
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
