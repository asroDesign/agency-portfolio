import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { getPublishedCourses } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/courses", {
    title: "دوره‌های آموزشی برنامه‌نویسی | نکسا تک",
    description: "دوره‌های ویدیویی طراحی وب، برنامه‌نویسی و سئو به صورت جلسه‌ای.",
    keywords: ["دوره آموزشی", "آموزش برنامه نویسی", "دوره سئو"],
  });
}

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page-main">
        <div className="page-intro">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">دوره‌های آموزشی</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            یادگیری گام‌به‌گام با ویدیوهای جلسه‌ای و خلاصه هر جلسه. برخی دوره‌ها رایگان و برخی با هزینه هستند.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center">
            <p className="text-5xl">🎓</p>
            <p className="mt-4 font-semibold text-slate-600">هنوز دوره‌ای منتشر نشده است</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
