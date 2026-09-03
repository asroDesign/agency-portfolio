"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Template, TemplateTutorial, TemplateFaq, TemplateUpdate } from "@/db/schema";
import { cn } from "@/lib/utils";

export default function TemplateContentAdminPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [tab, setTab] = useState<"tutorial" | "faq" | "update">("tutorial");
  const [tutorials, setTutorials] = useState<TemplateTutorial[]>([]);
  const [faqs, setFaqs] = useState<TemplateFaq[]>([]);
  const [updates, setUpdates] = useState<TemplateUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTemplates = useCallback(async () => {
    const res = await fetch("/api/templates");
    const data = await res.json();
    setTemplates(data.templates ?? []);
    if (data.templates?.length) setSelectedId((s) => s || data.templates[0].id);
    setLoading(false);
  }, []);

  useEffect(() => { loadTemplates(); }, [loadTemplates]);

  const loadContent = useCallback(async (id: string) => {
    if (!id) return;
    const [t, f, u] = await Promise.all([
      fetch(`/api/templates/${id}/content?kind=tutorial`).then((r) => r.json()),
      fetch(`/api/templates/${id}/content?kind=faq`).then((r) => r.json()),
      fetch(`/api/templates/${id}/content?kind=update`).then((r) => r.json()),
    ]);
    setTutorials(t.items ?? []);
    setFaqs(f.items ?? []);
    setUpdates(u.items ?? []);
  }, []);

  useEffect(() => { loadContent(selectedId); }, [selectedId, loadContent]);

  async function addItem(kind: string, payload: Record<string, unknown>) {
    await fetch("/api/template-content", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, templateId: selectedId, ...payload }),
    });
    loadContent(selectedId);
  }

  async function removeItem(kind: string, id: string) {
    await fetch(`/api/template-content/${id}?kind=${kind}`, { method: "DELETE" });
    loadContent(selectedId);
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white";

  if (loading) return <div className="mt-16 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">محتوای قالب‌ها</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">مدیریت آموزش‌ها، پرسش‌وپاسخ و تاریخچه بروزرسانی هر قالب</p>

      <div className="mt-6">
        <label className="mb-1.5 block text-sm font-medium">انتخاب قالب</label>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className={cn(inputClass, "max-w-md")}>
          {templates.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      <div className="mt-6 flex gap-1 border-b border-slate-200 dark:border-white/10">
        {([["tutorial", "آموزش‌ها"], ["faq", "پرسش و پاسخ"], ["update", "بروزرسانی‌ها"]] as const).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)} className={cn("-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold", tab === key ? "border-indigo-500 text-indigo-600 dark:text-indigo-300" : "border-transparent text-slate-500 dark:text-slate-400")}>
            {label}
          </button>
        ))}
      </div>

      {/* Tutorials */}
      {tab === "tutorial" && (
        <div className="mt-5">
          <TutorialForm onSubmit={(p) => addItem("tutorial", p)} />
          <div className="mt-4 space-y-2">
            {tutorials.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
                <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">{t.type === "video" ? "ویدیو" : "متن"}</span>
                <p className="flex-1 truncate text-sm font-medium">{t.title}</p>
                <button type="button" onClick={() => removeItem("tutorial", t.id)} className="text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {tab === "faq" && (
        <div className="mt-5">
          <FaqForm onSubmit={(p) => addItem("faq", p)} />
          <div className="mt-4 space-y-2">
            {faqs.map((f) => (
              <div key={f.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{f.question}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{f.answer}</p>
                </div>
                <button type="button" onClick={() => removeItem("faq", f.id)} className="text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Updates */}
      {tab === "update" && (
        <div className="mt-5">
          <UpdateForm onSubmit={(p) => addItem("update", p)} />
          <div className="mt-4 space-y-2">
            {updates.map((u) => (
              <div key={u.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
                <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-300">نسخه {u.version}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{u.title}</p>
                </div>
                <button type="button" onClick={() => removeItem("update", u.id)} className="text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TutorialForm({ onSubmit }: { onSubmit: (p: Record<string, unknown>) => void }) {
  const [f, setF] = useState({ title: "", type: "video", videoUrl: "", content: "" });
  const [busy, setBusy] = useState(false);
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await onSubmit({ title: f.title, type: f.type, videoUrl: f.videoUrl, content: f.content, sortOrder: 0 });
    setF({ title: "", type: "video", videoUrl: "", content: "" });
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/15">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={f.title} onChange={(e) => setF((x) => ({ ...x, title: e.target.value }))} placeholder="عنوان آموزش" className={inputClass} />
        <select value={f.type} onChange={(e) => setF((x) => ({ ...x, type: e.target.value }))} className={inputClass}>
          <option value="video">ویدیو</option>
          <option value="text">متن</option>
        </select>
      </div>
      {f.type === "video" ? (
        <input dir="ltr" type="url" value={f.videoUrl} onChange={(e) => setF((x) => ({ ...x, videoUrl: e.target.value }))} placeholder="https://youtube.com/..." className={inputClass} />
      ) : (
        <textarea rows={4} value={f.content} onChange={(e) => setF((x) => ({ ...x, content: e.target.value }))} placeholder="متن آموزش..." className={cn(inputClass, "resize-none")} />
      )}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        <Plus className="h-4 w-4" /> افزودن آموزش
      </button>
    </form>
  );
}

function FaqForm({ onSubmit }: { onSubmit: (p: Record<string, unknown>) => void }) {
  const [f, setF] = useState({ question: "", answer: "" });
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...f, sortOrder: 0 }); setF({ question: "", answer: "" }); }} className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/15">
      <input required value={f.question} onChange={(e) => setF((x) => ({ ...x, question: e.target.value }))} placeholder="سوال" className={inputClass} />
      <textarea required rows={2} value={f.answer} onChange={(e) => setF((x) => ({ ...x, answer: e.target.value }))} placeholder="پاسخ" className={cn(inputClass, "resize-none")} />
      <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> افزودن سوال</button>
    </form>
  );
}

function UpdateForm({ onSubmit }: { onSubmit: (p: Record<string, unknown>) => void }) {
  const [f, setF] = useState({ version: "", title: "", changes: "" });
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); setF({ version: "", title: "", changes: "" }); }} className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/15">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={f.version} onChange={(e) => setF((x) => ({ ...x, version: e.target.value }))} placeholder="نسخه (مثلاً ۱.۲.۰)" className={inputClass} />
        <input required value={f.title} onChange={(e) => setF((x) => ({ ...x, title: e.target.value }))} placeholder="عنوان بروزرسانی" className={inputClass} />
      </div>
      <textarea required rows={3} value={f.changes} onChange={(e) => setF((x) => ({ ...x, changes: e.target.value }))} placeholder="تغییرات (هر خط یک مورد)" className={cn(inputClass, "resize-none")} />
      <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> افزودن بروزرسانی</button>
    </form>
  );
}
