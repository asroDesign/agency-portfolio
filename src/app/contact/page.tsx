import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { getSettingsMap } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/contact", {
    title: "تماس با ما | نکسا تک",
    description: "راه‌های ارتباط با تیم نکسا تک.",
    keywords: ["تماس با ما", "پشتیبانی"],
  });
}

export default async function ContactPage() {
  const map = await getSettingsMap();
  const phone = map.get("contact_phone") ?? "021-88776655";
  const mobile = map.get("contact_mobile") ?? "0912-345-6789";
  const email = map.get("contact_email") ?? "hello@nexatech.ir";
  const address = map.get("contact_address") ?? "تهران، ایران";

  const info = [
    { icon: Phone, title: "تلفن", lines: [phone, mobile] },
    { icon: Mail, title: "ایمیل", lines: [email] },
    { icon: MapPin, title: "آدرس", lines: [address] },
    { icon: Clock, title: "ساعات کاری", lines: ["شنبه تا پنجشنبه", "۹ صبح تا ۶ عصر"] },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0d1a] dark:text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">تماس با ما</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            سوالی دارید یا می‌خواهید درباره پروژه‌تان صحبت کنید؟ ما همیشه آماده پاسخگویی هستیم.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {info.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20">
                  <item.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  {item.lines.map((l) => (
                    <p key={l} dir="auto" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/5 lg:col-span-3">
            <h2 className="text-xl font-bold">برای ما پیام بفرستید</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              فرم زیر را پر کنید؛ معمولاً در کمتر از یک روز کاری پاسخ می‌دهیم.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
