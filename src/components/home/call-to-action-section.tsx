import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui";
import { SectionArt } from "./section-art";

export function CallToActionSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return (
    <section className="bg-base-100 pb-16 sm:pb-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-l from-cyan-50 to-sky-100/60 px-6 py-12 text-base-content sm:px-10 sm:py-14">
          <SectionArt variant="path" />
          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold tracking-wide text-primary">بیایید با هم کار کنیم</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">{title ?? "آماده‌اید ایده‌تان را زنده کنیم؟"}</h2>
              {subtitle && <p className="mt-3 text-sm leading-7 text-base-content/65">{subtitle}</p>}
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link href="/order" className="btn btn-primary rounded-xl border-0 px-6 shadow-none">شروع پروژه <ArrowLeft className="h-4 w-4" /></Link>
              <Link href="/contact" className="btn btn-outline rounded-xl border-primary/20 bg-white/60 px-6 text-base-content shadow-none hover:border-primary hover:bg-white">تماس با ما</Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
