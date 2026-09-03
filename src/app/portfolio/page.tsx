import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Rocket } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { getAllPortfolio, getSiteStats } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/portfolio", {
    title: "نمونه‌کارهای طراحی وب و اپلیکیشن | نکسا تک",
    description: "مشاهده نمونه‌کارهای تیم نکسا تک در زمینه طراحی وب‌سایت، اپلیکیشن و سئو.",
    keywords: ["نمونه کار", "پورتفولیو", "طراحی وب", "اپلیکیشن"],
  });
}

export default async function PortfolioPage() {
  const [items, stats] = await Promise.all([getAllPortfolio(), getSiteStats()]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0d1a] dark:text-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-20 right-1/4 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl animate-float" />
        <div className="pointer-events-none absolute top-10 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl animate-float-slow" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              مجموعه آثار ما
            </div>
            <h1 className="animate-fade-up mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              کارهایی که به آن‌ها{" "}
              <span className="text-gradient bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500">
                افتخار می‌کنیم
              </span>
            </h1>
            <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              هر پروژه داستانی از اعتماد، خلاقیت و تلاش است. روی هر نمونه‌کار می‌توانید دموی زنده و
              پیش‌نمایش واقعی آن را مشاهده کنید.
            </p>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { value: `${formatNumber(stats.projects)}+`, label: "پروژه تحویل‌شده" },
              { value: `${formatNumber(stats.clients)}+`, label: "مشتری راضی" },
              { value: `${formatNumber(stats.years)}+`, label: "سال تجربه" },
            ].map((s) => (
              <div key={s.label} className="rounded-3xl border border-slate-200 bg-white/70 p-5 text-center backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="text-gradient bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-2xl font-extrabold sm:text-4xl">{s.value}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <PortfolioGrid items={items} />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center text-white sm:px-16">
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
              <Rocket className="h-4 w-4" />
              پروژه بعدی شما
            </span>
            <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              دوست دارید پروژه شما هم جزو آثار ما باشد؟
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              همین حالا سفارش خود را ثبت کنید تا با هم یک تجربه دیجیتال بی‌نظیر بسازیم.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/order"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-indigo-600 shadow-xl transition-transform hover:scale-105"
              >
                ثبت سفارش پروژه
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                مشاوره رایگان
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
