import Link from "next/link";
import { PlayCircle, GraduationCap } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getEnrolledCourses } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AccountCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const session = await getSession();
  if (!session) return null;

  const courses = await getEnrolledCourses(session.userId);

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">دوره‌های من</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">دوره‌هایی که در آن‌ها ثبت‌نام کرده‌اید.</p>

      {status === "success" && (
        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-300">
          ✅ پرداخت با موفقیت انجام شد. اکنون به همه جلسات دوره دسترسی دارید.
        </div>
      )}
      {status === "failed" && (
        <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-300">
          پرداخت ناموفق بود یا لغو شد. لطفاً دوباره تلاش کنید.
        </div>
      )}

      {courses.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-white/15">
          <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">هنوز در دوره‌ای ثبت‌نام نکرده‌اید</p>
          <Link
            href="/courses"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            مشاهده دوره‌ها
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {courses.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-white/10 dark:bg-white/5"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                {c.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.coverUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">🎓</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">{c.title}</h3>
                <p className="text-xs text-slate-400">{c.instructor} · {c.level}</p>
              </div>
              <PlayCircle className="h-6 w-6 shrink-0 text-indigo-500" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
