"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ورود ناموفق");
        setLoading(false);
        return;
      }
      const role = data.user?.role;
      const next = searchParams.get("next") || (role === "admin" ? "/admin" : "/account");
      router.push(next);
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          ایمیل
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@nexatech.ir"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          رمز عبور
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            required
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            در حال ورود...
          </>
        ) : (
          "ورود به پنل مدیریت"
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 dark:bg-[#0b0d1a]">
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl animate-float-slow" />

      <div className="relative w-full max-w-md">
        <div className="absolute left-4 top-4">
          <ThemeToggle />
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col items-center">
            <Logo />
            <h1 className="mt-6 text-2xl font-bold">ورود به پنل مدیریت</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              برای ادامه، اطلاعات خود را وارد کنید
            </p>
          </div>
          <div className="mt-8">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <div className="mt-6 rounded-xl bg-indigo-500/5 p-3 text-center text-xs text-slate-500 dark:text-slate-400">
            ایمیل: <span dir="ltr" className="font-mono">admin@nexatech.ir</span> — رمز:{" "}
            <span dir="ltr" className="font-mono">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
