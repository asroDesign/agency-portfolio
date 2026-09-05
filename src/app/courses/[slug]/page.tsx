import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, Video, GraduationCap, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CoursePlayer } from "@/components/course-player";
import { EnrollButton } from "@/components/enroll-button";
import { HtmlContent } from "@/components/html-content";
import { getCourseBySlug, getCourseSessions, getEnrolledCourseIds } from "@/lib/catalog";
import { getSession } from "@/lib/auth";
import { formatNumber } from "@/lib/utils";
import styles from "@/components/ui/detail-page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course?.title ?? "دوره", description: course?.description };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const sessions = await getCourseSessions(course.id);
  const session = await getSession();
  const enrolled = session ? (await getEnrolledCourseIds(session.userId)).has(course.id) : false;
  const isFree = !course.price || course.price <= 0;

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className={`site-container ${styles.main}`}>
        <Link href="/courses" className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-medium text-primary"><ArrowRight aria-hidden="true" className="h-4 w-4" />بازگشت به دوره‌ها</Link>
        <div className={styles.layout}>
          <div>
            <CoursePlayer sessions={sessions} hasAccess={enrolled} />
          </div>

          <aside className="space-y-5">
            <div className="soft-card rounded-3xl p-6">
              {course.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.coverUrl} alt={course.title} className="mb-5 aspect-[16/9] w-full rounded-2xl object-cover" />
              ) : null}
              <h1 className="text-2xl font-black leading-relaxed tracking-tight">{course.title}</h1>
              <div className="mt-3 text-sm leading-7 text-slate-600">
                <HtmlContent html={course.description} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <Video className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 text-sm font-bold">{sessions.length}</p>
                  <p className="text-[11px] text-slate-400">جلسه</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <Clock className="mx-auto h-5 w-5 text-secondary" />
                  <p className="mt-1 text-sm font-bold">{course.totalDuration ?? "—"}</p>
                  <p className="text-[11px] text-slate-400">مدت دوره</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <GraduationCap className="mx-auto h-5 w-5 text-emerald-500" />
                  <p className="mt-1 text-sm font-bold">{course.level}</p>
                  <p className="text-[11px] text-slate-400">سطح</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <Users className="mx-auto h-5 w-5 text-amber-500" />
                  <p className="mt-1 break-words text-sm font-bold">{course.instructor}</p>
                  <p className="text-[11px] text-slate-400">مدرس</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                {isFree ? (
                  <div className="mb-4 text-center">
                    <span className="text-2xl font-extrabold text-emerald-500">رایگان</span>
                  </div>
                ) : (
                  <div className="mb-4 text-center">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {formatNumber(course.price)}
                    </span>
                    <span className="mr-1 text-sm text-slate-400">تومان</span>
                  </div>
                )}
                <EnrollButton courseId={course.id} price={course.price} enrolled={enrolled} />
                {!isFree && (
                  <p className="mt-3 text-center text-[11px] text-slate-400">
                    پرداخت از طریق درگاه امن زرین‌پال
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
