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
    "w-full rounded-2xl border border-base-content/8 bg-white px-4 py-3 text-sm text-base-content shadow-none placeholder:text-base-content/35 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 motion-reduce:transition-none";

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center sm:p-10">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 text-lg font-bold">از نظر شما سپاسگزاریم!</h3>
        <p className="mt-2 text-sm text-slate-600">
          نظر شما پس از بررسی توسط تیم ما نمایش داده می‌شود.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-busy={status === "loading"}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-base-content/75">نام شما</span>
          <input required autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="نام و نام خانوادگی" className={`input h-12 ${inputClass}`} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-base-content/75">سمت / شرکت <span className="font-normal text-base-content/40">(اختیاری)</span></span>
          <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="سمت یا نام شرکت شما" className={`input h-12 ${inputClass}`} />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-base-content/75">تجربه شما</span>
      <textarea
        required
        rows={4}
        value={form.content}
        onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        placeholder="تجربه همکاری خود با ما را بنویسید..."
        className={`textarea ${inputClass} min-h-36 resize-y leading-7`}
      />
      </label>
      <div className="flex flex-col items-center gap-6 pt-2">
        <fieldset className="text-center">
          <legend className="mb-2 w-full text-sm text-base-content/60">به تجربه همکاری خود امتیاز دهید</legend>
        <div className="flex justify-center" dir="ltr">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm((f) => ({ ...f, rating: r }))}
              aria-label={`${r} ستاره`}
              aria-pressed={form.rating === r}
              className="flex h-11 w-11 items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Star className={`h-6 w-6 transition-colors ${r <= form.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
            </button>
          ))}
        </div>
        </fieldset>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary min-h-12 w-full gap-2 rounded-xl border-0 px-9 font-semibold shadow-none sm:w-auto"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          ثبت نظر
        </button>
      </div>
      {status === "error" && <p role="alert" className="text-center text-sm text-error">{error}</p>}
    </form>
  );
}
