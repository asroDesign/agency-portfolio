import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpLeft, ChevronDown } from "lucide-react";
import heroVector from "@/app/uploads/hero-vector.png";
import { Container } from "@/components/ui";
import { getSiteStats } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { ParticleBackground } from "./particle-background";

export async function HeroSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const stats = await getSiteStats();
  const heroStats = [
    { value: `${formatNumber(stats.clients)}+`, label: "مشتری راضی" },
    { value: `${formatNumber(stats.projects)}+`, label: "پروژه تحویل‌شده" },
    { value: `${formatNumber(stats.years)}+`, label: "سال تجربه" },
  ];

  return (
    <section data-header-surface="light" className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#f8fdff_0%,#eef9fd_48%,#e5f5fb_100%)] text-base-content">
      <ParticleBackground
        particleCount={52}
        connectionDistance={185}
        interactionRadius={200}
        particleColor="#45bfd9"
        lineColor="#65c9dc"
        className="opacity-20"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_28%,rgba(54,190,218,0.16),transparent_30%),radial-gradient(circle_at_86%_78%,rgba(130,190,255,0.16),transparent_30%)]" />

      <Container className="relative">
        <div className="mx-auto grid min-h-[100svh] w-full max-w-[1500px] items-center gap-10 pb-24 pt-24 sm:pt-28 lg:grid-cols-[minmax(400px,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:pb-24 lg:pt-28 xl:gap-16">
          <div className="max-w-3xl lg:order-1">
            <span className="badge border-0 bg-primary/10 px-3 py-3 text-[11px] font-bold tracking-wide text-primary">
              آژانس خلاقیت و فناوری
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.18] tracking-tight text-neutral sm:text-5xl lg:text-6xl xl:text-[4.35rem]">
              {title ?? (
                <>
                  ایده‌هایی که <span className="text-primary">آینده را می‌سازند</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/65 sm:text-lg">
              {subtitle ?? "تجربه‌های دیجیتال طراحی می‌کنیم، محصولات قدرتمند می‌سازیم و به برندهای مدرن برای رشد کمک می‌کنیم."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/order" className="btn btn-primary rounded-xl px-6 shadow-lg shadow-primary/20">
                شروع پروژه
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link href="/portfolio" className="btn btn-outline rounded-xl border-base-content/20 bg-white/45 px-6 text-base-content hover:border-primary hover:bg-primary hover:text-primary-content">
                مشاهده نمونه‌کارها
                <ArrowUpLeft className="h-4 w-4" />
              </Link>
            </div>

            <dl className="mt-10 grid max-w-2xl grid-cols-3 border-y border-primary/15 py-4 sm:py-5">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex min-w-0 flex-col items-center gap-1 px-2 text-center sm:px-6">
                  <dd className="text-2xl font-black leading-none tracking-tight text-primary sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="text-[10px] font-medium leading-5 text-base-content/55 sm:text-xs">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto hidden min-h-[620px] w-full max-w-[780px] items-center justify-center lg:order-2 lg:flex">
            <div className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />
            <div className="absolute left-1/2 top-1/2 size-[410px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15" />
            <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/12" />
            <div className="absolute left-1/2 top-1/2 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
            <div className="absolute left-1/2 top-1/2 size-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/8" />
            <div className="absolute inset-x-8 bottom-8 top-8 rounded-full bg-primary/15 blur-3xl" />
            <Image
              src={heroVector}
              alt="تصویری از طراحی و توسعه یک محصول دیجیتال"
              priority
              unoptimized
              sizes="(min-width: 1536px) 820px, (min-width: 1024px) 48vw, 100vw"
              className="relative z-10 h-auto w-[min(780px,100%)] scale-[1.08] object-contain drop-shadow-[0_28px_55px_rgba(49,132,164,0.18)]"
            />
          </div>
        </div>
      </Container>

      <a href="#services" aria-label="رفتن به بخش خدمات" className="group absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-base-content/45 transition-colors hover:text-primary">
        <span className="relative h-8 w-5 rounded-full border border-current">
          <span className="animate-scroll-dot absolute inset-x-0 top-1.5 mx-auto h-1 w-1 rounded-full bg-current" />
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
