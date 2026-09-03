"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, MessageCircleQuestion } from "lucide-react";

export function AskQuestionForm({ templateId }: { templateId: string }) {
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/template-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({ name: "", email: "", question: "" });
    } catch {
      setError("خطا در ارتباط با سرور");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="mt-3 text-lg font-bold">سوال شما ثبت شد!</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          پاسخ شما پس از بررسی توسط تیم پشتیبانی در همین بخش نمایش داده می‌شود.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 dark:border-white/15 dark:text-slate-300"
        >
          پرسیدن سوال جدید
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="نام شما"
          className={inputClass}
        />
        <input
          type="email"
          dir="ltr"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="ایمیل (اختیاری)"
          className={inputClass}
        />
      </div>
      <textarea
        required
        rows={3}
        value={form.question}
        onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
        placeholder="سوال خود را درباره این قالب بنویسید..."
        className={`${inputClass} resize-none`}
      />
      {status === "error" && <p className="text-sm text-rose-500">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            در حال ثبت...
          </>
        ) : (
          <>
            <MessageCircleQuestion className="h-4 w-4" />
            ارسال سوال
          </>
        )}
      </button>
    </form>
  );
}
