import type { Metadata } from "next";
import coursesIllustration from "@/app/uploads/courses-vec.png";
import { GraduationCap } from "lucide-react";
import { CatalogHeader } from "@/components/layout/catalog-header";
import { Container } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { getPublishedCourses } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/courses", {
    title: "دوره‌های آموزشی برنامه‌نویسی | تیم برنامه نویسی آسرو",
    description: "دوره‌های ویدیویی طراحی وب، برنامه‌نویسی و سئو به صورت جلسه‌ای.",
    keywords: ["دوره آموزشی", "آموزش برنامه نویسی", "دوره سئو"],
  });
}

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <SiteHeader />
      <main>
        <CatalogHeader eyebrow="یادگیری" title="دوره‌های" accent="آموزشی"
          description="یادگیری گام‌به‌گام با ویدیوهای جلسه‌ای و خلاصه هر جلسه. برخی دوره‌ها رایگان و برخی با هزینه هستند."
          target="#courses-list" action="مشاهده دوره‌ها" illustration={coursesIllustration} />
        <section id="courses-list" aria-labelledby="courses-heading" className="scroll-mt-20 bg-[#edf7fd] pb-[clamp(4rem,6vw,6.5rem)] pt-8 sm:pt-12">
          <Container>
            <div className="flex items-end justify-between gap-5">
              <div><p className="section-kicker">آموزش و مهارت</p><h2 id="courses-heading" className="mt-2 text-2xl font-black sm:text-3xl">همه دوره‌ها</h2></div>
              <span className="shrink-0 text-xs text-base-content/55">{formatNumber(courses.length)} دوره</span>
            </div>

        {courses.length === 0 ? (
          <div className="mt-9 rounded-3xl border border-base-content/8 bg-white/80 px-6 py-16 text-center">
            <GraduationCap aria-hidden="true" className="mx-auto h-10 w-10 text-primary/60" />
            <p className="mt-4 font-semibold text-base-content/65">هنوز دوره‌ای منتشر نشده است</p>
          </div>
        ) : (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
