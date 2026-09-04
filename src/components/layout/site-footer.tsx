import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";
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
  ].filter((social) => social.href) as { href: string; icon: (props: { className?: string }) => React.ReactNode; label: string }[];

  return <footer className="border-t border-base-content/10 bg-base-200/60"><Container className="py-14 sm:py-16"><div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]"><div><Logo /><p className="mt-5 max-w-xs text-sm leading-7 text-base-content/60">{config.footerAbout}</p><div className="mt-5 flex gap-2">{socials.map(({ href, icon: Icon, label }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="btn btn-square btn-sm border-0 bg-base-100 text-base-content/55 hover:bg-primary hover:text-primary-content"><Icon className="h-4 w-4" /></a>)}</div></div><div><h3 className="font-bold">دسترسی سریع</h3><ul className="mt-4 space-y-3 text-sm text-base-content/60">{[{ href: "/portfolio", label: "نمونه‌کارها" }, { href: "/blog", label: "وبلاگ" }, { href: "/courses", label: "دوره‌های آموزشی" }, { href: "/about", label: "درباره ما" }, { href: "/order", label: "سفارش پروژه" }].map((link) => <li key={link.href}><Link href={link.href} className="transition-colors hover:text-primary">{link.label}</Link></li>)}</ul></div><div><h3 className="font-bold">خدمات</h3><ul className="mt-4 space-y-3 text-sm text-base-content/60">{services.length > 0 ? services.map((service) => <li key={service.id}>{service.title}</li>) : <><li>طراحی وب‌سایت</li><li>توسعه اپلیکیشن</li><li>سئو و بهینه‌سازی</li></>}</ul></div><div><h3 className="font-bold">در تماس باشید</h3><ul className="mt-4 space-y-4 text-sm text-base-content/60"><li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-primary" /><span dir="ltr">{phone}</span></li><li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-primary" /><span dir="ltr">{email}</span></li><li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{address}</span></li></ul></div></div><div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-base-content/10 pt-6 text-xs text-base-content/45 sm:flex-row"><p>© {new Date().getFullYear()} {config.copyright}</p><Link href="/admin" className="hover:text-primary">ورود مدیریت</Link></div></Container></footer>;
}
