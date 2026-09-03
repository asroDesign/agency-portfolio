"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Trash2, Star, CheckCircle2, XCircle } from "lucide-react";
import type { Testimonial } from "@/db/schema";
import { formatDate, cn } from "@/lib/utils";

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setItems(data.testimonials ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggle(id: string, field: "approved" | "featured", value: boolean) {
    setItems((l) => l.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
    await fetch(`/api/admin/testimonials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: value }) });
  }

  async function del(id: string) {
    if (!confirm("این نظر حذف شود؟")) return;
    setItems((l) => l.filter((t) => t.id !== id));
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
  }

  const pending = items.filter((t) => !t.approved).length;

  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">نظرات مشتریان</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {pending > 0 ? `${pending} نظر در انتظار تأیید` : "همه نظرات تأیید شده‌اند"}
        </p>
      </div>

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
      ) : items.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">⭐</p><p className="mt-4 font-semibold">هنوز نظری ثبت نشده است</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((t) => (
            <div key={t.id} className={cn("rounded-2xl border p-5", t.approved ? "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5" : "border-amber-200 bg-amber-50/40 dark:border-amber-500/30 dark:bg-amber-500/5")}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{t.name}</h3>
                    {t.role && <span className="text-xs text-slate-400">{t.role}</span>}
                    {!t.approved && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-300">در انتظار تأیید</span>}
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-4 w-4", i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-white/10")} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{t.content}</p>
                  <p className="mt-2 text-xs text-slate-400">{formatDate(t.createdAt)}</p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button type="button" onClick={() => toggle(t.id, "approved", !t.approved)} className={cn("inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium", t.approved ? "border-slate-200 text-slate-500 dark:border-white/10" : "border-emerald-200 text-emerald-600 dark:border-emerald-500/30")}>
                    {t.approved ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    {t.approved ? "رد تأیید" : "تأیید"}
                  </button>
                  <button type="button" onClick={() => toggle(t.id, "featured", !t.featured)} className={cn("inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium", t.featured ? "border-amber-300 text-amber-600 dark:border-amber-500/30" : "border-slate-200 text-slate-500 dark:border-white/10")}>
                    <Star className="h-4 w-4" /> ویژه
                  </button>
                  <button type="button" onClick={() => del(t.id)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-xs text-rose-500 dark:border-rose-500/20"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
