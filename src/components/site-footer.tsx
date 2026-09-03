import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";
import { getSettingsMap, getSiteConfig, getServices } from "@/lib/data";
import { InstagramIcon, TelegramIcon, LinkedinIcon, GithubIcon } from "@/components/social-icons";

export async function SiteFooter() {
  const map = await getSettingsMap();
  const config = await getSiteConfig();
  const services = await getServices();

  const phone = map.get("contact_phone") ?? "021-88776655";
  const email = map.get("contact_email") ?? "hello@nexatech.ir";
  const address = map.get("contact_address") ?? "تهران، خیابان ولیعصر، برج فناوری، طبقه ۵";

  const socials = [
    { href: map.get("social_instagram"), icon: InstagramIcon, label: "اینستاگرام" },
    { href: map.get("social_telegram"), icon: TelegramIcon, label: "تلگرام" },
    { href: map.get("social_linkedin"), icon: LinkedinIcon, label: "لینکدین" },
    { href: map.get("social_github"), icon: GithubIcon, label: "گیت‌هاب" },
  ].filter((s) => s.href) as { href: string; icon: (p: { className?: string }) => React.ReactNode; label: string }[];

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#0a0c18]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {config.footerAbout}
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-indigo-500 hover:text-white dark:bg-white/5 dark:text-slate-400"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">دسترسی سریع</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/", label: "خانه" },
                { href: "/portfolio", label: "نمونه‌کارها" },
                { href: "/blog", label: "وبلاگ" },
                { href: "/courses", label: "دوره‌های آموزشی" },
                { href: "/templates", label: "فروشگاه قالب" },
                { href: "/about", label: "درباره ما" },
                { href: "/contact", label: "تماس با ما" },
                { href: "/order", label: "سفارش پروژه" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-500 transition-colors hover:text-indigo-500 dark:text-slate-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">خدمات</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              {services.length > 0 ? (
                services.map((s) => <li key={s.id}>{s.title}</li>)
              ) : (
                <>
                  <li>طراحی وب‌سایت</li>
                  <li>توسعه اپلیکیشن</li>
                  <li>سئو و بهینه‌سازی</li>
                  <li>فروشگاه اینترنتی</li>
                  <li>برندینگ و هویت بصری</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">تماس با ما</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-indigo-500" />
                <span dir="ltr">{phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
                <span dir="ltr">{email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-white/10 sm:flex-row">
          <p>© {new Date().getFullYear()} {config.copyright}</p>
          <Link href="/admin" className="transition-colors hover:text-indigo-500">
            ورود مدیریت
          </Link>
        </div>
      </div>
    </footer>
  );
}
