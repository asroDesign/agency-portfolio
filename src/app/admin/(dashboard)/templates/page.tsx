"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, Star, FolderPlus, X, Package } from "lucide-react";
import type { Template, TemplateCategory, Addon } from "@/db/schema";
import { formatNumber } from "@/lib/utils";

export default function TemplatesAdminPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [globalAddons, setGlobalAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [catBusy, setCatBusy] = useState(false);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [addonForm, setAddonForm] = useState({ name: "", description: "", price: "0", type: "option" as "file" | "option" });

  const load = useCallback(async () => {
    try {
      const [tRes, cRes, aRes] = await Promise.all([
        fetch("/api/templates"),
        fetch("/api/template-categories"),
        fetch("/api/addons"),
      ]);
      const tData = await tRes.json();
      const cData = await cRes.json();
      const aData = await aRes.json();
      setTemplates(tData.templates ?? []);
      setCategories(cData.categories ?? []);
      setGlobalAddons((aData.addons ?? []).filter((a: Addon) => !a.templateId));
    } catch { setError("خطا در دریافت داده‌ها"); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addCategory() {
    if (!newCategory.trim()) return;
    setCatBusy(true);
    try {
      const res = await fetch("/api/template-categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCategory.trim() }) });
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

  async function handleDelete(t: Template) {
    if (!confirm(`«${t.title}» حذف شود؟`)) return;
    setTemplates((l) => l.filter((x) => x.id !== t.id));
    try { await fetch(`/api/templates/${t.id}`, { method: "DELETE" }); } catch { setError("خطا در حذف"); await load(); }
  }

  async function addGlobalAddon(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/addons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...addonForm, price: Number(addonForm.price) || 0, templateId: null }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setGlobalAddons((l) => [...l, data.addon]);
      setShowAddonForm(false);
      setAddonForm({ name: "", description: "", price: "0", type: "option" });
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">قالب‌ها</h1>
          <p className="mt-1 text-sm text-slate-500">{templates.length} قالب در {categories.length} دسته</p>
        </div>
        <Link href="/admin/templates/new" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105">
          <Plus className="h-4 w-4" /> قالب جدید
        </Link>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{error}</p>}

      {/* Categories */}
      <div className="mt-6 soft-card rounded-3xl p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-600"><FolderPlus className="h-4 w-4" /> دسته‌بندی قالب‌ها</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {c.name}
              <button type="button" onClick={() => removeCategory(c.id)} className="text-primary hover:text-rose-500"><X className="h-3.5 w-3.5" /></button>
            </span>
          ))}
          <div className="inline-flex items-center gap-2">
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="دسته جدید..." className="w-36 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary" />
            <button type="button" onClick={addCategory} disabled={catBusy} className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60">{catBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} افزودن</button>
          </div>
        </div>
      </div>

      {/* Global addons */}
      <div className="mt-4 soft-card rounded-3xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-600"><Package className="h-4 w-4" /> ادان‌های عمومی (برای همه قالب‌ها)</h2>
          <button type="button" onClick={() => setShowAddonForm((v) => !v)} className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600"><Plus className="h-4 w-4" /> ادان عمومی</button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {globalAddons.map((a) => (
            <span key={a.id} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600">
              {a.name} ({a.price > 0 ? formatNumber(a.price) : "رایگان"})
              <button type="button" onClick={async () => { await fetch(`/api/addons/${a.id}`, { method: "DELETE" }); load(); }} className="text-emerald-400 hover:text-rose-500"><X className="h-3.5 w-3.5" /></button>
            </span>
          ))}
          {globalAddons.length === 0 && !showAddonForm && <span className="text-xs text-slate-400">ادان عمومی ثبت نشده است.</span>}
        </div>
        {showAddonForm && (
          <form onSubmit={addGlobalAddon} className="mt-3 grid gap-2 rounded-2xl border border-dashed border-slate-300 p-3 sm:grid-cols-4">
            <input required value={addonForm.name} onChange={(e) => setAddonForm((f) => ({ ...f, name: e.target.value }))} placeholder="نام ادان" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary" />
            <input required value={addonForm.description} onChange={(e) => setAddonForm((f) => ({ ...f, description: e.target.value }))} placeholder="توضیحات" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary" />
            <input type="number" min="0" value={addonForm.price} onChange={(e) => setAddonForm((f) => ({ ...f, price: e.target.value }))} placeholder="قیمت" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary" />
            <button type="submit" className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> افزودن</button>
          </form>
        )}
      </div>

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : templates.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center">
          <p className="text-5xl">🧩</p><p className="mt-4 font-semibold">هنوز قالبی اضافه نشده است</p>
          <Link href="/admin/templates/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> افزودن قالب</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {templates.map((t) => (
            <div key={t.id} className="flex flex-col gap-4 soft-card rounded-2xl p-4 sm:flex-row sm:items-center">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {t.coverUrl ? <img src={t.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl">🧩</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{t.title}</h3>
                  {t.featured && <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-600"><Star className="h-3 w-3" /> ویژه</span>}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">{t.category}</span>
                  {t.fileName && <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-600">فایل ✓</span>}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">{t.description}</p>
                <p className="mt-1 text-xs text-slate-400">{t.price > 0 ? `${formatNumber(t.price)} تومان` : "رایگان"} · {formatNumber(t.sales)} فروش · ⭐ {t.rating}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href={`/admin/templates/${t.id}/edit`} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600"><Pencil className="h-4 w-4" /> ویرایش</Link>
                <button type="button" onClick={() => handleDelete(t)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-500"><Trash2 className="h-4 w-4" /> حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
