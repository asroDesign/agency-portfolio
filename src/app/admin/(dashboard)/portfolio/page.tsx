"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, ExternalLink, PlayCircle, Star } from "lucide-react";
import type { PortfolioItem } from "@/db/schema";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Category = "web" | "app" | "seo" | "ecommerce" | "branding";

const emptyForm = {
  title: "",
  description: "",
  category: "web" as Category,
  imageUrl: "",
  liveUrl: "",
  demoUrl: "",
  technologies: "",
  featured: false,
  sortOrder: 0,
};

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl ?? "",
      liveUrl: item.liveUrl ?? "",
      demoUrl: item.demoUrl ?? "",
      technologies: (item.technologies ?? []).join("، "),
      featured: item.featured,
      sortOrder: item.sortOrder,
    });
    setError("");
    setModalOpen(true);
  }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  async function handleSave(e: React.FormEvent) {
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
      technologies: form.technologies
        .split(/[،,]/)
        .map((t) => t.trim())
        .filter(Boolean),
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      if (editing) {
        // Optimistic update
        const previous = items;
        const optimistic: PortfolioItem = { ...editing, ...payload, updatedAt: new Date() };
        setItems((list) => list.map((i) => (i.id === editing.id ? optimistic : i)));
        setModalOpen(false);

        const res = await fetch(`/api/portfolio/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setItems((list) => list.map((i) => (i.id === data.item.id ? data.item : i)));
      } else {
        // Optimistic create with temp id
        const tempId = `temp-${Date.now()}`;
        const temp: PortfolioItem = {
          id: tempId,
          slug: tempId,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          imageUrl: payload.imageUrl || null,
          liveUrl: payload.liveUrl || null,
          demoUrl: payload.demoUrl || null,
          technologies: payload.technologies,
          featured: payload.featured,
          sortOrder: payload.sortOrder,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setItems((list) => [temp, ...list]);
        setModalOpen(false);
        setForm(emptyForm);

        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setItems((list) => list.map((i) => (i.id === tempId ? data.item : i)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره");
      setModalOpen(true);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: PortfolioItem) {
    if (!confirm(`«${item.title}» حذف شود؟`)) return;
    setDeleting(item.id);
    const previous = items;
    setItems((list) => list.filter((i) => i.id !== item.id));
    try {
      const res = await fetch(`/api/portfolio/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف");
    } catch {
      setError("خطا در حذف نمونه‌کار");
      setItems(previous);
    } finally {
      setDeleting(null);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">نمونه‌کارها</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {items.length} پروژه ثبت شده
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          افزودن نمونه‌کار
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-16 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="mt-3 text-sm">در حال بارگذاری...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">🗂️</p>
          <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">هنوز نمونه‌کاری ثبت نشده است</p>
          <p className="mt-1 text-sm text-slate-400">اولین نمونه‌کار خود را اضافه کنید</p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            افزودن نمونه‌کار
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-opacity dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center",
                deleting === item.id && "opacity-50",
              )}
            >
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
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:text-slate-300"
                >
                  <Pencil className="h-4 w-4" />
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10 dark:border-rose-500/20"
                >
                  {deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0b0d1a]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editing ? "ویرایش نمونه‌کار" : "افزودن نمونه‌کار"}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="بستن">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">عنوان <span className="text-rose-500">*</span></label>
                <input required value={form.title} onChange={set("title")} placeholder="مثلاً فروشگاه آنلاین" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">توضیحات <span className="text-rose-500">*</span></label>
                <textarea required rows={3} value={form.description} onChange={set("description")} placeholder="توضیح کوتاه درباره پروژه" className={`${inputClass} resize-none`} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">دسته‌بندی</label>
                  <select value={form.category} onChange={set("category")} className={inputClass}>
                    <option value="web">وب‌سایت</option>
                    <option value="app">اپلیکیشن</option>
                    <option value="seo">سئو</option>
                    <option value="ecommerce">فروشگاه</option>
                    <option value="branding">برندینگ</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">ترتیب نمایش</label>
                  <input type="number" value={form.sortOrder} onChange={set("sortOrder")} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">آدرس تصویر</label>
                <input dir="ltr" value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." className={inputClass} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">لینک بازدید (Live)</label>
                  <input dir="ltr" type="url" value={form.liveUrl} onChange={set("liveUrl")} placeholder="https://example.com" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">لینک دموی زنده</label>
                  <input dir="ltr" type="url" value={form.demoUrl} onChange={set("demoUrl")} placeholder="https://demo.example.com" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">تکنولوژی‌ها</label>
                <input value={form.technologies} onChange={set("technologies")} placeholder="Next.js، React، PostgreSQL (با کاما جدا کنید)" className={inputClass} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 rounded border-slate-300 accent-indigo-500" />
                نمایش به‌عنوان نمونه‌کار ویژه در صفحه اصلی
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {editing ? "ذخیره تغییرات" : "افزودن"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 dark:border-white/10 dark:text-slate-300"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
