import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Rocket,
  TrendingUp,
  ShieldCheck,
  Star,
  Quote,
} from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { PortfolioCard } from "@/components/portfolio-card";
import { CourseCard } from "@/components/course-card";
import { BlogCard } from "@/components/blog-card";
import { TestimonialForm } from "@/components/testimonial-form";
import { getServices, getFeaturedPortfolio, getSiteStats } from "@/lib/data";
import {
  getPublishedCourses,
  getFeaturedPosts,
  getApprovedTestimonials,
} from "@/lib/catalog";
import { formatNumber } from "@/lib/utils";

export async function HeroSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-40 left-10 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl animate-float" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300">
            <Sparkles className="h-4 w-4" />
            تیم برنامه‌نویسان حرفه‌ای نکسا تک
          </div>
          <h1 className="animate-fade-up mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            {title ? (
              title
            ) : (
              <>
                ایده‌های شما را به{" "}
                <span className="text-gradient bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500">
                  محصولات دیجیتال
                </span>{" "}
                خیره‌کننده تبدیل می‌کنیم
              </>
            )}
          </h1>
          {subtitle && (
            <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          )}
          <div className="animate-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/order"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-105"
            >
              شروع پروژه
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/60 px-7 py-3.5 text-base font-semibold text-slate-700 backdrop-blur transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
            >
              مشاهده نمونه‌کارها
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function StatsSection() {
  const stats = await getSiteStats();
  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { value: `${formatNumber(stats.projects)}+`, label: "پروژه موفق" },
          { value: `${formatNumber(stats.clients)}+`, label: "مشتری راضی" },
          { value: `${formatNumber(stats.years)}+`, label: "سال تجربه" },
          { value: `${formatNumber(stats.team)}+`, label: "عضو تیم" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-slate-200 bg-white/70 p-5 text-center backdrop-blur dark:border-white/10 dark:bg-white/5"
          >
            <div className="text-gradient bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-3xl font-extrabold sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function ServicesSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const services = await getServices();
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      {title && (
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle && <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
      )}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </section>
  );
}

export async function PortfolioSection({ title, subtitle, count = 6 }: { title?: string | null; subtitle?: string | null; count?: number }) {
  const items = await getFeaturedPortfolio();
  const shown = items.slice(0, count);
  if (shown.length === 0) return null;
  return (
    <section className="bg-white dark:bg-[#0a0c18]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            {title && <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>}
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-white/15 dark:text-slate-200"
          >
            همه نمونه‌کارها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export async function CoursesSection({ title, subtitle, count = 3 }: { title?: string | null; subtitle?: string | null; count?: number }) {
  const courses = await getPublishedCourses();
  const shown = courses.slice(0, count);
  if (shown.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          {title && <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>}
          {subtitle && <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-white/15 dark:text-slate-200"
        >
          همه دوره‌ها
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </section>
  );
}

export async function BlogSection({ title, subtitle, count = 3 }: { title?: string | null; subtitle?: string | null; count?: number }) {
  const posts = await getFeaturedPosts();
  const shown = posts.slice(0, count);
  if (shown.length === 0) return null;
  return (
    <section className="bg-white dark:bg-[#0a0c18]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            {title && <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>}
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-white/15 dark:text-slate-200"
          >
            همه مقالات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export async function TestimonialsSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const testimonials = await getApprovedTestimonials();
  if (testimonials.length === 0) return null;
  return (
    <section className="bg-white dark:bg-[#0a0c18]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          {title && <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>}
          {subtitle && <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t) => (
            <div
              key={t.id}
              className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"
            >
              <Quote className="h-8 w-8 text-indigo-500/30" />
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-white/10"}`}
                  />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">{t.content}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-white/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  {t.role && <p className="text-xs text-slate-400">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialFormSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
        {title && <h2 className="text-center text-2xl font-extrabold">{title}</h2>}
        {subtitle && <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        <div className="mt-6">
          <TestimonialForm />
        </div>
      </div>
    </section>
  );
}

export function CtaSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center text-white sm:px-16">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <h2 className="relative text-3xl font-extrabold sm:text-4xl">
          {title ?? "آماده‌اید پروژه بعدی خود را شروع کنید؟"}
        </h2>
        {subtitle && <p className="relative mx-auto mt-4 max-w-xl text-white/85">{subtitle}</p>}
        <Link
          href="/order"
          className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-indigo-600 shadow-xl transition-transform hover:scale-105"
        >
          ثبت سفارش پروژه
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

export function WhyUsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">چرا نکسا تک؟</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">دلایلی که مشتریان به ما اعتماد می‌کنند.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Rocket, title: "تحویل سریع", desc: "پروژه‌ها را در کوتاه‌ترین زمان و با بالاترین کیفیت تحویل می‌دهیم." },
          { icon: TrendingUp, title: "نتایج قابل‌اندازه‌گیری", desc: "با سئو هدفمند، رشد واقعی و ماندگار را برای شما رقم می‌زنیم." },
          { icon: ShieldCheck, title: "پشتیبانی ۲۴/۷", desc: "همیشه در کنار شما هستیم؛ قبل، حین و بعد از تحویل پروژه." },
          { icon: Star, title: "کیفیت برتر", desc: "کد تمیز، طراحی مدرن و تجربه کاربری بی‌نقص در هر پروژه." },
        ].map((f) => (
          <div key={f.title} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25">
              <f.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-bold">{f.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
