import Link from "next/link";
import { GraduationCap, Puzzle, ArrowLeft, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { enrollments, templateOrders, courses, templates } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) return null;

  const myEnrollments = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, session.userId),
        eq(enrollments.status, "paid"),
      ),
    );
  const freeEnrollments = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(and(eq(enrollments.userId, session.userId), eq(enrollments.status, "free")));

  const myTemplates = await db
    .select({ templateId: templateOrders.templateId })
    .from(templateOrders)
    .where(and(eq(templateOrders.userId, session.userId), eq(templateOrders.status, "paid")));

  const enrolledCount = myEnrollments.length + freeEnrollments.length;
  const templateCount = myTemplates.length;

  return (
    <div>
      <div className="rounded-3xl bg-gradient-to-br from-secondary to-primary p-8 text-white">
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Sparkles className="h-4 w-4" />
          خوش آمدید
        </div>
        <h1 className="mt-2 text-3xl font-extrabold">{session.name} عزیز</h1>
        <p className="mt-2 text-white/80">به پنل کاربری تیم برنامه نویسی آسرو خوش آمدید.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/courses"
          className="group soft-card rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
              <GraduationCap className="h-6 w-6" />
            </span>
            <ArrowLeft className="h-4 w-4 text-slate-300 transition-transform group-hover:-translate-x-1" />
          </div>
          <div className="mt-4 text-3xl font-extrabold">{enrolledCount}</div>
          <div className="mt-1 text-sm text-slate-500">دوره ثبت‌نام‌شده</div>
        </Link>
        <Link
          href="/account/templates"
          className="group soft-card rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-white">
              <Puzzle className="h-6 w-6" />
            </span>
            <ArrowLeft className="h-4 w-4 text-slate-300 transition-transform group-hover:-translate-x-1" />
          </div>
          <div className="mt-4 text-3xl font-extrabold">{templateCount}</div>
          <div className="mt-1 text-sm text-slate-500">قالب خریداری‌شده</div>
        </Link>
      </div>

      <div className="mt-6 soft-card rounded-3xl p-6">
        <h2 className="font-bold">شروع کنید</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/courses" className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary">
            مشاهده دوره‌های آموزشی ←
          </Link>
          <Link href="/templates" className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary">
            خرید قالب آماده ←
          </Link>
        </div>
      </div>
    </div>
  );
}
