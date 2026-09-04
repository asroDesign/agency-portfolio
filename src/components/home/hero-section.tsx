import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, CheckCircle2, Sparkles } from "lucide-react";
import { getSiteStats } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Container } from "@/components/ui";
import { ParticleBackground } from "./particle-background";

export async function HeroSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const stats = await getSiteStats();

  return (
    <section className="relative isolate overflow-hidden bg-[#091521] text-white">
      <ParticleBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(31,164,181,0.19),transparent_32%),linear-gradient(120deg,rgba(9,21,33,0.98),rgba(9,21,33,0.86)_58%,rgba(7,35,46,0.92))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7fafc] to-transparent opacity-10" />

      <Container className="relative">
        <div className="grid min-h-[680px] items-center gap-16 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-content/90">
              <Sparkles className="h-4 w-4 text-primary" />
              تیم برنامه‌نویسان حرفه‌ای نکسا تک
            </div>
            <h1 className="mt-7 text-4xl font-black leading-[1.2] tracking-tight sm:text-5xl lg:text-7xl">
              {title ?? (
                <>
                  ایده‌های شما را به <span className="text-primary">محصولات دیجیتال</span> خیره‌کننده تبدیل می‌کنیم
                </>
              )}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {subtitle ?? "طراحی وب‌سایت، توسعه اپلیکیشن و ارتقای سئو — همه زیر یک سقف. ما با ترکیب خلاقیت و تکنولوژی، تجربه‌ای می‌سازیم که کاربران شما عاشقش شوند."}
            </p>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link href="/order" className="btn btn-primary btn-lg rounded-2xl px-7 shadow-lg shadow-primary/20">
                شروع پروژه
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Link href="/portfolio" className="btn btn-ghost btn-lg rounded-2xl border border-white/15 px-7 text-white hover:bg-white/10 hover:text-white">
                مشاهده نمونه‌کارها
                <ArrowUpLeft className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              {["تحویل شفاف و قابل پیش‌بینی", "پشتیبانی واقعی پس از تحویل"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[380px] lg:block" aria-hidden="true">
            <div className="absolute inset-x-8 top-12 h-72 rounded-[2.5rem] border border-primary/20 bg-primary/[0.04] [transform:perspective(900px)_rotateY(-15deg)_rotateX(8deg)]" />
            <div className="absolute inset-x-0 top-20 rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 shadow-2xl backdrop-blur-sm [transform:perspective(900px)_rotateY(-15deg)_rotateX(8deg)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-primary" /><i className="h-2.5 w-2.5 rounded-full bg-white/25" /><i className="h-2.5 w-2.5 rounded-full bg-white/25" /></div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">NEXA / DIGITAL SYSTEM</span>
              </div>
              <div className="grid grid-cols-[1fr_0.72fr] gap-4 pt-5">
                <div className="space-y-3"><div className="h-3 w-3/5 rounded-full bg-primary/60" /><div className="h-2 w-4/5 rounded-full bg-white/15" /><div className="h-2 w-2/3 rounded-full bg-white/10" /><div className="mt-8 h-28 rounded-2xl bg-gradient-to-br from-primary/30 to-cyan-300/5" /></div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"><div className="h-20 rounded-xl border border-primary/20 bg-primary/10" /><div className="mt-3 h-2 w-3/4 rounded-full bg-white/15" /><div className="mt-2 h-2 w-1/2 rounded-full bg-white/10" /></div>
              </div>
            </div>
            <div className="absolute -bottom-2 -left-7 rounded-2xl border border-primary/20 bg-[#0d2632]/95 p-4 shadow-xl backdrop-blur-sm [transform:perspective(900px)_rotateY(-15deg)_rotateX(8deg)]">
              <p className="text-xs text-slate-400">رشد تجربه کاربری</p><p className="mt-1 text-2xl font-black text-primary">+۸۶٪</p>
            </div>
          </div>
        </div>

        <div className="relative -mb-14 grid translate-y-1/2 grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-[#102433]/90 shadow-2xl shadow-black/20 backdrop-blur-md sm:grid-cols-4">
          {[
            { value: `${formatNumber(stats.projects)}+`, label: "پروژه موفق" },
            { value: `${formatNumber(stats.clients)}+`, label: "مشتری راضی" },
            { value: `${formatNumber(stats.years)}+`, label: "سال تجربه" },
            { value: `${formatNumber(stats.team)}+`, label: "متخصص خلاق" },
          ].map((stat) => <div key={stat.label} className="border-white/10 px-4 py-5 text-center sm:border-e last:border-e-0"><p className="text-2xl font-black text-primary sm:text-3xl">{stat.value}</p><p className="mt-1 text-xs text-slate-300 sm:text-sm">{stat.label}</p></div>)}
        </div>
      </Container>
    </section>
  );
}
