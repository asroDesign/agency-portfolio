"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Trash2, Send, CheckCircle2, Mail, ChevronDown, MessageCircleQuestion } from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";

type Question = {
  id: string;
  templateId: string;
  name: string;
  email: string | null;
  question: string;
  answer: string | null;
  answered: boolean;
  createdAt: string;
  updatedAt: string;
  templateTitle: string | null;
};

export default function QuestionsAdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "answered">("all");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/template-questions");
      const data = await res.json();
      setQuestions(data.questions ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function submitAnswer(id: string) {
    const answer = answers[id]?.trim();
    if (!answer) return;
    setSending(id);
    try {
      await fetch(`/api/template-questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      setAnswers((a) => ({ ...a, [id]: "" }));
      await load();
    } finally { setSending(null); }
  }

  async function del(id: string) {
    if (!confirm("این سوال حذف شود؟")) return;
    await fetch(`/api/template-questions/${id}`, { method: "DELETE" });
    await load();
  }

  const filtered = questions.filter((q) =>
    filter === "all" ? true : filter === "pending" ? !q.answered : q.answered,
  );
  const pendingCount = questions.filter((q) => !q.answered).length;

  const filterBtn = (key: typeof filter, label: string, count?: number) => (
    <button
      type="button"
      onClick={() => setFilter(key)}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        filter === key
          ? "border-transparent bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
          : "border-slate-200 text-slate-600 hover:border-indigo-300 dark:border-white/10 dark:text-slate-300",
      )}
    >
      {label}
      {count !== undefined && ` (${count})`}
    </button>
  );

  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">سوالات کاربران</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {pendingCount > 0 ? `${pendingCount} سوال در انتظار پاسخ` : "همه سوالات پاسخ داده شده‌اند"}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        {filterBtn("all", "همه", questions.length)}
        {filterBtn("pending", "در انتظار پاسخ", pendingCount)}
        {filterBtn("answered", "پاسخ داده شده", questions.length - pendingCount)}
      </div>

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <MessageCircleQuestion className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">سوالی وجود ندارد</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((q) => (
            <div key={q.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setOpenId(openId === q.id ? null : q.id)}
                className="flex w-full items-start gap-3 p-4 text-right"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {q.answered ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> پاسخ داده شده
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-300">
                        در انتظار پاسخ
                      </span>
                    )}
                    {q.templateTitle && <span className="text-xs text-slate-400">قالب: {q.templateTitle}</span>}
                  </div>
                  <p className="mt-1 font-semibold">{q.question}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>{q.name}</span>
                    {q.email && (
                      <a href={`mailto:${q.email}`} className="inline-flex items-center gap-1 hover:text-indigo-500" onClick={(e) => e.stopPropagation()}>
                        <Mail className="h-3 w-3" />
                        <span dir="ltr">{q.email}</span>
                      </a>
                    )}
                    <span>{formatDateTime(q.createdAt)}</span>
                  </div>
                </div>
                <ChevronDown className={cn("mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform", openId === q.id && "rotate-180")} />
              </button>

              {openId === q.id && (
                <div className="border-t border-slate-100 p-4 dark:border-white/5">
                  {q.answered && q.answer && (
                    <div className="mb-4 rounded-2xl bg-emerald-500/5 p-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-300">پاسخ فعلی:</span>
                      <p className="mt-1">{q.answer}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <textarea
                      rows={3}
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                      placeholder={q.answered ? "ویرایش پاسخ..." : "پاسخ خود را بنویسید..."}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => submitAnswer(q.id)}
                        disabled={sending === q.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {sending === q.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {q.answered ? "بروزرسانی" : "پاسخ"}
                      </button>
                      <button
                        type="button"
                        onClick={() => del(q.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 dark:border-rose-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
