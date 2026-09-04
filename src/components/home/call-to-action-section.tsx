import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui";

export function CallToActionSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return (
    <section className="bg-base-100 pb-16 sm:pb-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-l from-[#1182a7] to-[#0b4258] px-6 py-9 text-white shadow-lg sm:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_120%,rgba(86,219,244,0.45),transparent_40%)]" />
          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold tracking-wide text-cyan-200">بیایید با هم کار کنیم</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">{title ?? "آماده‌اید ایده‌تان را زنده کنیم؟"}</h2>
              {subtitle && <p className="mt-2 text-sm text-cyan-50/80">{subtitle}</p>}
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link href="/order" className="btn rounded-xl border-0 bg-white px-6 text-[#09617b] hover:bg-cyan-50">شروع پروژه <ArrowLeft className="h-4 w-4" /></Link>
              <Link href="/contact" className="btn rounded-xl border-white/30 bg-transparent px-6 text-white hover:bg-white/10">تماس با ما</Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
