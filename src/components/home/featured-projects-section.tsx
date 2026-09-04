import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFeaturedPortfolio } from "@/lib/data";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { Container, SectionHeading } from "@/components/ui";

export async function FeaturedProjectsSection({ title, subtitle, count = 6 }: { title?: string | null; subtitle?: string | null; count?: number }) {
  const projects = (await getFeaturedPortfolio()).slice(0, count);
  if (projects.length === 0) return null;
  return <section id="work" className="section-shell bg-base-100"><Container><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="کارهای منتخب" title={title ?? "پروژه‌هایی که اثر می‌گذارند"} subtitle={subtitle ?? "نگاهی به برخی از پروژه‌هایی که با همکاری مشتریان‌مان ساخته‌ایم."} /><Link href="/portfolio" className="btn btn-outline rounded-xl border-base-300 text-base-content hover:border-primary hover:bg-primary hover:text-primary-content">همه نمونه‌کارها <ArrowLeft className="h-4 w-4" /></Link></div><div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <PortfolioCard key={project.id} item={project} />)}</div></Container></section>;
}
