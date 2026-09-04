"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Course } from "@/db/schema";
import { formatNumber } from "@/lib/utils";

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses ?? []);
    } catch {
      setError("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(c: Course) {
    if (!confirm(`«${c.title}» حذف شود؟`)) return;
    setCourses((l) => l.filter((x) => x.id !== c.id));
    try {
      await fetch(`/api/courses/${c.id}`, { method: "DELETE" });
    } catch {
      setError("خطا در حذف");
      await load();
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">دوره‌های آموزشی</h1>
          <p className="mt-1 text-sm text-slate-500">{courses.length} دوره</p>
        </div>
        <Link href="/admin/courses/new" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105">
          <Plus className="h-4 w-4" /> دوره جدید
        </Link>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{error}</p>}

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : courses.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center">
          <p className="text-5xl">🎓</p><p className="mt-4 font-semibold">هنوز دوره‌ای ساخته نشده است</p>
          <Link href="/admin/courses/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> ساخت دوره
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="flex flex-col gap-4 soft-card rounded-2xl p-4 sm:flex-row sm:items-center">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {c.coverUrl ? <img src={c.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl">🎓</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{c.title}</h3>
                  {c.featured && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-600">ویژه</span>}
                  {c.price <= 0 ? <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-600">رایگان</span> : <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{formatNumber(c.price)} تومان</span>}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">{c.description.replace(/<[^>]*>/g, "")}</p>
                <p className="mt-1 text-xs text-slate-400">{c.level} · {c.instructor}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href={`/admin/courses/${c.id}/edit`} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600"><Pencil className="h-4 w-4" /> ویرایش</Link>
                <button type="button" onClick={() => handleDelete(c)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-500"><Trash2 className="h-4 w-4" /> حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
