"use client";

import { useState } from "react";
import { Loader2, Star, Send, CheckCircle2 } from "lucide-react";

export function TestimonialForm() {
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: 5 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/testimonials", {
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
      setForm({ name: "", role: "", content: "", rating: 5 });
    } catch {
      setError("خطا در ارتباط با سرور");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 text-lg font-bold">از نظر شما سپاسگزاریم!</h3>
        <p className="mt-2 text-sm text-slate-600">
          نظر شما پس از بررسی توسط تیم ما نمایش داده می‌شود.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="نام شما" className={inputClass} />
        <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="سمت / شرکت (اختیاری)" className={inputClass} />
      </div>
      <textarea
        required
        rows={3}
        value={form.content}
        onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        placeholder="تجربه همکاری خود با ما را بنویسید..."
        className={`${inputClass} resize-none`}
      />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm((f) => ({ ...f, rating: r }))}
              aria-label={`${r} ستاره`}
            >
              <Star className={`h-6 w-6 transition-colors ${r <= form.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 disabled:opacity-60"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          ثبت نظر
        </button>
      </div>
      {status === "error" && <p className="text-sm text-rose-500">{error}</p>}
    </form>
  );
}
