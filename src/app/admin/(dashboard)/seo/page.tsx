"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Save, Pencil, X, CheckCircle2 } from "lucide-react";
import type { PageMeta } from "@/db/schema";

const KNOWN_PATHS = [
  { path: "/", label: "صفحه اصلی" },
  { path: "/portfolio", label: "نمونه‌کارها" },
  { path: "/blog", label: "وبلاگ" },
  { path: "/courses", label: "دوره‌ها" },
  { path: "/templates", label: "فروشگاه قالب" },
  { path: "/about", label: "درباره ما" },
  { path: "/contact", label: "تماس با ما" },
  { path: "/order", label: "سفارش پروژه" },
];

const empty = { path: "/", title: "", description: "", keywords: "", ogImage: "", noIndex: false };

export default function SeoAdminPage() {
  const [metas, setMetas] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageMeta | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/page-seo");
      const data = await res.json();
      setMetas(data.metas ?? []);
    } catch { setError("خطا در دریافت داده‌ها"); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setCreating(true);
    setForm(empty);
  }
  function openEdit(m: PageMeta) {
    setEditing(m);
    setCreating(false);
    setForm({ path: m.path, title: m.title, description: m.description, keywords: m.keywords ?? "", ogImage: m.ogImage ?? "", noIndex: m.noIndex });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/page-seo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setEditing(null); setCreating(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); } finally { setSaving(false); }
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">تنظیمات سئو</h1>
          <p className="mt-1 text-sm text-slate-500">مدیریت عنوان، توضیحات و کلمات کلیدی صفحات سایت</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> صفحه جدید
        </button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{error}</p>}
      {saved && <p className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ذخیره شد</p>}

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="mt-6 space-y-3">
          {metas.map((m) => (
            <div key={m.id} className="soft-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span dir="ltr" className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{m.path}</span>
                    {m.noIndex && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-600">noindex</span>}
                  </div>
                  <p className="mt-1 truncate font-semibold text-primary">{m.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{m.description}</p>
                </div>
                <button type="button" onClick={() => openEdit(m)} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
                  <Pencil className="h-4 w-4" /> ویرایش
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => { setEditing(null); setCreating(false); }} />
          <div className="relative my-8 w-full max-w-xl soft-card rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editing ? "ویرایش سئو" : "سئو صفحه جدید"}</h2>
              <button type="button" onClick={() => { setEditing(null); setCreating(false); }} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={save} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">مسیر صفحه</label>
                <select
                  value={form.path}
                  onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))}
                  disabled={!!editing}
                  className={inputClass}
                >
                  {KNOWN_PATHS.map((p) => <option key={p.path} value={p.path}>{p.path} — {p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">عنوان (Title) <span className="text-rose-500">*</span></label>
                <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">توضیحات (Description) <span className="text-rose-500">*</span></label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">کلمات کلیدی (با کاما جدا کنید)</label>
                <input value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">تصویر اوپن‌گراف (URL)</label>
                <input dir="ltr" value={form.ogImage} onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))} className={inputClass} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={form.noIndex} onChange={(e) => setForm((f) => ({ ...f, noIndex: e.target.checked }))} className="h-4 w-4 accent-primary" />
                عدم ایندکس این صفحه (noindex)
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} ذخیره
                </button>
                <button type="button" onClick={() => { setEditing(null); setCreating(false); }} className="rounded-xl border border-slate-200 px-5 py-3 text-sm text-slate-600">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
