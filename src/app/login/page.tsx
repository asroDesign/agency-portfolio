"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail, User, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

function AuthForms() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const next = searchParams.get("next");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login" ? { email: form.email, password: form.password } : form,
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        setLoading(false);
        return;
      }
      if (mode === "login" && data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push(next || "/account");
      }
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col items-center">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">
          {mode === "login" ? "ورود به حساب کاربری" : "ایجاد حساب کاربری"}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {mode === "login"
            ? "برای دسترسی به دوره‌ها و خریدهای خود وارد شوید"
            : "ثبت‌نام رایگان و شروع یادگیری"}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "login" ? "bg-white text-indigo-600 shadow dark:bg-white/10 dark:text-indigo-300" : "text-slate-500"}`}
        >
          ورود
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "register" ? "bg-white text-indigo-600 shadow dark:bg-white/10 dark:text-indigo-300" : "text-slate-500"}`}
        >
          ثبت‌نام
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "register" && (
          <div className="relative">
            <User className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="نام و نام خانوادگی"
              className={inputClass}
            />
          </div>
        )}
        <div className="relative">
          <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            required
            dir="ltr"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            required
            dir="ltr"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder={mode === "register" ? "رمز عبور (حداقل ۶ حرف)" : "رمز عبور"}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              در حال پردازش...
            </>
          ) : (
            mode === "login" ? "ورود" : "ایجاد حساب"
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={() => router.push("/")}
        className="mt-5 inline-flex w-full items-center justify-center gap-1 text-sm text-slate-400 hover:text-indigo-500"
      >
        بازگشت به سایت
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 dark:bg-[#0b0d1a]">
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl animate-float-slow" />
      <div className="absolute left-4 top-4">
        <ThemeToggle />
      </div>
      <div className="relative w-full max-w-md">
        <Suspense>
          <AuthForms />
        </Suspense>
      </div>
    </div>
  );
}
