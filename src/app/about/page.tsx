import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, ArrowLeft, Heart, Users, Star, Folder, Lightbulb, Gem, TrendingUp, Telescope } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui";
import { SectionArt } from "@/components/home/section-art";
import { IllustrationRings } from "@/components/ui/illustration-rings";
import aboutIllustration from "@/app/uploads/about-vec.png";
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

interface TeamMember { name: string; role: string; initials: string }

const values = [
  { icon: TrendingUp, title: "رشد پایدار", detail: "همراه در مسیر آینده", tone: "bg-sky-100 text-sky-500" },
  { icon: Users, title: "مشتری‌محوری", detail: "موفقیت شما، موفقیت ما", tone: "bg-emerald-100 text-emerald-500" },
  { icon: Gem, title: "کیفیت", detail: "در تمام جزئیات", tone: "bg-violet-100 text-violet-500" },
  { icon: Lightbulb, title: "نوآوری", detail: "همیشه یک قدم جلوتر", tone: "bg-amber-100 text-amber-500" },
];
const teamTones = ["bg-violet-100 text-violet-600", "bg-amber-100 text-amber-600", "bg-rose-100 text-rose-600", "bg-emerald-100 text-emerald-600"];

export default async function AboutPage() {
  const [map, stats] = await Promise.all([getSettingsMap(), getSiteStats()]);
  const title = map.get("about_title") ?? "تیمی از توسعه‌دهندگان عاشق خلق تجربه‌های دیجیتال";
  const description = map.get("about_description") ?? "";
  const mission = map.get("about_mission") ?? "";
  const vision = map.get("about_vision") ?? "";
  let team: TeamMember[] = [];
  try {
    const parsed: unknown = JSON.parse(map.get("team") ?? "[]");
    if (Array.isArray(parsed)) team = parsed.filter((member): member is TeamMember =>
      member && typeof member.name === "string" && typeof member.role === "string" && typeof member.initials === "string");
  } catch { team = []; }
  const metrics = [
    { value: stats.years, label: "سال تجربه", icon: Star, tone: "bg-sky-50 text-sky-500" },
    { value: stats.team, label: "متخصص", icon: Users, tone: "bg-violet-50 text-violet-500" },
    { value: stats.projects, label: "پروژه موفق", icon: Folder, tone: "bg-emerald-50 text-emerald-500" },
    { value: stats.clients, label: "مشتری راضی", icon: Heart, tone: "bg-rose-50 text-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_8%_25%,#e8f9fc,transparent_35%),linear-gradient(180deg,#f8fdff,#edf9fd)] text-base-content">
      <SiteHeader />
      <main>
        <section className="relative z-10 isolate overflow-visible pb-24 pt-24 sm:pt-28">
          <Container>
            <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div>
                <p className="section-kicker">درباره ما</p>
                <h1 className="mt-4 max-w-2xl text-balance text-3xl font-black leading-[1.5] tracking-tight sm:text-4xl">
                  {title.includes("خلق") ? <>{title.slice(0, title.indexOf("خلق"))}<span className="text-primary">{title.slice(title.indexOf("خلق"))}</span></> : title}
                </h1>
                {description && <p className="mt-4 text-sm leading-8 text-base-content/65 sm:text-base">{description}</p>}
                <dl className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {metrics.map(({ value, label, icon: Icon, tone }) => (
                    <div key={label} className={`flex items-center justify-between gap-3 rounded-2xl p-4 ${tone}`}>
                      <div><dd className="text-2xl font-black">{formatNumber(value)}+</dd><dt className="mt-1 text-xs text-base-content/60">{label}</dt></div>
                      <Icon aria-hidden="true" className="h-6 w-6 shrink-0" strokeWidth={1.8} />
                    </div>
                  ))}
                </dl>
              </div>
              <div className="relative isolate">
                <div className="pointer-events-none absolute inset-y-0 inset-x-[7%] -z-10">
                  <IllustrationRings />
                </div>
                <Image src={aboutIllustration} alt="لپ‌تاپ، کتاب‌ها و گیاهان؛ تصویرسازی تیم نکسا تک" unoptimized priority sizes="(min-width: 1024px) 50vw, 100vw" className="mx-auto h-auto w-full max-w-[780px] object-contain" />
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-6">
          <Container>
            <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
              <article className="rounded-3xl bg-white/85 p-6 sm:p-8">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-500"><Users aria-hidden="true" className="h-6 w-6" /></span><h2 className="text-xl font-extrabold">ما کی هستیم؟</h2></div>
                {description && <p className="mt-4 text-sm leading-8 text-base-content/65">{description}</p>}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {values.map(({ icon: Icon, title: label, detail, tone }) => (
                    <div key={label} className="rounded-2xl bg-base-100/60 px-2 py-4 text-center">
                      <span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full ${tone}`}><Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} /></span>
                      <h3 className="mt-3 text-sm font-bold">{label}</h3><p className="mt-1 text-xs leading-6 text-base-content/55">{detail}</p>
                    </div>
                  ))}
                </div>
              </article>
              <div className="grid gap-4 rounded-3xl bg-white/80 p-3">
                <article className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-l from-teal-50 to-cyan-50 p-5 sm:p-6">
                  <svg aria-hidden="true" viewBox="0 0 180 140" className="pointer-events-none absolute bottom-0 left-0 -z-10 w-40 opacity-35" fill="none"><path d="M0 140 57 68l28 30 32-49 63 91Z" fill="#b2e8de" /><path d="m24 140 72-110 73 110Z" fill="#67cfc0" /><path d="M96 30V8m0 0h24l-7 8 7 8H96" stroke="#22b5a4" strokeWidth="3" /></svg>
                  <div className="flex items-center gap-3"><Target aria-hidden="true" className="h-7 w-7 text-primary" /><h2 className="text-xl font-extrabold">ماموریت ما</h2></div>
                  <p className="mt-3 text-sm leading-8 text-base-content/65 sm:pl-24">{mission}</p>
                </article>
                <article className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-l from-sky-50 to-blue-50 p-5 sm:p-6">
                  <Telescope aria-hidden="true" className="pointer-events-none absolute bottom-2 left-3 -z-10 h-28 w-28 -rotate-12 text-sky-200/65" strokeWidth={1} />
                  <div className="flex items-center gap-3"><Eye aria-hidden="true" className="h-7 w-7 text-sky-500" /><h2 className="text-xl font-extrabold">چشم‌انداز ما</h2></div>
                  <p className="mt-3 text-sm leading-8 text-base-content/65 sm:pl-24">{vision}</p>
                </article>
              </div>
            </div>
          </Container>
        </section>

        {team.length > 0 && (
          <section className="pb-6" aria-labelledby="about-team-heading">
            <Container>
              <div className="flex flex-col gap-8 rounded-3xl bg-white/85 p-6 sm:p-8 xl:flex-row-reverse xl:items-center">
                <div className="shrink-0 xl:w-64"><h2 id="about-team-heading" className="text-2xl font-black">اعضای تیم</h2><p className="mt-3 text-sm leading-7 text-base-content/65">افراد بااستعدادی که پشت هر پروژه موفق هستند.</p><Link href="/contact" className="btn btn-ghost mt-4 rounded-xl bg-primary/10 text-primary">با تیم ما در تماس باشید <ArrowLeft className="h-4 w-4" /></Link></div>
                <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {team.map((member, index) => (
                    <article key={member.name} className="p-3 text-center">
                      <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/70 text-2xl font-bold ${teamTones[index % teamTones.length]}`}>{member.initials || member.name.charAt(0)}</div>
                      <h3 className="mt-3 text-base font-bold">{member.name}</h3><p className="mt-1 text-xs leading-6 text-base-content/60">{member.role}</p>
                    </article>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        <section className="pb-12 pt-2 sm:pb-16">
          <Container>
            <div className="relative isolate rounded-3xl bg-white/65 px-6 py-9 sm:px-10">
              <SectionArt variant="path" className="pointer-events-none absolute right-6 top-4 hidden w-40 opacity-70 xl:block" />
              <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-start">
                <div><h2 className="text-2xl font-black sm:text-3xl">می‌خواهید با ما کار کنید؟</h2><p className="mt-3 max-w-xl text-sm leading-7 text-base-content/65">همین امروز سفارش پروژه خود را ثبت کنید و یک قدم به حضور آنلاین قدرتمند نزدیک‌تر شوید.</p></div>
                <Link href="/order" className="btn btn-primary shrink-0 rounded-xl border-0 px-7 shadow-none">ثبت سفارش <ArrowLeft className="h-4 w-4" /></Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
