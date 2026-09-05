"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, CheckCircle2, Play } from "lucide-react";

export function EnrollButton({
  courseId,
  price,
  enrolled,
}: {
  courseId: string;
  price: number;
  enrolled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFree = !price || price <= 0;

  async function handleEnroll() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pay/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();

      if (res.status === 401) {
        router.push("/login?next=" + encodeURIComponent(window.location.pathname));
        return;
      }
      if (data.alreadyEnrolled || data.status === "free") {
        router.push("/account/courses");
        return;
      }
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      setError(data.error || "خطایی رخ داد");
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  if (enrolled) {
    return (
      <button
        type="button"
        onClick={() => router.push("/account/courses")}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold leading-6 text-white transition-colors hover:bg-emerald-600"
      >
        <CheckCircle2 className="h-5 w-5" />
        شما در این دوره ثبت‌نام کرده‌اید — مشاهده جلسات
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال پردازش...
          </>
        ) : isFree ? (
          <>
            <Play className="h-5 w-5" />
            ثبت‌نام رایگان در دوره
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            ثبت‌نام و پرداخت
          </>
        )}
      </button>
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </div>
  );
}
