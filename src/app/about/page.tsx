import type { Metadata } from "next";
import Link from "next/link";
import { Target, Eye, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSettingsMap, getSiteStats } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/about", {
    title: "درباره ما | نکسا تک",
    description: "آشنایی با تیم نکسا تک؛ برنامه‌نویسان حرفه‌ای در زمینه وب‌سایت، اپلیکیشن و سئو.",
    keywords: ["درباره ما", "تیم برنامه نویسی"],
  });
}

interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

export default async function AboutPage() {
  const map = await getSettingsMap();
  const stats = await getSiteStats();

  const title = map.get("about_title") ?? "تیمی از توسعه‌دهندگان عاشق خلق تجربه‌های دیجیتال";
  const description = map.get("about_description") ?? "";
  const mission = map.get("about_mission") ?? "";
  const vision = map.get("about_vision") ?? "";

  let team: TeamMember[] = [];
  try {
    team = JSON.parse(map.get("team") ?? "[]");
  } catch {
    team = [];
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0d1a] dark:text-white">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl animate-float" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">درباره ما</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {title}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
                <h2 className="text-2xl font-bold">ما کی هستیم؟</h2>
                <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">{description}</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { value: `${formatNumber(stats.projects)}+`, label: "پروژه" },
                    { value: `${formatNumber(stats.clients)}+`, label: "مشتری" },
                    { value: `${formatNumber(stats.years)}+`, label: "سال تجربه" },
                    { value: `${formatNumber(stats.team)}+`, label: "متخصص" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-white/5"
                    >
                      <div className="text-gradient bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-2xl font-extrabold">
                        {s.value}
                      </div>
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
                    <Target className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold">ماموریت ما</h3>
                </div>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{mission}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white">
                    <Eye className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold">چشم‌انداز ما</h3>
                </div>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{vision}</p>
              </div>
            </div>
          </div>
        </section>

        {team.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">اعضای تیم</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                افراد بااستعدادی که پشت هر پروژه موفق هستند.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <div
                  key={m.name}
                  className="rounded-3xl border border-slate-200 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-2xl font-bold text-white shadow-lg shadow-indigo-500/25">
                    {m.initials}
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{m.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{m.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-white/5">
            <h2 className="text-2xl font-extrabold sm:text-3xl">می‌خواهید با ما کار کنید؟</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              همین امروز سفارش پروژه خود را ثبت کنید و یک قدم به حضور آنلاین قدرتمند نزدیک‌تر شوید.
            </p>
            <Link
              href="/order"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105"
            >
              ثبت سفارش
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
