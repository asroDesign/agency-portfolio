"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, ArrowRight, ImagePlus, Plus, Pencil, Trash2, Video, X, Upload } from "lucide-react";
import type { Course, CourseSession } from "@/db/schema";
import { RichEditor } from "@/components/rich-editor";

export function CourseForm({ initial, sessions: initialSessions }: { initial?: Course; sessions: CourseSession[] }) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    coverUrl: initial?.coverUrl ?? "",
    level: initial?.level ?? "مقدماتی",
    instructor: initial?.instructor ?? "تیم نکسا تک",
    price: String(initial?.price ?? 0),
    totalDuration: initial?.totalDuration ?? "",
    published: initial?.published ?? true,
    featured: initial?.featured ?? false,
  });

  const [sessions, setSessions] = useState<CourseSession[]>(initialSessions);
  const [sessionModal, setSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<CourseSession | null>(null);
  const [sessionForm, setSessionForm] = useState({ title: "", summary: "", videoUrl: "", duration: "", isPreview: false });
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setForm((f) => ({ ...f, coverUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  }

  async function uploadVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "video");
      const res = await fetch("/api/upload-file", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setSessionForm((f) => ({ ...f, videoUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری ویدیو");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  }

  function openAddSession() {
    setEditingSession(null);
    setSessionForm({ title: "", summary: "", videoUrl: "", duration: "", isPreview: false });
    setSessionModal(true);
  }

  function openEditSession(s: CourseSession) {
    setEditingSession(s);
    setSessionForm({ title: s.title, summary: s.summary, videoUrl: s.videoUrl, duration: s.duration ?? "", isPreview: s.isPreview });
    setSessionModal(true);
  }

  async function saveSession(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingSession) {
        const res = await fetch(`/api/sessions/${editingSession.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sessionForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setSessions((list) => list.map((s) => (s.id === editingSession.id ? data.session : s)));
      } else {
        const res = await fetch(`/api/courses/${initial!.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...sessionForm, sortOrder: sessions.length + 1 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setSessions((list) => [...list, data.session]);
      }
      setSessionModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSession(id: string) {
    if (!confirm("این جلسه حذف شود؟")) return;
    setSessions((list) => list.filter((s) => s.id !== id));
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, price: Number(form.price) || 0 };
    try {
      const res = await fetch(isEdit ? `/api/courses/${initial!.id}` : "/api/courses", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      router.push("/admin/courses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-500 dark:text-slate-400">
          <ArrowRight className="h-4 w-4" /> بازگشت
        </Link>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "ذخیره تغییرات" : "ایجاد دوره"}
        </button>
      </div>

      {error && <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <label className="mb-1.5 block text-sm font-medium">عنوان دوره <span className="text-rose-500">*</span></label>
            <input required value={form.title} onChange={set("title")} className={`${inputClass} text-lg font-semibold`} />

            <label className="mb-1.5 mt-5 block text-sm font-medium">توضیحات دوره</label>
            <RichEditor value={form.description} onChange={(html) => setForm((f) => ({ ...f, description: html }))} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-bold">تصویر کاور</h3>
            <div className="mt-3">
              {form.coverUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverUrl} alt="کاور" className="aspect-[16/9] w-full object-cover" />
                  <button type="button" onClick={() => setForm((f) => ({ ...f, coverUrl: "" }))} className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white">حذف</button>
                </div>
              ) : (
                <label className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/15">
                  {uploadingCover ? <Loader2 className="h-8 w-8 animate-spin" /> : <><ImagePlus className="h-8 w-8" /><span className="text-sm font-medium">بارگذاری تصویر</span></>}
                  <input type="file" accept="image/*" onChange={uploadCover} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-bold">تنظیمات دوره</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">سطح</label>
                <select value={form.level} onChange={set("level")} className={inputClass}>
                  <option>مقدماتی</option><option>متوسط</option><option>پیشرفته</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">مدرس</label>
                <input value={form.instructor} onChange={set("instructor")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">قیمت (تومان — ۰ = رایگان)</label>
                <input type="number" min="0" value={form.price} onChange={set("price")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-600 dark:text-slate-300">مدت کل</label>
                <input value={form.totalDuration} onChange={set("totalDuration")} className={inputClass} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={set("published")} className="h-4 w-4 accent-indigo-500" /> منتشر شود</label>
              <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-indigo-500" /> دوره ویژه</label>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions */}
      {isEdit && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">جلسات دوره ({sessions.length})</h3>
            <button type="button" onClick={openAddSession} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
              <Plus className="h-4 w-4" /> افزودن جلسه
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {sessions.length === 0 && <p className="py-6 text-center text-sm text-slate-400">جلسه‌ای ثبت نشده است.</p>}
            {sessions.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-white/5">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.title}</p>
                  <p className="truncate text-xs text-slate-400">{s.summary}</p>
                </div>
                {s.isPreview && <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-300">پیش‌نمایش</span>}
                <button type="button" onClick={() => openEditSession(s)} className="shrink-0 rounded-lg border border-slate-200 p-1.5 text-slate-500 dark:border-white/10 dark:text-slate-300"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => deleteSession(s.id)} className="shrink-0 rounded-lg border border-rose-200 p-1.5 text-rose-500 dark:border-rose-500/20"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session modal */}
      {sessionModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setSessionModal(false)} />
          <div className="relative my-8 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0b0d1a]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingSession ? "ویرایش جلسه" : "جلسه جدید"}</h2>
              <button type="button" onClick={() => setSessionModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={saveSession} className="mt-5 space-y-4">
              <div><label className="mb-1.5 block text-sm font-medium">عنوان جلسه <span className="text-rose-500">*</span></label><input required value={sessionForm.title} onChange={(e) => setSessionForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm font-medium">خلاصه جلسه <span className="text-rose-500">*</span></label><textarea required rows={3} value={sessionForm.summary} onChange={(e) => setSessionForm((f) => ({ ...f, summary: e.target.value }))} className={`${inputClass} resize-none`} /></div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">ویدیو (آدرس یا بارگذاری فایل)</label>
                <div className="flex gap-2">
                  <input dir="ltr" value={sessionForm.videoUrl} onChange={(e) => setSessionForm((f) => ({ ...f, videoUrl: e.target.value }))} placeholder="https://youtube.com/... یا /uploads/..." className={inputClass} />
                  <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:text-slate-300">
                    {uploadingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    بارگذاری
                    <input type="file" accept="video/*" onChange={uploadVideo} className="hidden" />
                  </label>
                </div>
              </div>
              <div><label className="mb-1.5 block text-sm font-medium">مدت جلسه</label><input value={sessionForm.duration} onChange={(e) => setSessionForm((f) => ({ ...f, duration: e.target.value }))} placeholder="مثلاً ۲۵ دقیقه" className={inputClass} /></div>
              <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={sessionForm.isPreview} onChange={(e) => setSessionForm((f) => ({ ...f, isPreview: e.target.checked }))} className="h-4 w-4 accent-indigo-500" /> جلسه رایگان (پیش‌نمایش)</label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{editingSession ? "ذخیره" : "افزودن"}</button>
                <button type="button" onClick={() => setSessionModal(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </form>
  );
}
