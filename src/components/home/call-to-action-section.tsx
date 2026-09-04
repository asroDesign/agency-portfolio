import Link from "next/link";
import { ArrowLeft, MoveUpLeft } from "lucide-react";
import { Container } from "@/components/ui";

export function CallToActionSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return <section className="bg-base-100 pb-20 sm:pb-28"><Container><div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0d3442] via-[#0a5a69] to-primary px-6 py-16 text-center text-white shadow-xl sm:px-16 sm:py-20"><div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full border border-white/10" /><div className="pointer-events-none absolute -bottom-28 -right-10 h-80 w-80 rounded-full border border-white/10" /><p className="relative text-sm font-bold uppercase tracking-[0.18em] text-cyan-100/75">یک قدم تا شروع همکاری</p><h2 className="relative mx-auto mt-4 max-w-2xl text-3xl font-black sm:text-5xl">{title ?? "آماده‌اید پروژه بعدی خود را شروع کنید؟"}</h2>{subtitle && <p className="relative mx-auto mt-5 max-w-xl leading-8 text-cyan-50/85">{subtitle}</p>}<Link href="/order" className="btn relative mt-9 rounded-2xl border-0 bg-white px-7 text-[#075265] hover:bg-cyan-50">ثبت سفارش پروژه <ArrowLeft className="h-5 w-5" /></Link><MoveUpLeft className="absolute bottom-7 left-8 hidden h-14 w-14 rotate-[-25deg] text-white/20 sm:block" /></div></Container></section>;
}
