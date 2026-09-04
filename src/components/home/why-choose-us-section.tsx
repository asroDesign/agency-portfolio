import { Gauge, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui";

const strengths = [
  { icon: Rocket, title: "تحویل سریع و شفاف", desc: "با برنامه‌ریزی دقیق، هر مرحله و زمان تحویل برای شما روشن است." },
  { icon: Gauge, title: "نتایج قابل اندازه‌گیری", desc: "تصمیم‌های ما بر پایه داده و هدف‌های واقعی کسب‌وکار شماست." },
  { icon: ShieldCheck, title: "همراهی ماندگار", desc: "پشتیبانی و بهبود محصول بعد از انتشار هم بخشی از همکاری ماست." },
  { icon: Sparkles, title: "کیفیت در جزئیات", desc: "کد تمیز، طراحی دقیق و تجربه‌ای که اعتماد کاربران را جلب می‌کند." },
];

export function WhyChooseUsSection() {
  return <section className="section-shell bg-[#0d202d] text-white"><Container><div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-end"><div><p className="section-kicker text-primary">چرا نکسا تک؟</p><h2 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">تکنولوژی را به مزیت رقابتی تبدیل می‌کنیم.</h2><p className="mt-5 max-w-md leading-8 text-slate-300">تیم ما ترکیبی از استراتژی، طراحی و مهندسی است؛ برای ساخت محصولی که فقط زیبا نباشد، واقعاً کار کند.</p></div><div className="grid gap-4 sm:grid-cols-2">{strengths.map(({ icon: Icon, title, desc }, index) => <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-primary/40 hover:bg-primary/[0.06]"><div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Icon className="h-6 w-6" /></span><span className="text-sm font-bold text-white/25">۰{index + 1}</span></div><h3 className="mt-6 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{desc}</p></div>)}</div></div></Container></section>;
}
