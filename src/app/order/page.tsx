import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Zap, Headphones, Mail, Clock, MapPin, Quote } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrderForm } from "@/components/order-form";
import { buildMetadata } from "@/lib/seo";
import { getSettingsMap } from "@/lib/data";
import { Container } from "@/components/ui";
import orderIllustration from "@/app/uploads/order-vec.png";
import styles from "./order.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/order", {
    title: "سفارش پروژه | تیم برنامه نویسی آسرو",
    description: "ثبت سفارش پروژه طراحی وب‌سایت، اپلیکیشن یا سئو.",
    keywords: ["سفارش پروژه", "سفارش طراحی سایت"],
  });
}

export default async function OrderPage() {
  const settings = await getSettingsMap();
  return (
    <div className={`page-shell ${styles.page}`}>
      <SiteHeader />
      <main className={styles.main}>
        {[styles.leftLeaves, styles.rightLeaves].map(position => <svg key={position} aria-hidden="true" viewBox="0 0 160 210" fill="none" className={`${styles.edgeLeaves} ${position}`}><path d="M79 207C8 177 0 87 35 12c55 49 70 119 44 195Z" fill="currentColor" /><path d="M80 207c-8-72 26-123 76-144 10 69-21 126-76 144Z" fill="currentColor" /><path d="M79 207 36 31m44 176 65-125" stroke="#d9fff0" strokeWidth="1.5" /></svg>)}
        <Container>
        <div className={styles.hero} dir="rtl">
          <p className="section-kicker">سفارش پروژه</p>
          <h1 className="mt-4 text-3xl font-black leading-relaxed tracking-tight sm:text-4xl">ایده‌هات را به <span className="text-primary">واقعیت</span> تبدیل کنیم</h1>
          <p className={styles.subtitle}>
            جزئیات پروژه خود را برای ما ارسال کنید تا کارشناسان ما با شما تماس بگیرند و بهترین راهکار را پیشنهاد دهند.
          </p>
        </div>

        <div className={styles.composition}>
          <aside className={styles.sidebar}>
            <div className={styles.illustration}>
              <Image src={orderIllustration} alt="تصویرسازی سفارش پروژه؛ طراحی و توسعه با همکاری شما" priority unoptimized sizes="(min-width: 1024px) 35vw, 100vw" className={styles.image} />
            </div>
            <div className={styles.benefits}>
            {[
              { icon: Zap, title: "پاسخ سریع", desc: "در کمتر از ۲۴ ساعت با شما تماس می‌گیریم." },
              { icon: ShieldCheck, title: "بدون تعهد", desc: "ثبت سفارش هیچ هزینه‌ای ندارد." },
              { icon: Headphones, title: "مشاوره رایگان", desc: "بررسی نیازها و ارائه راهکار مناسب." },
            ].map((f) => (
              <div
                key={f.title}
                className={styles.benefit}
              >
                <span className={styles.benefitIcon}>
                  <f.icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
            </div>
            <div className={styles.quote}>
              <span className={styles.quoteIcon}><Quote aria-hidden="true" className="h-7 w-7 fill-current" /></span>
              <h2>هر پروژه،<br />داستانی جدید است.</h2>
              <p>ما اینجا هستیم تا ایده‌های شما را با تجربه و تخصص خود به محصولی موفق تبدیل کنیم.</p>
            </div>
          </aside>

          <section className={styles.formCard} aria-labelledby="order-form-heading">
            <div className={styles.formHeader}>
              <div><h2 id="order-form-heading">اطلاعات پروژه</h2><p>فرم زیر را تکمیل کنید تا در کوتاه‌ترین زمان با شما تماس بگیریم.</p></div>
              <span className={styles.mailIcon}><Mail aria-hidden="true" className="h-7 w-7" /></span>
            </div>
            <OrderForm />
          </section>
        </div>
        <div className={styles.contactStrip}>
          {[
            { icon: Mail, title: "ایمیل", lines: [settings.get("contact_email") ?? "hello@asro.dev"] },
            { icon: MapPin, title: "آدرس", lines: [settings.get("contact_address") ?? "تهران، ایران"] },
            { icon: Clock, title: "ساعات کاری", lines: ["شنبه تا پنجشنبه", "۹ صبح تا ۶ عصر"] },
          ].map(({ icon: Icon, title, lines }) => <div key={title} className={styles.contactItem}><div><h3>{title}</h3>{lines.map(line => <p key={line} dir="auto">{line}</p>)}</div><span className={styles.mailIcon}><Icon aria-hidden="true" className="h-6 w-6" /></span></div>)}
        </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
