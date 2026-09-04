"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Rocket } from "lucide-react";
import { SERVICE_OPTIONS, BUDGET_OPTIONS } from "@/lib/constants";

export function OrderForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: SERVICE_OPTIONS[0],
    budget: BUDGET_OPTIONS[1],
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/order", {
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
    } catch {
      setError("خطا در ارتباط با سرور");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h3 className="mt-5 text-2xl font-bold">سفارش شما ثبت شد! 🎉</h3>
        <p className="mt-3 max-w-md text-slate-600">
          از اعتماد شما سپاسگزاریم. کارشناسان ما در کمتر از ۲۴ ساعت کاری با شما تماس می‌گیرند تا
          جزئیات پروژه را بررسی کنند.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            نام و نام خانوادگی <span className="text-rose-500">*</span>
          </label>
          <input required value={form.name} onChange={update("name")} placeholder="مثلاً علی محمدی" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            ایمیل <span className="text-rose-500">*</span>
          </label>
          <input required type="email" dir="ltr" value={form.email} onChange={update("email")} placeholder="you@example.com" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            شماره تماس
          </label>
          <input dir="ltr" value={form.phone} onChange={update("phone")} placeholder="0912xxxxxxx" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            نوع خدمت <span className="text-rose-500">*</span>
          </label>
          <select value={form.service} onChange={update("service")} className={inputClass}>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          بودجه تقریبی
        </label>
        <select value={form.budget} onChange={update("budget")} className={inputClass}>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          توضیحات پروژه <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          rows={6}
          value={form.description}
          onChange={update("description")}
          placeholder="پروژه خود را توضیح دهید؛ اهداف، امکانات مورد نیاز و هر جزئیات دیگری که فکر می‌کنید مهم است..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال ثبت سفارش...
          </>
        ) : (
          <>
            <Rocket className="h-5 w-5" />
            ثبت سفارش پروژه
          </>
        )}
      </button>
      <p className="text-center text-xs text-slate-400">
        با ثبت سفارش، متعهد به پرداخت هیچ مبلغی نیستید. ما ابتدا با شما تماس می‌گیریم.
      </p>
    </form>
  );
}
