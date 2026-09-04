import { Gauge, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui";

const strengths = [
  { icon: Rocket, title: "تحویل سریع و شفاف", desc: "با برنامه‌ریزی دقیق، هر مرحله و زمان تحویل برای شما روشن است." },
  { icon: Gauge, title: "نتایج قابل اندازه‌گیری", desc: "تصمیم‌های ما بر پایه داده و هدف‌های واقعی کسب‌وکار شماست." },
  { icon: ShieldCheck, title: "همراهی ماندگار", desc: "پشتیبانی و بهبود محصول بعد از انتشار هم بخشی از همکاری ماست." },
  { icon: Sparkles, title: "کیفیت در جزئیات", desc: "کد تمیز، طراحی دقیق و تجربه‌ای که اعتماد کاربران را جلب می‌کند." },
];

export function WhyChooseUsSection() {
  return (
    <section className="section-shell bg-base-100">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="section-kicker">چرا نکسا تک؟</p>
            <h2 className="mt-3 max-w-lg text-3xl font-black leading-tight sm:text-4xl">
              فراتر از یک آژانس؛ شریک بلندمدت شما
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-sm leading-7 text-base-content/65 sm:text-base">
              خلاقیت، فناوری و استراتژی را کنار هم می‌گذاریم تا نتیجه‌ای قابل‌اندازه‌گیری و یک همکاری معنادار شکل بگیرد.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {strengths.map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-base-content">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
