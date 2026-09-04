"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, ExternalLink, PlayCircle, Star } from "lucide-react";
import type { PortfolioItem } from "@/db/schema";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setError("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(item: PortfolioItem) {
    if (!confirm(`«${item.title}» حذف شود؟`)) return;
    setDeleting(item.id);
    setItems((list) => list.filter((i) => i.id !== item.id));
    try {
      const res = await fetch(`/api/portfolio/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setError("خطا در حذف");
      await load();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">نمونه‌کارها</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{items.length} پروژه ثبت شده</p>
        </div>
        <Link href="/admin/portfolio/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105">
          <Plus className="h-4 w-4" /> افزودن نمونه‌کار
        </Link>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
      ) : items.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">🗂️</p>
          <p className="mt-4 font-semibold">هنوز نمونه‌کاری ثبت نشده است</p>
          <Link href="/admin/portfolio/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> افزودن نمونه‌کار
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.id} className={cn("flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center", deleting === item.id && "opacity-50")}>
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">🖥️</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{item.title}</h3>
                  {item.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-300">
                      <Star className="h-3 w-3" /> ویژه
                    </span>
                  )}
                  <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", CATEGORY_COLORS[item.category])}>
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.liveUrl && (
                    <a href={item.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:underline">
                      <ExternalLink className="h-3 w-3" /> لینک بازدید
                    </a>
                  )}
                  {item.demoUrl && (
                    <a href={item.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-fuchsia-500 hover:underline">
                      <PlayCircle className="h-3 w-3" /> دموی زنده
                    </a>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={`/admin/portfolio/${item.id}/edit`} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 dark:border-white/10 dark:text-slate-300">
                  <Pencil className="h-4 w-4" /> ویرایش
                </Link>
                <button type="button" onClick={() => handleDelete(item)} disabled={deleting === item.id} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-500 dark:border-rose-500/20">
                  {deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
