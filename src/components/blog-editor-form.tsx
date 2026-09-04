"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Save,
  ArrowRight,
  ImagePlus,
  CheckCircle2,
  ChevronDown,
  Search,
} from "lucide-react";
import type { BlogPost } from "@/db/schema";
import { RichEditor } from "@/components/rich-editor";

interface InitialValue {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  category: string;
  author: string;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  published: boolean;
  featured: boolean;
}

export function BlogEditorForm({ initial }: { initial?: InitialValue }) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    coverUrl: initial?.coverUrl ?? "",
    category: initial?.category ?? "عمومی",
    author: initial?.author ?? "تیم نکسا تک",
    tags: (initial?.tags ?? []).join("، "),
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    keywords: initial?.keywords ?? "",
    published: initial?.published ?? true,
    featured: initial?.featured ?? false,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در بارگذاری");
      setForm((f) => ({ ...f, coverUrl: data.url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "خطا در بارگذاری تصویر");
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
      excerpt: form.excerpt,
      content: form.content,
      coverUrl: form.coverUrl,
      category: form.category,
      author: form.author,
      tags: form.tags.split(/[،,]/).map((t) => t.trim()).filter(Boolean),
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      keywords: form.keywords || null,
      published: form.published,
      featured: form.featured,
    };

    try {
      const res = await fetch(isEdit ? `/api/blog/${initial!.id}` : "/api/blog", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ذخیره");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به مقالات
        </Link>
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "ذخیره تغییرات" : "انتشار مقاله"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{error}</p>
      )}

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="soft-card rounded-3xl p-6">
            <label className="mb-1.5 block text-sm font-medium">عنوان مقاله <span className="text-rose-500">*</span></label>
            <input
              required
              value={form.title}
              onChange={set("title")}
              placeholder="عنوان مقاله را وارد کنید..."
              className={`${inputClass} text-lg font-semibold`}
            />

            <label className="mb-1.5 mt-5 block text-sm font-medium">خلاصه مقاله <span className="text-rose-500">*</span></label>
            <textarea
              required
              rows={2}
              value={form.excerpt}
              onChange={set("excerpt")}
              placeholder="خلاصه کوتاه از مقاله برای نمایش در لیست و موتورهای جستجو..."
              className={`${inputClass} resize-none`}
            />

            <label className="mb-1.5 mt-5 block text-sm font-medium">متن مقاله</label>
            <RichEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover image */}
          <div className="soft-card rounded-3xl p-6">
            <h3 className="text-sm font-bold">تصویر کاور</h3>
            <div className="mt-3">
              {form.coverUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverUrl} alt="کاور" className="aspect-[16/9] w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, coverUrl: "" }))}
                    className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white"
                  >
                    حذف
                  </button>
                </div>
              ) : (
                <label className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-primary hover:text-primary">
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="text-sm">در حال بارگذاری...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-8 w-8" />
                      <span className="text-sm font-medium">بارگذاری تصویر کاور</span>
                      <span className="text-xs">JPG، PNG یا WebP — حداکثر ۵ مگابایت</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
              {uploadError && <p className="mt-2 text-sm text-rose-500">{uploadError}</p>}
            </div>
          </div>

          {/* Publish settings */}
          <div className="soft-card rounded-3xl p-6">
            <h3 className="text-sm font-bold">تنظیمات انتشار</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">دسته‌بندی</label>
                <input value={form.category} onChange={set("category")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">نویسنده</label>
                <input value={form.author} onChange={set("author")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">برچسب‌ها (با کاما جدا کنید)</label>
                <input value={form.tags} onChange={set("tags")} className={inputClass} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={set("published")} className="h-4 w-4 accent-primary" />
                منتشر شود
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-primary" />
                مقاله ویژه
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="soft-card rounded-3xl p-6">
            <button
              type="button"
              onClick={() => setSeoOpen((v) => !v)}
              className="flex w-full items-center justify-between"
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <Search className="h-4 w-4 text-primary" />
                تنظیمات سئو
              </span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${seoOpen ? "rotate-180" : ""}`} />
            </button>

            {seoOpen && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    عنوان سئو (Meta Title)
                  </label>
                  <input
                    value={form.metaTitle}
                    onChange={set("metaTitle")}
                    placeholder="در صورت خالی بودن از عنوان مقاله استفاده می‌شود"
                    className={inputClass}
                  />
                  <p className="mt-1 text-[11px] text-slate-400">{form.metaTitle.length}/60 حرف</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    توضیحات سئو (Meta Description)
                  </label>
                  <textarea
                    rows={3}
                    value={form.metaDescription}
                    onChange={set("metaDescription")}
                    placeholder="در صورت خالی بودن از خلاصه مقاله استفاده می‌شود"
                    className={`${inputClass} resize-none`}
                  />
                  <p className="mt-1 text-[11px] text-slate-400">{form.metaDescription.length}/160 حرف</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    کلمات کلیدی (با کاما جدا کنید)
                  </label>
                  <input
                    value={form.keywords}
                    onChange={set("keywords")}
                    placeholder="سئو، طراحی وب، گوگل"
                    className={inputClass}
                  />
                </div>
                {form.metaTitle && form.metaDescription && (
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-bold text-slate-400">پیش‌نمایش در گوگل:</p>
                    <p className="mt-1 truncate text-sm font-medium text-blue-600">{form.metaTitle}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-emerald-700">nexatech.ir/blog/...</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{form.metaDescription}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            پیش‌نویس به صورت خودکار ذخیره می‌شود
          </div>
        </div>
      </div>
    </form>
  );
}
