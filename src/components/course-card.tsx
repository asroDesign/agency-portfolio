import Link from "next/link";
import { Clock, Users, PlayCircle } from "lucide-react";
import type { Course } from "@/db/schema";
import { formatNumber } from "@/lib/utils";

export function CourseCard({ course }: { course: Course }) {
  const isFree = !course.price || course.price <= 0;
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
      <Link href={`/courses/${course.slug}`} className="relative block aspect-[16/9] overflow-hidden">
        {course.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.coverUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 text-4xl">
            🎓
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow ${
            isFree ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-fuchsia-500"
          }`}
        >
          {isFree ? "رایگان" : "پولی"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium text-indigo-500">{course.level} · {course.instructor}</span>
        <Link href={`/courses/${course.slug}`}>
          <h3 className="mt-1.5 text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
            {course.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {course.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {course.totalDuration && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.totalDuration}
              </span>
            )}
          </div>
          <div className="text-left">
            {isFree ? (
              <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-500">
                <PlayCircle className="h-4 w-4" />
                رایگان
              </span>
            ) : (
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {formatNumber(course.price)}{" "}
                <span className="text-xs font-normal text-slate-400">تومان</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
