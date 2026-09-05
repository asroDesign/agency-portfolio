import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  Eye,
  PlayCircle,
  ShoppingBag,
  Code2,
  Home,
  ChevronLeft,
  Star,
  Calendar,
  RefreshCw,
  ShieldCheck,
  Tag,
  MonitorSmartphone,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PurchaseBox } from "@/components/purchase-box";
import { TemplateGallery } from "@/components/template-gallery";
import { TemplateAllTabs } from "@/components/template-all-tabs";
import { TemplateCard } from "@/components/template-card";
import {
  getTemplateBySlug,
  getOwnedTemplateIds,
  getRelatedTemplates,
  getTemplateTutorials,
  getTemplateFaqs,
  getTemplateUpdates,
  getAnsweredQuestions,
  getAddonsForTemplate,
} from "@/lib/catalog";
import { getSession } from "@/lib/auth";
import { formatNumber, formatDate } from "@/lib/utils";
import styles from "@/components/ui/detail-page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);
  return { title: template?.title ?? "قالب", description: template?.description };
}

export default async function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);
  if (!template) notFound();

  const session = await getSession();
  const owned = session ? (await getOwnedTemplateIds(session.userId)).has(template.id) : false;

  const [related, tutorials, faqs, updates, userQuestions, addons] = await Promise.all([
    getRelatedTemplates(template.id, template.categoryId),
    getTemplateTutorials(template.id),
    getTemplateFaqs(template.id),
    getTemplateUpdates(template.id),
    getAnsweredQuestions(template.id),
    getAddonsForTemplate(template.id),
  ]);

  const canSubmitSupport = !!(session && (owned || template.price <= 0));

  const images = [template.coverUrl, ...(template.gallery ?? [])].filter(Boolean) as string[];

  const infoRows = [
    { icon: RefreshCw, label: "تاریخ بروزرسانی", value: formatDate(template.updatedAt) },
    { icon: Calendar, label: "تاریخ انتشار", value: formatDate(template.createdAt) },
    { icon: Tag, label: "دسته‌بندی", value: template.category },
    { icon: Code2, label: "تکنولوژی", value: template.technology ?? "—" },
    { icon: MonitorSmartphone, label: "مرورگرهای سازگار", value: template.compatibility ?? "همه مرورگرها" },
    { icon: Star, label: "امتیاز", value: template.ratingCount > 0 ? `${template.rating} از ${formatNumber(template.ratingCount)} رای` : "—" },
  ];

  return (
    <div className="page-shell">
      <SiteHeader />

      <main className={`site-container ${styles.main}`}>
        {/* Breadcrumb */}
        <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-7 text-slate-500">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-primary">
            <Home className="h-3.5 w-3.5" />
            خانه
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <Link href="/templates" className="hover:text-primary">
            فروشگاه قالب
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <span aria-current="page" className="break-words text-slate-600">{template.title}</span>
        </nav>

        <div className={`mt-6 ${styles.layout}`}>
          {/* Main content */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black leading-relaxed tracking-tight sm:text-3xl">{template.title}</h1>
              {template.version && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  نسخه {template.version}
                </span>
              )}
            </div>

            <div className="mt-5">
              <TemplateGallery images={images} title={template.title} />
            </div>

            {/* Info table */}
            <div className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
              {infoRows.map((row) => (
                <div key={row.label} className="flex items-center gap-3 bg-white p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <row.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 break-words">
                    <p className="text-xs text-slate-400">{row.label}</p>
                    <p className="text-sm font-semibold">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Unified tabs */}
            <div className="mt-6 soft-card rounded-3xl p-6">
              <TemplateAllTabs
                templateId={template.id}
                description={template.description}
                features={template.features ?? []}
                liveUrl={template.liveUrl}
                tutorials={tutorials}
                faqs={faqs}
                updates={updates}
                userQuestions={userQuestions}
                canSubmitSupport={canSubmitSupport}
                owned={owned}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-4">
              <div className="soft-card rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">قیمت</span>
                  {template.price > 0 ? (
                    <span className="text-2xl font-extrabold text-emerald-600">
                      {formatNumber(template.price)}
                      <span className="mr-1 text-xs font-normal text-slate-400">تومان</span>
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-emerald-500">رایگان</span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-y border-slate-100 py-4 text-center">
                  <div>
                    <p className="flex items-center justify-center gap-1 text-sm font-bold"><ShoppingBag className="h-3.5 w-3.5" />{formatNumber(template.sales)}</p>
                    <p className="text-[11px] text-slate-400">فروش</p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1 text-sm font-bold"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{template.rating}</p>
                    <p className="text-[11px] text-slate-400">امتیاز</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{template.version ?? "—"}</p>
                    <p className="text-[11px] text-slate-400">نگارش</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <PurchaseBox templateId={template.id} price={template.price} owned={owned} addons={addons} />
                  <div className="grid grid-cols-2 gap-2">
                    {template.liveUrl && (
                      <a href={template.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-primary/40 hover:text-primary">
                        <Eye className="h-4 w-4" /> پیش‌نمایش
                      </a>
                    )}
                    {template.demoUrl && (
                      <a href={template.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-primary/40 hover:text-primary">
                        <PlayCircle className="h-4 w-4" /> دموی زنده
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-emerald-500" /> قوانین استفاده</h4>
                  <ul className="mt-3 space-y-2 text-xs text-slate-500">
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-emerald-500" /> دانلود فایل بلافاصله بعد از خرید</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-emerald-500" /> پشتیبانی رایگان ۶ ماهه</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-emerald-500" /> به‌روزرسانی رایگان</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-emerald-500" /> ضمانت بازگشت وجه</li>
                  </ul>
                </div>

              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-extrabold">قالب‌های مرتبط</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
