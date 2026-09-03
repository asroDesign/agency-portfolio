"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Star } from "lucide-react";
import type { BlogPost } from "@/db/schema";
import { formatDate, cn } from "@/lib/utils";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  coverUrl: "",
  category: "عمومی",
  author: "تیم نکسا تک",
  tags: "",
  published: true,
  featured: false,
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setError("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(p: BlogPost) {
    setEditing(p);
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverUrl: p.coverUrl ?? "",
      category: p.category,
      author: p.author,
      tags: (p.tags ?? []).join("، "),
      published: p.published,
      featured: p.featured,
    });
    setError("");
    setModalOpen(true);
  }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      tags: form.tags.split(/[،,]/).map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        const optimistic: BlogPost = { ...editing, ...payload, updatedAt: new Date() };
        setPosts((l) => l.map((p) => (p.id === editing.id ? optimistic : p)));
        setModalOpen(false);
        const res = await fetch(`/api/blog/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setPosts((l) => l.map((p) => (p.id === data.post.id ? data.post : p)));
      } else {
        const tempId = `temp-${Date.now()}`;
        const temp: BlogPost = { id: tempId, slug: tempId, ...payload, coverUrl: payload.coverUrl || null, tags: payload.tags, createdAt: new Date(), updatedAt: new Date() };
        setPosts((l) => [temp, ...l]);
        setModalOpen(false);
        setForm(emptyForm);
        const res = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا");
        setPosts((l) => l.map((p) => (p.id === tempId ? data.post : p)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
      setModalOpen(true);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: BlogPost) {
    if (!confirm(`«${p.title}» حذف شود؟`)) return;
    setPosts((l) => l.filter((x) => x.id !== p.id));
    try {
      const res = await fetch(`/api/blog/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setError("خطا در حذف");
      await load();
    }
  }

  async function togglePublish(p: BlogPost) {
    setPosts((l) => l.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)));
    await fetch(`/api/blog/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published }) });
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">وبلاگ</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{posts.length} مقاله</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
          <Plus className="h-4 w-4" /> مقاله جدید
        </button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">📝</p>
          <p className="mt-4 font-semibold">هنوز مقاله‌ای ننوشته‌اید</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                {p.coverUrl ? <img src={p.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl">📝</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{p.title}</h3>
                  {p.featured && <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-600 dark:text-amber-300"><Star className="h-3 w-3" /> ویژه</span>}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-400">{p.category}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{p.excerpt}</p>
                <p className="mt-1 text-xs text-slate-400">{p.author} · {formatDate(p.createdAt)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => togglePublish(p)} className={cn("rounded-xl border px-3 py-2 text-xs font-medium", p.published ? "border-emerald-200 text-emerald-600 dark:border-emerald-500/30" : "border-slate-200 text-slate-400 dark:border-white/10")}>
                  {p.published ? "منتشر شده" : "پیش‌نویس"}
                </button>
                <button type="button" onClick={() => openEdit(p)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300"><Pencil className="h-4 w-4" /> ویرایش</button>
                <button type="button" onClick={() => handleDelete(p)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-500 dark:border-rose-500/20"><Trash2 className="h-4 w-4" /> حذف</button>
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
              <h2 className="text-xl font-bold">{editing ? "ویرایش مقاله" : "مقاله جدید"}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div><label className="mb-1.5 block text-sm font-medium">عنوان <span className="text-rose-500">*</span></label><input required value={form.title} onChange={set("title")} className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm font-medium">خلاصه <span className="text-rose-500">*</span></label><textarea required rows={2} value={form.excerpt} onChange={set("excerpt")} className={`${inputClass} resize-none`} /></div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">محتوا <span className="text-rose-500">*</span></label>
                <textarea required rows={12} value={form.content} onChange={set("content")} className={`${inputClass} resize-none font-mono text-xs leading-6`} placeholder={"## عنوان بخش\n\nمتن مقاله...\n\n- مورد اول\n- مورد دوم"} />
                <p className="mt-1 text-[11px] text-slate-400">از «##» برای عنوان، «-» برای لیست و «**متن**» برای بولد استفاده کنید.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-medium">دسته‌بندی</label><input value={form.category} onChange={set("category")} className={inputClass} /></div>
                <div><label className="mb-1.5 block text-sm font-medium">نویسنده</label><input value={form.author} onChange={set("author")} className={inputClass} /></div>
              </div>
              <div><label className="mb-1.5 block text-sm font-medium">تصویر کاور</label><input dir="ltr" value={form.coverUrl} onChange={set("coverUrl")} placeholder="https://..." className={inputClass} /></div>
              <div><label className="mb-1.5 block text-sm font-medium">برچسب‌ها</label><input value={form.tags} onChange={set("tags")} placeholder="با کاما جدا کنید" className={inputClass} /></div>
              <div className="flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={set("published")} className="h-4 w-4 accent-indigo-500" /> منتشر شود</label>
                <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-indigo-500" /> مقاله ویژه</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{editing ? "ذخیره" : "انتشار"}</button>
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
