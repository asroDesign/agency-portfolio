import { Gauge, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui";

const strengths = [
  {
    icon: Rocket,
    title: "تحویل سریع و شفاف",
    desc: "با برنامه‌ریزی دقیق، هر مرحله و زمان تحویل برای شما روشن است.",
    tone: "bg-cyan-100 text-cyan-600",
  },
  {
    icon: Gauge,
    title: "نتایج قابل اندازه‌گیری",
    desc: "تصمیم‌های ما بر پایه داده و هدف‌های واقعی کسب‌وکار شماست.",
    tone: "bg-violet-100 text-violet-600",
  },
  {
    icon: ShieldCheck,
    title: "همراهی ماندگار",
    desc: "پشتیبانی و بهبود محصول بعد از انتشار هم بخشی از همکاری ماست.",
    tone: "bg-amber-100 text-amber-600",
  },
  {
    icon: Sparkles,
    title: "کیفیت در جزئیات",
    desc: "کد تمیز، طراحی دقیق و تجربه‌ای که اعتماد کاربران را جلب می‌کند.",
    tone: "bg-emerald-100 text-emerald-600",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="section-shell why-section relative isolate overflow-hidden">
      <Container>
        <div className="grid gap-12 xl:grid-cols-[0.85fr_1.45fr] xl:items-center xl:gap-12">
          <div className="text-right">
            <p className="badge border-0 bg-primary/10 px-5 py-5 font-bold text-primary">چرا نکسا تک؟</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black leading-[1.35] tracking-tight sm:text-4xl">
              فراتر از یک آژانس؛ <span className="text-primary">شریک بلندمدت</span> شما
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-base-content/65 sm:text-base">
              خلاقیت، فناوری و استراتژی را کنار هم می‌گذاریم تا نتیجه‌ای قابل‌اندازه‌گیری و یک همکاری معنادار شکل بگیرد.
            </p>
          </div>

          <div className="relative py-8 sm:py-12">
            <svg aria-hidden="true" viewBox="0 0 1000 360" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full text-sky-300/65 lg:block">
              <path d="M70 170 Q190 40 320 155 T570 155 T820 155 L950 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 7" />
              <circle cx="245" cy="124" r="6" fill="#6ee7b7" />
              <circle cx="500" cy="180" r="6" fill="#c4b5fd" />
              <circle cx="755" cy="129" r="6" fill="#7dd3fc" />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 180 240" className="pointer-events-none absolute -left-10 -top-12 -z-10 hidden w-44 text-teal-300/30 lg:block">
              <path d="M125 225C8 190 0 102 9 70c87 8 124 71 116 155Z" fill="currentColor" />
              <path d="M125 225C69 132 76 36 104 5c72 55 74 128 21 220Z" fill="currentColor" />
              <path d="m125 225-21-204m21 204L26 87" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="relative grid gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5">
              {strengths.map(({ icon: Icon, title, desc, tone }, index) => (
                <article
                  key={title}
                  className="why-benefit group relative flex min-h-72 flex-col items-center bg-white px-5 pb-12 pt-9 text-center lg:even:translate-y-6"
                >
                  <span className={`flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-white/60 to-transparent ${tone}`}>
                    <Icon className="h-10 w-10" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-base font-extrabold leading-7 text-base-content">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-base-content/60">{desc}</p>
                  <span className={`absolute -bottom-4 flex h-12 w-12 items-center justify-center rounded-full border-[6px] border-white text-sm font-black ${tone}`}>
                    {new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2 }).format(index + 1)}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
