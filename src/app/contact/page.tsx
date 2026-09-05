import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, Clock, Heart, Lightbulb, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { GithubIcon, InstagramIcon, LinkedinIcon, TelegramIcon } from "@/components/social-icons";
import { Container } from "@/components/ui";
import styles from "./contact.module.css";
import contactIllustration from "@/app/uploads/contact-vec.png";
import { getSettingsMap } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/contact", {
    title: "تماس با ما | تیم برنامه نویسی آسرو",
    description: "راه‌های ارتباط با تیم برنامه نویسی آسرو.",
    keywords: ["تماس با ما", "پشتیبانی"],
  });
}

export default async function ContactPage() {
  const map = await getSettingsMap();
  const phone = map.get("contact_phone") ?? "021-88776655";
  const mobile = map.get("contact_mobile") ?? "0912-345-6789";
  const email = map.get("contact_email") ?? "hello@asro.dev";
  const address = map.get("contact_address") ?? "تهران، ایران";
  const socials = [
    { icon: InstagramIcon, label: "اینستاگرام", href: map.get("social_instagram") },
    { icon: TelegramIcon, label: "تلگرام", href: map.get("social_telegram") },
    { icon: LinkedinIcon, label: "لینکدین", href: map.get("social_linkedin") },
    { icon: GithubIcon, label: "گیت‌هاب", href: map.get("social_github") },
  ];
  const info = [
    { icon: Phone, title: "تلفن", lines: [phone, mobile] },
    { icon: Mail, title: "ایمیل", lines: [email] },
    { icon: MapPin, title: "آدرس", lines: [address] },
    { icon: Clock, title: "ساعات کاری", lines: ["شنبه تا پنجشنبه", "۹ صبح تا ۶ عصر"] },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_8%_25%,#e8f9fc,transparent_35%),linear-gradient(180deg,#f8fdff,#edf9fd)] text-base-content">
      <SiteHeader />
      <main>
        <section className={`relative z-10 isolate ${styles.section}`}>
          <Container className={styles.composition}>
            <div className="mx-auto max-w-5xl text-center">
              <p className="section-kicker justify-center">تماس با ما</p>
              <h1 className="mt-3 text-4xl font-black leading-[1.3] tracking-tight sm:text-5xl lg:text-6xl">
                بیایید <span className="text-primary">صحبت کنیم!</span>
              </h1>
              <p className="mx-auto mt-3 max-w-3xl text-base leading-8 text-base-content/65 sm:text-lg">
                برای پروژه جدید، مشاوره یا هر سوالی که دارید، خوشحال می‌شویم از شما بشنویم. تیم ما آماده پاسخگویی است.
              </p>
            </div>

            <div className={styles.gridRegion}>
              <svg aria-hidden="true" viewBox="0 0 260 180" className={styles.leaves} fill="none">
                <defs><linearGradient id="contact-leaf" x2="1" y2="1"><stop stopColor="#b9efdd"/><stop offset="1" stopColor="#69cdbb"/></linearGradient></defs>
                <path d="M88 178C22 140 18 77 55 17c55 45 57 99 33 161ZM94 178C76 103 132 52 197 46c-2 76-49 127-103 132ZM108 178c24-53 80-63 127-36-31 42-81 54-127 36Z" fill="url(#contact-leaf)"/>
                <path d="M88 178 55 37m39 141 90-113m-76 113 109-32" stroke="#e0fff1" strokeOpacity=".65"/>
              </svg>
              <div className={styles.note}>
                هر گفت‌وگوی خوب
                <br />
                یک پروژه عالی می‌سازد.
                <span className="absolute -right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 rotate-12 items-center justify-center rounded-full bg-blue-100 text-xl text-blue-500">
                  <Heart className="h-5 w-5 fill-current" />
                </span>
              </div>
              <div className={styles.columns}>
                <aside className={styles.info}>
                  <h2 className="sr-only">راه‌های ارتباطی</h2>
                  <div className={styles.infoRows}>
                    {info.map(({ icon: Icon, title, lines }) => (
                      <div key={title} className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-6 w-6" /></span>
                        <div className="min-w-0"><h3 className="font-bold">{title}</h3>{lines.map((line) => <p key={line} dir="auto" className="mt-1 text-sm leading-6 text-base-content/60">{line}</p>)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto border-t border-base-content/8 pt-6 text-center">
                    <p className="text-sm text-base-content/55">ما را در شبکه‌های اجتماعی دنبال کنید</p>
                    <div className="mt-4 flex justify-center gap-3 text-base-content/55">
                      {socials.map(({ icon: Icon, label, href }) => href ? (
                        <a key={label} href={href} aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-primary/10 hover:text-primary"><Icon className="h-5 w-5" /></a>
                      ) : (
                        <span key={label} aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100"><Icon className="h-5 w-5" /></span>
                      ))}
                    </div>
                  </div>
                </aside>

                <section className={styles.formCard} aria-labelledby="contact-form-heading">
                  <div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></span><div><h2 id="contact-form-heading" className="text-xl font-extrabold">برای ما پیام بفرستید</h2><p className="mt-1 text-sm text-base-content/55">معمولاً در کمتر از یک روز کاری پاسخ می‌دهیم.</p></div></div>
                  <div className={styles.formBody}><ContactForm /></div>
                </section>

                <aside className={styles.visual}>
                  <div className={styles.illustration}>
                    <Image src={contactIllustration} alt="تصویرسازی ارتباط با تیم برنامه نویسی آسرو" unoptimized priority sizes="(min-width: 1024px) 30vw, 100vw" className={styles.image} />
                  </div>
                  <div className={styles.cta}>
                    <h2 className="text-2xl font-black leading-relaxed">پروژه بعدی شما<br />از یک گفت‌وگو شروع می‌شود.</h2>
                    <p className="mt-3 text-sm leading-7 text-base-content/65">ما اینجا هستیم تا ایده‌های شما را به واقعیت تبدیل کنیم.</p>
                    <a href="#contact-form-heading" className={styles.consultation}><span className={styles.actionIcon}><Lightbulb className="h-6 w-6" /></span><span>مشاوره رایگان<small>برای ایده‌های جدید</small></span><span className={styles.actionIcon}><ArrowLeft className="h-5 w-5" /></span></a>
                  </div>
                </aside>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
