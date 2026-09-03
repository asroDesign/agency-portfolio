"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, CheckCircle2, LifeBuoy } from "lucide-react";

export function TemplateSupportForm({
  templateId,
  canSubmit,
  owned,
}: {
  templateId: string;
  canSubmit: boolean;
  owned: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, ...form }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login?next=" + encodeURIComponent(window.location.pathname));
        return;
      }
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({ subject: "", message: "" });
    } catch {
      setError("خطا در ارتباط با سرور");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500";

  if (!canSubmit) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
        <LifeBuoy className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        <p className="mt-3 font-semibold text-slate-600 dark:text-slate-300">
          پشتیبانی برای خریداران این قالب
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {owned
            ? "برای ارسال تیکت وارد حساب کاربری شوید."
            : "برای ارسال تیکت، ابتدا قالب را خریداری کنید."}
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="mt-3 text-lg font-bold">تیکت شما ثبت شد!</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          تیم پشتیبانی در اسرع وقت پاسخ شما را می‌دهد.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 dark:border-white/15 dark:text-slate-300"
        >
          ارسال تیکت جدید
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">موضوع تیکت</label>
        <input required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="مثلاً مشکل در نصب قالب" className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">پیام</label>
        <textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="مشکل خود را با جزئیات توضیح دهید..." className={`${inputClass} resize-none`} />
      </div>
      {status === "error" && <p className="text-sm text-rose-500">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        ارسال تیکت
      </button>
    </form>
  );
}
