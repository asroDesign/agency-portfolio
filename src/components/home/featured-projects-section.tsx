import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFeaturedPortfolio } from "@/lib/data";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { Container, SectionHeading } from "@/components/ui";

export async function FeaturedProjectsSection({ title, subtitle, count = 6 }: { title?: string | null; subtitle?: string | null; count?: number }) {
  const projects = (await getFeaturedPortfolio()).slice(0, count);
  if (projects.length === 0) return null;
  return (
    <section id="work" className="section-shell bg-[#edf7fd]">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="کارهای منتخب"
              title={title ?? "پروژه‌هایی که به آن‌ها افتخار می‌کنیم"}
              subtitle={subtitle ?? "منتخبی از پروژه‌های اخیر ما که اشتیاق‌مان به طراحی دقیق و فناوری قابل اتکا را نشان می‌دهد."}
              compact
            />
          </div>
          <Link href="/portfolio" className="btn btn-outline w-fit shrink-0 rounded-xl border-primary/40 text-base-content hover:border-primary hover:bg-primary hover:text-primary-content">
            همه پروژه‌ها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => <PortfolioCard key={project.id} item={project} index={index} />)}
        </div>
      </Container>
    </section>
  );
}
