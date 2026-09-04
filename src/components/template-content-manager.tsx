"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Loader2, BookOpen, HelpCircle, History } from "lucide-react";
import type { TemplateTutorial, TemplateFaq, TemplateUpdate } from "@/db/schema";
import { cn } from "@/lib/utils";

export function TemplateContentManager({ templateId }: { templateId: string }) {
  const [tab, setTab] = useState<"tutorial" | "faq" | "update">("tutorial");
  const [tutorials, setTutorials] = useState<TemplateTutorial[]>([]);
  const [faqs, setFaqs] = useState<TemplateFaq[]>([]);
  const [updates, setUpdates] = useState<TemplateUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [t, f, u] = await Promise.all([
      fetch(`/api/templates/${templateId}/content?kind=tutorial`).then((r) => r.json()),
      fetch(`/api/templates/${templateId}/content?kind=faq`).then((r) => r.json()),
      fetch(`/api/templates/${templateId}/content?kind=update`).then((r) => r.json()),
    ]);
    setTutorials(t.items ?? []);
    setFaqs(f.items ?? []);
    setUpdates(u.items ?? []);
    setLoading(false);
  }, [templateId]);

  useEffect(() => { load(); }, [load]);

  async function addItem(kind: string, payload: Record<string, unknown>) {
    setBusy(true);
    await fetch("/api/template-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, templateId, ...payload }),
    });
    await load();
    setBusy(false);
  }

  async function removeItem(kind: string, id: string) {
    if (!confirm("حذف شود؟")) return;
    await fetch(`/api/template-content/${id}?kind=${kind}`, { method: "DELETE" });
    await load();
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
      <h3 className="flex items-center gap-2 text-sm font-bold"><BookOpen className="h-4 w-4" /> محتوای قالب (آموزش، پرسش‌وپاسخ، بروزرسانی)</h3>

      <div className="mt-4 flex gap-1 border-b border-slate-200 dark:border-white/10">
        {([["tutorial", "آموزش‌ها", BookOpen], ["faq", "پرسش و پاسخ", HelpCircle], ["update", "بروزرسانی‌ها", History]] as const).map(([key, label, Icon]) => (
          <button key={key} type="button" onClick={() => setTab(key)} className={cn("-mb-px inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-semibold", tab === key ? "border-indigo-500 text-indigo-600 dark:text-indigo-300" : "border-transparent text-slate-500 dark:text-slate-400")}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
      ) : (
        <div className="mt-5">
          {tab === "tutorial" && (
            <div>
              <TutorialForm busy={busy} onSubmit={(p) => addItem("tutorial", p)} />
              <div className="mt-4 space-y-2">
                {tutorials.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/5">
                    <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">{t.type === "video" ? "ویدیو" : "متن"}</span>
                    <p className="flex-1 truncate text-sm font-medium">{t.title}</p>
                    <button type="button" onClick={() => removeItem("tutorial", t.id)} className="text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "faq" && (
            <div>
              <FaqForm busy={busy} onSubmit={(p) => addItem("faq", p)} />
              <div className="mt-4 space-y-2">
                {faqs.map((f) => (
                  <div key={f.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/5">
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

          {tab === "update" && (
            <div>
              <UpdateForm busy={busy} onSubmit={(p) => addItem("update", p)} />
              <div className="mt-4 space-y-2">
                {updates.map((u) => (
                  <div key={u.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/5">
                    <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-300">نسخه {u.version}</span>
                    <p className="flex-1 text-sm font-medium">{u.title}</p>
                    <button type="button" onClick={() => removeItem("update", u.id)} className="text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TutorialForm({ onSubmit, busy }: { onSubmit: (p: Record<string, unknown>) => void; busy: boolean }) {
  const [f, setF] = useState({ title: "", type: "video", videoUrl: "", content: "" });
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title: f.title, type: f.type, videoUrl: f.videoUrl, content: f.content, sortOrder: 0 }); setF({ title: "", type: "video", videoUrl: "", content: "" }); }} className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/15">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={f.title} onChange={(e) => setF((x) => ({ ...x, title: e.target.value }))} placeholder="عنوان آموزش" className={inputClass} />
        <select value={f.type} onChange={(e) => setF((x) => ({ ...x, type: e.target.value }))} className={inputClass}>
          <option value="video">ویدیو</option><option value="text">متن</option>
        </select>
      </div>
      {f.type === "video" ? <input dir="ltr" value={f.videoUrl} onChange={(e) => setF((x) => ({ ...x, videoUrl: e.target.value }))} placeholder="https://youtube.com/..." className={inputClass} /> : <textarea rows={3} value={f.content} onChange={(e) => setF((x) => ({ ...x, content: e.target.value }))} placeholder="متن آموزش..." className={cn(inputClass, "resize-none")} />}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><Plus className="h-4 w-4" /> افزودن</button>
    </form>
  );
}

function FaqForm({ onSubmit, busy }: { onSubmit: (p: Record<string, unknown>) => void; busy: boolean }) {
  const [f, setF] = useState({ question: "", answer: "" });
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...f, sortOrder: 0 }); setF({ question: "", answer: "" }); }} className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/15">
      <input required value={f.question} onChange={(e) => setF((x) => ({ ...x, question: e.target.value }))} placeholder="سوال" className={inputClass} />
      <textarea required rows={2} value={f.answer} onChange={(e) => setF((x) => ({ ...x, answer: e.target.value }))} placeholder="پاسخ" className={cn(inputClass, "resize-none")} />
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><Plus className="h-4 w-4" /> افزودن</button>
    </form>
  );
}

function UpdateForm({ onSubmit, busy }: { onSubmit: (p: Record<string, unknown>) => void; busy: boolean }) {
  const [f, setF] = useState({ version: "", title: "", changes: "" });
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); setF({ version: "", title: "", changes: "" }); }} className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/15">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={f.version} onChange={(e) => setF((x) => ({ ...x, version: e.target.value }))} placeholder="نسخه" className={inputClass} />
        <input required value={f.title} onChange={(e) => setF((x) => ({ ...x, title: e.target.value }))} placeholder="عنوان بروزرسانی" className={inputClass} />
      </div>
      <textarea required rows={3} value={f.changes} onChange={(e) => setF((x) => ({ ...x, changes: e.target.value }))} placeholder="تغییرات (هر خط یک مورد)" className={cn(inputClass, "resize-none")} />
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><Plus className="h-4 w-4" /> افزودن</button>
    </form>
  );
}
