import type { Metadata } from "next";
import Image from "next/image";
import portfolioIllustration from "@/app/uploads/portfolio-vec.png";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { Container, SectionHeading } from "@/components/ui";
import { IllustrationRings } from "@/components/ui/illustration-rings";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { getAllPortfolio, getSiteStats } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/portfolio", {
    title: "نمونه‌کارهای طراحی وب و اپلیکیشن | تیم برنامه نویسی آسرو",
    description: "مشاهده نمونه‌کارهای تیم برنامه نویسی آسرو در زمینه طراحی وب‌سایت، اپلیکیشن و سئو.",
    keywords: ["نمونه کار", "پورتفولیو", "طراحی وب", "اپلیکیشن"],
  });
}

export default async function PortfolioPage() {
  const [items, stats] = await Promise.all([getAllPortfolio(), getSiteStats()]);
  const metrics = [
    { value: `${formatNumber(stats.projects)}+`, label: "پروژه تحویل‌شده" },
    { value: `${formatNumber(stats.clients)}+`, label: "مشتری راضی" },
    { value: `${formatNumber(stats.years)}+`, label: "سال تجربه" },
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <SiteHeader />
      <main>
        <section className="relative z-10 isolate overflow-visible bg-[radial-gradient(circle_at_20%_45%,#d7f2f8,transparent_38%),linear-gradient(135deg,#f8fdff,#eaf7fc)] pb-8 pt-24 sm:pb-12 sm:pt-28">
          <Container>
            <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div>
                <p className="badge border-0 bg-primary/10 px-4 py-4 text-xs font-bold text-primary">مجموعه آثار ما</p>
                <h1 className="mt-5 max-w-2xl text-balance text-3xl font-black leading-[1.4] tracking-tight sm:text-4xl lg:text-5xl">
                  کارهایی که به آن‌ها <span className="text-primary">افتخار می‌کنیم</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/65">
                  هر پروژه داستانی از اعتماد، خلاقیت و تلاش است. روی هر نمونه‌کار می‌توانید دموی زنده و
                  پیش‌نمایش واقعی آن را مشاهده کنید.
                </p>
                <a href="#portfolio-projects" className="btn btn-primary mt-7 rounded-xl border-0 px-6 shadow-none">
                  مشاهده نمونه‌کارها <ArrowLeft className="h-4 w-4" />
                </a>
                <dl className="mt-9 grid max-w-lg grid-cols-3 gap-5">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="min-w-0">
                      <dd className="text-2xl font-black text-primary sm:text-3xl">{metric.value}</dd>
                      <dt className="mt-2 text-xs leading-6 text-base-content/60">{metric.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="relative isolate">
                <div className="pointer-events-none absolute inset-y-0 inset-x-[7%] -z-10">
                  <IllustrationRings />
                </div>
                <Image src={portfolioIllustration} alt="" priority sizes="(min-width: 1024px) 50vw, 100vw" className="mx-auto h-auto w-full max-w-[780px] object-contain" />
              </div>
            </div>
          </Container>
          <ScrollIndicator target="#portfolio-projects" label="مشاهده نمونه‌کارها" />
        </section>

        <section id="portfolio-projects" aria-labelledby="portfolio-projects-heading" className="scroll-mt-20 bg-[#edf7fd] pb-[clamp(4rem,6vw,6.5rem)] pt-8 sm:pt-12">
          <Container>
            <p className="section-kicker">نمونه‌کارها</p>
            <h2 id="portfolio-projects-heading" className="mt-2 text-2xl font-black sm:text-3xl">پروژه‌های ما</h2>
            <div className="mt-7"><PortfolioGrid items={items} /></div>
          </Container>
        </section>

        <section className="section-shell">
          <Container>
            <div className="relative isolate overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-l from-cyan-50 to-sky-100/60 px-6 py-10 sm:p-10">
              <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
                <SectionHeading
                  eyebrow="پروژه بعدی شما"
                  title="دوست دارید پروژه شما هم جزو آثار ما باشد؟"
                  subtitle="همین حالا سفارش خود را ثبت کنید تا با هم یک تجربه دیجیتال بی‌نظیر بسازیم."
                  compact
                />
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Link href="/order" className="btn btn-primary rounded-xl border-0 px-6 shadow-none">
                    ثبت سفارش پروژه <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="btn btn-outline rounded-xl border-primary/20 bg-white/60 px-6 text-base-content shadow-none hover:border-primary hover:bg-white">
                    مشاوره رایگان
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
