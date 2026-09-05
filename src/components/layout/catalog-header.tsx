import { ArrowLeft } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { Container } from "@/components/ui";
import { IllustrationRings } from "@/components/ui/illustration-rings";

export function CatalogHeader({ eyebrow, title, accent, description, target, action, illustration }: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  target: string;
  action: string;
  illustration: StaticImageData;
}) {
  return (
    <section className="relative z-10 isolate overflow-visible bg-[radial-gradient(circle_at_20%_45%,#d7f2f8,transparent_38%),linear-gradient(135deg,#f8fdff,#eaf7fc)] pb-24 pt-24 sm:pt-28">
      <Container>
        <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div>
            <p className="badge border-0 bg-primary/10 px-4 py-4 text-xs font-bold text-primary">{eyebrow}</p>
            <h1 className="mt-5 text-balance text-3xl font-black leading-[1.4] tracking-tight sm:text-4xl lg:text-5xl">
              {title} <span className="text-primary">{accent}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/65">{description}</p>
            <a href={target} className="btn btn-primary mt-7 rounded-xl border-0 px-6 shadow-none">
              {action} <ArrowLeft className="h-4 w-4" />
            </a>
          </div>
          <div className="relative isolate">
            <div className="pointer-events-none absolute inset-y-0 inset-x-[7%] -z-10">
              <IllustrationRings />
            </div>
            <Image src={illustration} alt="" priority sizes="(min-width: 1024px) 50vw, 100vw" className="mx-auto h-auto w-full max-w-[780px] object-contain" />
          </div>
        </div>
      </Container>
    </section>
  );
}
