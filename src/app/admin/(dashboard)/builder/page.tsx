"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  X,
  GripVertical,
  Eye,
  EyeOff,
  Pencil,
  ExternalLink,
  Save,
  CheckCircle2,
} from "lucide-react";
import type { PageSection } from "@/db/schema";
import { SECTION_META, SECTION_ORDER, type SectionType } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function BuilderPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [editing, setEditing] = useState<PageSection | null>(null);
  const [editForm, setEditForm] = useState({ title: "", subtitle: "", count: 3 });
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/page-sections");
      const data = await res.json();
      setSections(data.sections ?? []);
    } catch {
      setError("خطا در دریافت بخش‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addSection(type: SectionType) {
    try {
      const res = await fetch("/api/page-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setSections((s) => [...s, data.section]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    }
  }

  async function removeSection(id: string) {
    setSections((s) => s.filter((x) => x.id !== id));
    try {
      await fetch(`/api/page-sections/${id}`, { method: "DELETE" });
    } catch {
      setError("خطا در حذف بخش");
      await load();
    }
  }

  async function toggleSection(id: string) {
    setSections((s) => s.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)));
    const section = sections.find((s) => s.id === id);
    if (section) {
      await fetch(`/api/page-sections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !section.enabled }),
      });
    }
  }

  function openEdit(s: PageSection) {
    setEditing(s);
    setEditForm({ title: s.title ?? "", subtitle: s.subtitle ?? "", count: s.count });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/page-sections/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setSections((s) => s.map((x) => (x.id === editing.id ? data.section : x)));
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  // Drag & drop
  function onDragStart(index: number) {
    setDragIndex(index);
  }
  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setSections((s) => {
      const next = [...s];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }
  function onDragEnd() {
    setDragIndex(null);
    persistOrder();
  }

  async function persistOrder() {
    const ids = sections.map((s) => s.id);
    await fetch("/api/page-sections/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
  }

  async function saveAll() {
    setSaving(true);
    setSaved(false);
    await persistOrder();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const usedTypes = new Set(sections.map((s) => s.type));
  const availableTypes = SECTION_ORDER.filter((t) => !usedTypes.has(t));

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">صفحه‌ساز</h1>
          <p className="mt-1 text-sm text-slate-500">
            بخش‌های صفحه اصلی را با کشیدن و رها کردن مرتب کنید، ویرایش یا حذف نمایید.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
          >
            <ExternalLink className="h-4 w-4" /> مشاهده صفحه
          </a>
          <button
            type="button"
            onClick={saveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "ذخیره شد" : "ذخیره"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{error}</p>}

      {/* Palette */}
      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-4">
        <h3 className="text-sm font-bold text-slate-500">افزودن بخش جدید</h3>
        {availableTypes.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">همه بخش‌ها اضافه شده‌اند.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addSection(type)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
              >
                <Plus className="h-4 w-4" />
                {SECTION_META[type].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sections list */}
      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : sections.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center">
          <p className="text-5xl">🧱</p>
          <p className="mt-4 font-semibold">هیچ بخشی وجود ندارد. از بالا یک بخش اضافه کنید.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {sections.map((s, index) => (
            <div
              key={s.id}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
              className={cn(
                "flex cursor-grab items-center gap-3 rounded-2xl border bg-white p-3 transition-all active:cursor-grabbing",
                dragIndex === index ? "border-primary ring-2 ring-primary/20" : "border-slate-200",
                !s.enabled && "opacity-50",
              )}
            >
              <span className="shrink-0 cursor-grab text-slate-300"><GripVertical className="h-5 w-5" /></span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{SECTION_META[s.type as SectionType]?.label ?? s.type}</p>
                <p className="truncate text-xs text-slate-400">{s.title || "بدون عنوان"}</p>
              </div>
              <button type="button" onClick={() => toggleSection(s.id)} title={s.enabled ? "مخفی کردن" : "نمایش"} className="shrink-0 rounded-xl border border-slate-200 p-2 text-slate-500 hover:border-primary/40 hover:text-primary">
                {s.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button type="button" onClick={() => openEdit(s)} title="ویرایش" className="shrink-0 rounded-xl border border-slate-200 p-2 text-slate-500 hover:border-primary/40 hover:text-primary">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => removeSection(s.id)} title="حذف" className="shrink-0 rounded-xl border border-rose-200 p-2 text-rose-500 hover:bg-rose-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <p className="pt-2 text-center text-xs text-slate-400">برای جابه‌جایی، بخش‌ها را بکشید و رها کنید.</p>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative my-8 w-full max-w-lg soft-card rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">ویرایش بخش</h2>
              <button type="button" onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={saveEdit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">عنوان</label>
                <input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">زیرعنوان</label>
                <textarea rows={3} value={editForm.subtitle} onChange={(e) => setEditForm((f) => ({ ...f, subtitle: e.target.value }))} className={`${inputClass} resize-none`} />
              </div>
              {(editing.type === "portfolio" || editing.type === "courses" || editing.type === "blog") && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium">تعداد آیتم نمایش</label>
                  <input type="number" min={1} max={12} value={editForm.count} onChange={(e) => setEditForm((f) => ({ ...f, count: Number(e.target.value) }))} className={inputClass} />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} ذخیره
                </button>
                <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm text-slate-600">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
