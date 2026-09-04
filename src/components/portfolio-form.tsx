"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, ArrowRight, ImagePlus } from "lucide-react";
import type { PortfolioItem } from "@/db/schema";

type Category = "web" | "app" | "seo" | "ecommerce" | "branding";

export function PortfolioForm({ initial }: { initial?: PortfolioItem }) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: (initial?.category ?? "web") as Category,
    imageUrl: initial?.imageUrl ?? "",
    liveUrl: initial?.liveUrl ?? "",
    demoUrl: initial?.demoUrl ?? "",
    technologies: (initial?.technologies ?? []).join("، "),
    featured: initial?.featured ?? false,
    sortOrder: initial?.sortOrder ?? 0,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      imageUrl: form.imageUrl,
      liveUrl: form.liveUrl,
      demoUrl: form.demoUrl,
      technologies: form.technologies.split(/[،,]/).map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
    };
    try {
      const res = await fetch(isEdit ? `/api/portfolio/${initial!.id}` : "/api/portfolio", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      router.push("/admin/portfolio");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/portfolio" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-500 dark:text-slate-400">
          <ArrowRight className="h-4 w-4" /> بازگشت
        </Link>
        <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "ذخیره تغییرات" : "افزودن نمونه‌کار"}
        </button>
      </div>

      {error && <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <label className="mb-1.5 block text-sm font-medium">عنوان <span className="text-rose-500">*</span></label>
            <input required value={form.title} onChange={set("title")} placeholder="مثلاً فروشگاه آنلاین" className={inputClass} />

            <label className="mb-1.5 mt-5 block text-sm font-medium">توضیحات <span className="text-rose-500">*</span></label>
            <textarea required rows={3} value={form.description} onChange={set("description")} placeholder="توضیح کوتاه درباره پروژه" className={`${inputClass} resize-none`} />

            <label className="mb-1.5 mt-5 block text-sm font-medium">لینک بازدید (Live)</label>
            <input dir="ltr" type="url" value={form.liveUrl} onChange={set("liveUrl")} placeholder="https://example.com" className={inputClass} />

            <label className="mb-1.5 mt-5 block text-sm font-medium">لینک دموی زنده</label>
            <input dir="ltr" type="url" value={form.demoUrl} onChange={set("demoUrl")} placeholder="https://demo.example.com" className={inputClass} />

            <label className="mb-1.5 mt-5 block text-sm font-medium">تکنولوژی‌ها (با کاما جدا کنید)</label>
            <input value={form.technologies} onChange={set("technologies")} placeholder="Next.js، React" className={inputClass} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-bold">تصویر نمونه‌کار</h3>
            <div className="mt-3">
              {form.imageUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="پیش‌نمایش" className="aspect-[16/10] w-full object-cover" />
                  <button type="button" onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))} className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white">حذف</button>
                </div>
              ) : (
                <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-white/15">
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="text-sm">در حال بارگذاری...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-8 w-8" />
                      <span className="text-sm font-medium">بارگذاری تصویر</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              )}
              <p className="mt-2 text-xs text-slate-400">در صورت وجود لینک بازدید، پیش‌نمایش زنده جایگزین تصویر می‌شود.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-bold">تنظیمات</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">دسته‌بندی</label>
                <select value={form.category} onChange={set("category")} className={inputClass}>
                  <option value="web">وب‌سایت</option>
                  <option value="app">اپلیکیشن</option>
                  <option value="seo">سئو</option>
                  <option value="ecommerce">فروشگاه</option>
                  <option value="branding">برندینگ</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">ترتیب نمایش</label>
                <input type="number" value={form.sortOrder} onChange={set("sortOrder")} className={inputClass} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-indigo-500" />
                نمونه‌کار ویژه (نمایش در صفحه اصلی)
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
