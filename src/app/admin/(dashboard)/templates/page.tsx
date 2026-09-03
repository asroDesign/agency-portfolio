"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Star, FolderPlus } from "lucide-react";
import type { Template, TemplateCategory } from "@/db/schema";
import { formatNumber } from "@/lib/utils";

const emptyForm = {
  title: "",
  description: "",
  coverUrl: "",
  gallery: "",
  price: "0",
  categoryId: "",
  technology: "",
  version: "",
  compatibility: "",
  features: "",
  liveUrl: "",
  demoUrl: "",
  downloadUrl: "",
  published: true,
  featured: false,
};

export default function TemplatesAdminPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [catBusy, setCatBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [tRes, cRes] = await Promise.all([fetch("/api/templates"), fetch("/api/template-categories")]);
      const tData = await tRes.json();
      const cData = await cRes.json();
      setTemplates(tData.templates ?? []);
      setCategories(cData.categories ?? []);
    } catch { setError("خطا در دریافت داده‌ها"); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setError(""); setModalOpen(true);
  }
  function openEdit(t: Template) {
    setEditing(t);
    setForm({
      title: t.title, description: t.description, coverUrl: t.coverUrl ?? "", gallery: (t.gallery ?? []).join("\n"),
      price: String(t.price), categoryId: t.categoryId ?? "", technology: t.technology ?? "", version: t.version ?? "",
      compatibility: t.compatibility ?? "", features: (t.features ?? []).join("\n"),
      liveUrl: t.liveUrl ?? "", demoUrl: t.demoUrl ?? "", downloadUrl: t.downloadUrl ?? "", published: t.published, featured: t.featured,
    });
    setError(""); setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const cat = categories.find((c) => c.id === form.categoryId);
    const payload = {
      ...form, price: Number(form.price) || 0,
      category: cat?.name ?? "عمومی",
      gallery: form.gallery.split("\n").map((x) => x.trim()).filter(Boolean),
      features: form.features.split("\n").map((x) => x.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        const optimistic: Template = { ...editing, ...payload, gallery: payload.gallery, features: payload.features, updatedAt: new Date() };
        setTemplates((l) => l.map((t) => (t.id === editing.id ? optimistic : t)));
        setModalOpen(false);
        const res = await fetch(`/api/templates/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setTemplates((l) => l.map((t) => (t.id === data.template.id ? data.template : t)));
      } else {
        const tempId = `temp-${Date.now()}`;
        const temp: Template = { id: tempId, slug: tempId, ...payload, rating: 5, ratingCount: 0, coverUrl: payload.coverUrl || null, technology: payload.technology || null, liveUrl: payload.liveUrl || null, demoUrl: payload.demoUrl || null, downloadUrl: payload.downloadUrl || null, sales: 0, createdAt: new Date(), updatedAt: new Date() };
        setTemplates((l) => [temp, ...l]);
        setModalOpen(false); setForm(emptyForm);
        const res = await fetch("/api/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setTemplates((l) => l.map((t) => (t.id === tempId ? data.template : t)));
      }
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); setModalOpen(true); await load(); } finally { setSaving(false); }
  }

  async function handleDelete(t: Template) {
    if (!confirm(`«${t.title}» حذف شود؟`)) return;
    setTemplates((l) => l.filter((x) => x.id !== t.id));
    try { await fetch(`/api/templates/${t.id}`, { method: "DELETE" }); } catch { setError("خطا در حذف"); await load(); }
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    setCatBusy(true);
    try {
      const res = await fetch("/api/template-categories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setCategories((c) => [...c, data.category]);
      setNewCategory("");
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); } finally { setCatBusy(false); }
  }

  async function removeCategory(id: string) {
    if (!confirm("این دسته حذف شود؟")) return;
    setCategories((c) => c.filter((x) => x.id !== id));
    await fetch(`/api/template-categories/${id}`, { method: "DELETE" });
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">قالب‌ها</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{templates.length} قالب در {categories.length} دسته</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
          <Plus className="h-4 w-4" /> قالب جدید
        </button>
      </div>

      {/* Category management */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
          <FolderPlus className="h-4 w-4" /> دسته‌بندی قالب‌ها
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-300">
              {c.name}
              <button type="button" onClick={() => removeCategory(c.id)} className="text-indigo-400 hover:text-rose-500" aria-label="حذف"><X className="h-3.5 w-3.5" /></button>
            </span>
          ))}
          <div className="inline-flex items-center gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="دسته جدید..."
              className="w-36 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <button type="button" onClick={addCategory} disabled={catBusy} className="inline-flex items-center gap-1 rounded-xl bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60">
              {catBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              افزودن
            </button>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
      ) : templates.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">🧩</p><p className="mt-4 font-semibold">هنوز قالبی اضافه نشده است</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {templates.map((t) => (
            <div key={t.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                {t.coverUrl ? <img src={t.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl">🧩</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{t.title}</h3>
                  {t.featured && <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-600 dark:text-amber-300"><Star className="h-3 w-3" /> ویژه</span>}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-400">{t.category}</span>
                  {t.version && <span className="text-[11px] text-slate-400">نسخه {t.version}</span>}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{t.description}</p>
                <p className="mt-1 text-xs text-slate-400">{t.price > 0 ? `${formatNumber(t.price)} تومان` : "رایگان"} · {formatNumber(t.sales)} فروش · ⭐ {t.rating}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => openEdit(t)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300"><Pencil className="h-4 w-4" /> ویرایش</button>
                <button type="button" onClick={() => handleDelete(t)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-500 dark:border-rose-500/20"><Trash2 className="h-4 w-4" /> حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0b0d1a]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editing ? "ویرایش قالب" : "قالب جدید"}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div><label className="mb-1.5 block text-sm font-medium">عنوان <span className="text-rose-500">*</span></label><input required value={form.title} onChange={set("title")} className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm font-medium">توضیحات <span className="text-rose-500">*</span></label><textarea required rows={3} value={form.description} onChange={set("description")} className={`${inputClass} resize-none`} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="mb-1.5 block text-sm font-medium">دسته‌بندی</label>
                  <select value={form.categoryId} onChange={set("categoryId")} className={inputClass}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="mb-1.5 block text-sm font-medium">قیمت (تومان)</label><input type="number" min="0" value={form.price} onChange={set("price")} className={inputClass} /></div>
                <div><label className="mb-1.5 block text-sm font-medium">نسخه</label><input value={form.version} onChange={set("version")} placeholder="۱.۰.۰" className={inputClass} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-medium">تکنولوژی</label><input value={form.technology} onChange={set("technology")} placeholder="مثلاً Next.js" className={inputClass} /></div>
                <div><label className="mb-1.5 block text-sm font-medium">مرورگرهای سازگار</label><input value={form.compatibility} onChange={set("compatibility")} placeholder="Chrome، Firefox" className={inputClass} /></div>
              </div>
              <div><label className="mb-1.5 block text-sm font-medium">تصویر کاور</label><input dir="ltr" value={form.coverUrl} onChange={set("coverUrl")} placeholder="https://..." className={inputClass} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="mb-1.5 block text-sm font-medium">لینک پیش‌نمایش</label><input dir="ltr" value={form.liveUrl} onChange={set("liveUrl")} className={inputClass} /></div>
                <div><label className="mb-1.5 block text-sm font-medium">لینک دمو</label><input dir="ltr" value={form.demoUrl} onChange={set("demoUrl")} className={inputClass} /></div>
                <div><label className="mb-1.5 block text-sm font-medium">لینک دانلود</label><input dir="ltr" value={form.downloadUrl} onChange={set("downloadUrl")} className={inputClass} /></div>
              </div>
              <div><label className="mb-1.5 block text-sm font-medium">امکانات (هر خط یک مورد)</label><textarea rows={4} value={form.features} onChange={set("features")} className={`${inputClass} resize-none`} placeholder={"ریسپانسیو\nپنل مدیریت\nدرگاه پرداخت"} /></div>
              <div><label className="mb-1.5 block text-sm font-medium">گالری تصاویر (هر خط یک آدرس)</label><textarea dir="ltr" rows={2} value={form.gallery} onChange={set("gallery")} className={`${inputClass} resize-none`} /></div>
              <div className="flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={set("published")} className="h-4 w-4 accent-indigo-500" /> منتشر شود</label>
                <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-indigo-500" /> قالب ویژه</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{editing ? "ذخیره" : "ایجاد"}</button>
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
