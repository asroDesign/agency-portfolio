import type { Metadata } from "next";
import { ShieldCheck, Zap, BadgeCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrderForm } from "@/components/order-form";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/order", {
    title: "سفارش پروژه | نکسا تک",
    description: "ثبت سفارش پروژه طراحی وب‌سایت، اپلیکیشن یا سئو.",
    keywords: ["سفارش پروژه", "سفارش طراحی سایت"],
  });
}

export default function OrderPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page-main">
        <div className="page-intro">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">سفارش پروژه</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            جزئیات پروژه خود را ثبت کنید تا کارشناسان ما با شما تماس بگیرند و برنامه‌ریزی کنیم.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="order-2 space-y-4 lg:order-1">
            {[
              { icon: Zap, title: "پاسخ سریع", desc: "در کمتر از ۲۴ ساعت با شما تماس می‌گیریم." },
              { icon: ShieldCheck, title: "بدون تعهد", desc: "ثبت سفارش هیچ هزینه‌ای ندارد." },
              { icon: BadgeCheck, title: "مشاوره رایگان", desc: "بررسی نیازها و ارائه راهکار مناسب." },
            ].map((f) => (
              <div
                key={f.title}
                className="flex gap-4 soft-card rounded-3xl p-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                  <f.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-1 soft-card rounded-3xl p-7 lg:order-2 lg:col-span-2">
            <OrderForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
