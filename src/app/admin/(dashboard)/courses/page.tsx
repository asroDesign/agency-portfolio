"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, PlayCircle, ChevronDown } from "lucide-react";
import type { Course, CourseSession } from "@/db/schema";
import { formatNumber, cn } from "@/lib/utils";

const emptyForm = {
  title: "",
  description: "",
  coverUrl: "",
  level: "مقدماتی",
  instructor: "تیم نکسا تک",
  price: "0",
  totalDuration: "",
  published: true,
  featured: false,
};

const emptySession = { title: "", summary: "", videoUrl: "", duration: "", isPreview: false };

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Sessions
  const [sessionsOpen, setSessionsOpen] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Record<string, CourseSession[]>>({});
  const [sessionModal, setSessionModal] = useState<string | null>(null);
  const [sessionForm, setSessionForm] = useState(emptySession);
  const [sessionSaving, setSessionSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses ?? []);
    } catch {
      setError("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  function openCreate() { setEditing(null); setForm(emptyForm); setError(""); setModalOpen(true); }
  function openEdit(c: Course) {
    setEditing(c);
    setForm({ title: c.title, description: c.description, coverUrl: c.coverUrl ?? "", level: c.level, instructor: c.instructor, price: String(c.price), totalDuration: c.totalDuration ?? "", published: c.published, featured: c.featured });
    setError(""); setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const payload = { ...form, price: Number(form.price) || 0 };
    try {
      if (editing) {
        const optimistic: Course = { ...editing, ...payload, price: payload.price, updatedAt: new Date() };
        setCourses((l) => l.map((c) => (c.id === editing.id ? optimistic : c)));
        setModalOpen(false);
        const res = await fetch(`/api/courses/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setCourses((l) => l.map((c) => (c.id === data.course.id ? data.course : c)));
      } else {
        const tempId = `temp-${Date.now()}`;
        const temp: Course = { id: tempId, slug: tempId, ...payload, price: payload.price, coverUrl: payload.coverUrl || null, totalDuration: payload.totalDuration || null, createdAt: new Date(), updatedAt: new Date() };
        setCourses((l) => [temp, ...l]);
        setModalOpen(false); setForm(emptyForm);
        const res = await fetch("/api/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setCourses((l) => l.map((c) => (c.id === tempId ? data.course : c)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
      setModalOpen(true); await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(c: Course) {
    if (!confirm(`«${c.title}» حذف شود؟`)) return;
    setCourses((l) => l.filter((x) => x.id !== c.id));
    try { await fetch(`/api/courses/${c.id}`, { method: "DELETE" }); } catch { setError("خطا در حذف"); await load(); }
  }

  async function toggleSessions(courseId: string) {
    if (sessionsOpen === courseId) { setSessionsOpen(null); return; }
    setSessionsOpen(courseId);
    if (!sessions[courseId]) {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      setSessions((s) => ({ ...s, [courseId]: data.sessions ?? [] }));
    }
  }

  async function addSession(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionModal) return;
    setSessionSaving(true);
    try {
      const res = await fetch(`/api/courses/${sessionModal}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sessionForm, sortOrder: (sessions[sessionModal]?.length ?? 0) + 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setSessions((s) => ({ ...s, [sessionModal]: [...(s[sessionModal] ?? []), data.session] }));
      setSessionForm(emptySession); setSessionModal(null);
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); } finally { setSessionSaving(false); }
  }

  async function deleteSession(courseId: string, sessionId: string) {
    setSessions((s) => ({ ...s, [courseId]: (s[courseId] ?? []).filter((x) => x.id !== sessionId) }));
    try { await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" }); } catch { setError("خطا در حذف جلسه"); }
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">دوره‌های آموزشی</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{courses.length} دوره</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
          <Plus className="h-4 w-4" /> دوره جدید
        </button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
      ) : courses.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">🎓</p><p className="mt-4 font-semibold">هنوز دوره‌ای ساخته نشده است</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                  {c.coverUrl ? <img src={c.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl">🎓</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{c.title}</h3>
                    {c.featured && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-600 dark:text-amber-300">ویژه</span>}
                    {c.price <= 0 ? <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-600 dark:text-emerald-300">رایگان</span> : <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-600 dark:text-indigo-300">{formatNumber(c.price)} تومان</span>}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{c.description}</p>
                  <p className="mt-1 text-xs text-slate-400">{c.level} · {c.instructor} · {sessions[c.id]?.length ?? "—"} جلسه</p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button type="button" onClick={() => toggleSessions(c.id)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
                    <PlayCircle className="h-4 w-4" /> جلسات
                    <ChevronDown className={cn("h-4 w-4 transition-transform", sessionsOpen === c.id && "rotate-180")} />
                  </button>
                  <button type="button" onClick={() => openEdit(c)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300"><Pencil className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleDelete(c)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-500 dark:border-rose-500/20"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              {sessionsOpen === c.id && (
                <div className="border-t border-slate-100 p-4 dark:border-white/5">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400">جلسات دوره</h4>
                    <button type="button" onClick={() => { setSessionForm(emptySession); setSessionModal(c.id); }} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                      <Plus className="h-3.5 w-3.5" /> افزودن جلسه
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(sessions[c.id] ?? []).length === 0 && <p className="py-4 text-center text-sm text-slate-400">جلسه‌ای ثبت نشده است.</p>}
                    {(sessions[c.id] ?? []).map((s, i) => (
                      <div key={s.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-white/5">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{s.title}</p>
                          <p className="truncate text-xs text-slate-400">{s.summary}</p>
                        </div>
                        {s.isPreview && <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-300">پیش‌نمایش</span>}
                        {s.duration && <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{s.duration}</span>}
                        <button type="button" onClick={() => deleteSession(c.id, s.id)} className="shrink-0 text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Course modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0b0d1a]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editing ? "ویرایش دوره" : "دوره جدید"}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div><label className="mb-1.5 block text-sm font-medium">عنوان <span className="text-rose-500">*</span></label><input required value={form.title} onChange={set("title")} className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm font-medium">توضیحات <span className="text-rose-500">*</span></label><textarea required rows={3} value={form.description} onChange={set("description")} className={`${inputClass} resize-none`} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-medium">سطح</label><select value={form.level} onChange={set("level")} className={inputClass}><option>مقدماتی</option><option>متوسط</option><option>پیشرفته</option></select></div>
                <div><label className="mb-1.5 block text-sm font-medium">مدرس</label><input value={form.instructor} onChange={set("instructor")} className={inputClass} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-medium">قیمت (تومان — ۰ یعنی رایگان)</label><input type="number" min="0" value={form.price} onChange={set("price")} className={inputClass} /></div>
                <div><label className="mb-1.5 block text-sm font-medium">مدت کل دوره</label><input value={form.totalDuration} onChange={set("totalDuration")} placeholder="مثلاً ۵ ساعت" className={inputClass} /></div>
              </div>
              <div><label className="mb-1.5 block text-sm font-medium">تصویر کاور</label><input dir="ltr" value={form.coverUrl} onChange={set("coverUrl")} placeholder="https://..." className={inputClass} /></div>
              <div className="flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={set("published")} className="h-4 w-4 accent-indigo-500" /> منتشر شود</label>
                <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-indigo-500" /> دوره ویژه</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{editing ? "ذخیره" : "ایجاد"}</button>
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session modal */}
      {sessionModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setSessionModal(null)} />
          <div className="relative my-8 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0b0d1a]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">جلسه جدید</h2>
              <button type="button" onClick={() => setSessionModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={addSession} className="mt-5 space-y-4">
              <div><label className="mb-1.5 block text-sm font-medium">عنوان جلسه <span className="text-rose-500">*</span></label><input required value={sessionForm.title} onChange={(e) => setSessionForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm font-medium">خلاصه جلسه <span className="text-rose-500">*</span></label><textarea required rows={3} value={sessionForm.summary} onChange={(e) => setSessionForm((f) => ({ ...f, summary: e.target.value }))} className={`${inputClass} resize-none`} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-medium">آدرس ویدیو (یوتیوب/آپارات/فایل) <span className="text-rose-500">*</span></label><input required dir="ltr" type="url" value={sessionForm.videoUrl} onChange={(e) => setSessionForm((f) => ({ ...f, videoUrl: e.target.value }))} placeholder="https://youtube.com/..." className={inputClass} /></div>
                <div><label className="mb-1.5 block text-sm font-medium">مدت جلسه</label><input value={sessionForm.duration} onChange={(e) => setSessionForm((f) => ({ ...f, duration: e.target.value }))} placeholder="مثلاً ۲۵ دقیقه" className={inputClass} /></div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={sessionForm.isPreview} onChange={(e) => setSessionForm((f) => ({ ...f, isPreview: e.target.checked }))} className="h-4 w-4 accent-indigo-500" /> جلسه رایگان (پیش‌نمایش برای همه)</label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={sessionSaving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{sessionSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}افزودن جلسه</button>
                <button type="button" onClick={() => setSessionModal(null)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
