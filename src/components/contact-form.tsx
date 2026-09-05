"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, LockKeyhole, Loader2, Paperclip, Send } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("خطا در ارتباط با سرور");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-base-content/8 bg-white px-4 py-3 text-sm text-base-content shadow-none placeholder:text-base-content/35 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 motion-reduce:transition-none";

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        <h3 className="mt-4 text-xl font-bold">پیام شما ارسال شد!</h3>
        <p className="mt-2 text-sm leading-7 text-base-content/65">
          ممنون از پیام‌تان. در اسرع وقت با شما تماس می‌گیریم.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn btn-outline mt-6 rounded-xl border-base-content/10 text-sm font-semibold shadow-none hover:border-primary hover:bg-primary hover:text-primary-content"
        >
          ارسال پیام جدید
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-base-content/75">
            نام و نام خانوادگی
          </label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            placeholder="مثلاً علی محمدی"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-base-content/75">
            ایمیل
          </label>
          <input
            required
            type="email"
            dir="ltr"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-base-content/75">
          موضوع
        </label>
        <div className="relative">
        <select
          required
          value={form.subject}
          onChange={update("subject")}
          aria-label="موضوع پیام"
          className={`${inputClass} appearance-none pl-10`}
        >
          <option value="">موضوع پیام را انتخاب کنید</option>
          <option value="طراحی وب‌سایت">طراحی وب‌سایت</option>
          <option value="توسعه اپلیکیشن">توسعه اپلیکیشن</option>
          <option value="سئو و رشد">سئو و رشد</option>
          <option value="مشاوره">مشاوره</option>
          <option value="سایر">سایر</option>
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-base-content/75">
          پیام
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          placeholder="پیام خود را بنویسید..."
          className={`${inputClass} min-h-36 resize-y leading-7`}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 pt-1">
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary min-h-12 w-3/5 gap-2 rounded-xl border-0 text-sm font-semibold shadow-none transition-colors disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              در حال ارسال...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              ارسال پیام
            </>
          )}
        </button>
        <button type="button" disabled title="ارسال پیوست هنوز در دسترس نیست" className="flex shrink-0 items-center gap-2 text-sm text-base-content/45 disabled:cursor-not-allowed">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-base-content/60">
            <Paperclip className="h-5 w-5" />
          </span>
          <span className="hidden sm:block">پیوست فایل<br /><small>به‌زودی</small></span>
        </button>
      </div>
      <p className="flex items-center justify-end gap-1 text-xs leading-6 text-base-content/50">
        <LockKeyhole className="h-3.5 w-3.5" /> اطلاعات شما نزد ما محفوظ است و فقط برای پاسخگویی استفاده می‌شود.
      </p>
    </form>
  );
}
