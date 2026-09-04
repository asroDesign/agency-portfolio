"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Save, ArrowRight, ImagePlus, Plus, Trash2, X, Upload, FileDown, File, Package, CheckCircle2,
} from "lucide-react";
import type { Template, TemplateCategory, Addon } from "@/db/schema";
import { formatNumber } from "@/lib/utils";

export function TemplateForm({
  initial,
  categories,
  addons: initialAddons,
}: {
  initial?: Template;
  categories: TemplateCategory[];
  addons: Addon[];
}) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    coverUrl: initial?.coverUrl ?? "",
    gallery: initial?.gallery ?? [],
    price: String(initial?.price ?? 0),
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    technology: initial?.technology ?? "",
    version: initial?.version ?? "",
    compatibility: initial?.compatibility ?? "",
    features: (initial?.features ?? []).join("\n"),
    liveUrl: initial?.liveUrl ?? "",
    demoUrl: initial?.demoUrl ?? "",
    filePath: initial?.filePath ?? "",
    fileName: initial?.fileName ?? "",
    published: initial?.published ?? true,
    featured: initial?.featured ?? false,
  });

  const [addons, setAddons] = useState<Addon[]>(initialAddons);
  const [uploading, setUploading] = useState<string | null>(null); // "cover" | "file" | "gallery"
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [addonModal, setAddonModal] = useState(false);
  const [addonForm, setAddonForm] = useState({ name: "", description: "", price: "0", type: "option" as "file" | "option", filePath: "", fileName: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("cover");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setForm((f) => ({ ...f, coverUrl: data.url }));
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); }
    finally { setUploading(null); e.target.value = ""; }
  }

  async function uploadGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading("gallery");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setForm((f) => ({ ...f, gallery: [...f.gallery, data.url] }));
      }
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); }
    finally { setUploading(null); e.target.value = ""; }
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("file");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "file");
      const res = await fetch("/api/upload-file", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setForm((f) => ({ ...f, filePath: data.filePath, fileName: data.fileName }));
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); }
    finally { setUploading(null); e.target.value = ""; }
  }

  // Addons
  async function addAddon(e: React.FormEvent) {
    e.preventDefault();
    if (!initial) { setError("ابتدا قالب را ذخیره کنید سپس ادان اضافه کنید"); setAddonModal(false); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addonForm, price: Number(addonForm.price) || 0, templateId: initial.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setAddons((l) => [...l, data.addon]);
      setAddonModal(false);
      setAddonForm({ name: "", description: "", price: "0", type: "option", filePath: "", fileName: "" });
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); }
    finally { setSaving(false); }
  }

  async function deleteAddon(id: string) {
    if (!confirm("این ادان حذف شود؟")) return;
    setAddons((l) => l.filter((a) => a.id !== id));
    await fetch(`/api/addons/${id}`, { method: "DELETE" });
  }

  async function uploadAddonFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("addon");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "file");
      const res = await fetch("/api/upload-file", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setAddonForm((f) => ({ ...f, filePath: data.filePath, fileName: data.fileName }));
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); }
    finally { setUploading(null); e.target.value = ""; }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const cat = categories.find((c) => c.id === form.categoryId);
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      category: cat?.name ?? "عمومی",
      features: form.features.split("\n").map((x) => x.trim()).filter(Boolean),
      gallery: form.gallery,
      filePath: form.filePath || null,
      fileName: form.fileName || null,
    };
    try {
      const res = await fetch(isEdit ? `/api/templates/${initial!.id}` : "/api/templates", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      router.push("/admin/templates");
      router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); }
    finally { setSaving(false); }
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/templates" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-500 dark:text-slate-400">
          <ArrowRight className="h-4 w-4" /> بازگشت
        </Link>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "ذخیره تغییرات" : "ایجاد قالب"}
        </button>
      </div>

      {error && <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <label className="mb-1.5 block text-sm font-medium">عنوان <span className="text-rose-500">*</span></label>
            <input required value={form.title} onChange={set("title")} className={`${inputClass} text-lg font-semibold`} />

            <label className="mb-1.5 mt-5 block text-sm font-medium">توضیحات <span className="text-rose-500">*</span></label>
            <textarea required rows={4} value={form.description} onChange={set("description")} className={`${inputClass} resize-none`} />

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div><label className="mb-1.5 block text-sm">قیمت (تومان)</label><input type="number" min="0" value={form.price} onChange={set("price")} className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm">نسخه</label><input value={form.version} onChange={set("version")} className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm">تکنولوژی</label><input value={form.technology} onChange={set("technology")} className={inputClass} /></div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="mb-1.5 block text-sm">لینک پیش‌نمایش</label><input dir="ltr" value={form.liveUrl} onChange={set("liveUrl")} className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm">لینک دمو</label><input dir="ltr" value={form.demoUrl} onChange={set("demoUrl")} className={inputClass} /></div>
            </div>

            <label className="mb-1.5 mt-5 block text-sm">امکانات (هر خط یک مورد)</label>
            <textarea rows={4} value={form.features} onChange={set("features")} className={`${inputClass} resize-none`} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-bold">تصویر کاور</h3>
            <div className="mt-3">
              {form.coverUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverUrl} alt="کاور" className="aspect-[16/10] w-full object-cover" />
                  <button type="button" onClick={() => setForm((f) => ({ ...f, coverUrl: "" }))} className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs text-white">حذف</button>
                </div>
              ) : (
                <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/15">
                  {uploading === "cover" ? <Loader2 className="h-8 w-8 animate-spin" /> : <><ImagePlus className="h-8 w-8" /><span className="text-sm">بارگذاری کاور</span></>}
                  <input type="file" accept="image/*" onChange={uploadCover} className="hidden" />
                </label>
              )}
            </div>

            <h3 className="mt-6 text-sm font-bold">گالری تصاویر</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {form.gallery.map((g, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g} alt="" className="aspect-square w-full object-cover" />
                  <button type="button" onClick={() => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }))} className="absolute left-1 top-1 rounded-full bg-slate-900/70 p-1 text-white"><X className="h-3 w-3" /></button>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/15">
                {uploading === "gallery" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                <input type="file" accept="image/*" multiple onChange={uploadGallery} className="hidden" />
              </label>
            </div>

            <h3 className="mt-6 text-sm font-bold">فایل قالب (امن)</h3>
            <div className="mt-3">
              {form.fileName ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-500/5 p-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300"><FileDown className="h-4 w-4" />{form.fileName}</span>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, filePath: "", fileName: "" }))} className="text-rose-500"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-4 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/15">
                  {uploading === "file" ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Upload className="h-6 w-6" /><span className="text-xs">بارگذاری فایل (zip/rar)</span></>}
                  <input type="file" accept=".zip,.rar,.pdf" onChange={uploadFile} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-bold">تنظیمات</h3>
            <div className="mt-4 space-y-4">
              <div><label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">دسته‌بندی</label>
                <select value={form.categoryId} onChange={set("categoryId")} className={inputClass}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">مرورگرهای سازگار</label><input value={form.compatibility} onChange={set("compatibility")} className={inputClass} /></div>
              <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={set("published")} className="h-4 w-4 accent-indigo-500" /> منتشر شود</label>
              <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-indigo-500" /> قالب ویژه</label>
            </div>
          </div>
        </div>
      </div>

      {/* Addons */}
      {isEdit && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold"><Package className="h-4 w-4" /> ادان‌های مخصوص این قالب ({addons.length})</h3>
            <button type="button" onClick={() => setAddonModal(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300"><Plus className="h-4 w-4" /> افزودن ادان</button>
          </div>
          <div className="mt-4 space-y-2">
            {addons.length === 0 && <p className="py-6 text-center text-sm text-slate-400">ادانی تعریف نشده است.</p>}
            {addons.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">{a.type === "file" ? <File className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="truncate text-xs text-slate-400">{a.description}</p>
                </div>
                <span className="shrink-0 text-sm font-bold">{a.price > 0 ? formatNumber(a.price) : "رایگان"}</span>
                <button type="button" onClick={() => deleteAddon(a.id)} className="shrink-0 text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Addon modal */}
      {addonModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setAddonModal(false)} />
          <div className="relative my-8 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0b0d1a]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">ادان جدید</h2>
              <button type="button" onClick={() => setAddonModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={addAddon} className="mt-5 space-y-4">
              <div><label className="mb-1.5 block text-sm">نام <span className="text-rose-500">*</span></label><input required value={addonForm.name} onChange={(e) => setAddonForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm">توضیحات <span className="text-rose-500">*</span></label><input required value={addonForm.description} onChange={(e) => setAddonForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1.5 block text-sm">قیمت (تومان)</label><input type="number" min="0" value={addonForm.price} onChange={(e) => setAddonForm((f) => ({ ...f, price: e.target.value }))} className={inputClass} /></div>
                <div><label className="mb-1.5 block text-sm">نوع</label>
                  <select value={addonForm.type} onChange={(e) => setAddonForm((f) => ({ ...f, type: e.target.value as "file" | "option" }))} className={inputClass}>
                    <option value="option">آپشن (مثلاً نصب/دو دامنه)</option>
                    <option value="file">فایل قابل دانلود</option>
                  </select>
                </div>
              </div>
              {addonForm.type === "file" && (
                <div>
                  <label className="mb-1.5 block text-sm">فایل ادان</label>
                  {addonForm.fileName ? (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-500/5 p-3"><span className="text-sm text-emerald-600">{addonForm.fileName}</span><button type="button" onClick={() => setAddonForm((f) => ({ ...f, filePath: "", fileName: "" }))} className="text-rose-500"><X className="h-4 w-4" /></button></div>
                  ) : (
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-3 text-xs text-slate-400 hover:border-indigo-400 dark:border-white/15">
                      {uploading === "addon" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} بارگذاری فایل
                      <input type="file" accept=".zip,.rar,.pdf" onChange={uploadAddonFile} className="hidden" />
                    </label>
                  )}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}افزودن</button>
                <button type="button" onClick={() => setAddonModal(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </form>
  );
}
