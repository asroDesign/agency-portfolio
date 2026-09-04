"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, Star, Eye, EyeOff } from "lucide-react";
import type { BlogPost } from "@/db/schema";
import { formatDate, cn } from "@/lib/utils";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setError("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function togglePublish(p: BlogPost) {
    setPosts((l) => l.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)));
    await fetch(`/api/blog/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
  }

  async function handleDelete(p: BlogPost) {
    if (!confirm(`«${p.title}» حذف شود؟`)) return;
    setPosts((l) => l.filter((x) => x.id !== p.id));
    try {
      const res = await fetch(`/api/blog/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setError("خطا در حذف");
      await load();
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">وبلاگ</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{posts.length} مقاله</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" /> مقاله جدید
        </Link>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">📝</p>
          <p className="mt-4 font-semibold">هنوز مقاله‌ای ننوشته‌اید</p>
          <Link
            href="/admin/blog/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            نوشتن اولین مقاله
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                {p.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">📝</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{p.title}</h3>
                  {p.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-600 dark:text-amber-300">
                      <Star className="h-3 w-3" /> ویژه
                    </span>
                  )}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                    {p.category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{p.excerpt}</p>
                <p className="mt-1 text-xs text-slate-400">{p.author} · {formatDate(p.createdAt)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePublish(p)}
                  title={p.published ? "عدم انتشار" : "انتشار"}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium",
                    p.published
                      ? "border-emerald-200 text-emerald-600 dark:border-emerald-500/30"
                      : "border-slate-200 text-slate-400 dark:border-white/10",
                  )}
                >
                  {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {p.published ? "منتشر شده" : "پیش‌نویس"}
                </button>
                <Link
                  href={`/admin/blog/${p.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:text-slate-300"
                >
                  <Pencil className="h-4 w-4" /> ویرایش
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-500 transition-colors hover:bg-rose-500/10 dark:border-rose-500/20"
                >
                  <Trash2 className="h-4 w-4" /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
