"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, CheckCircle2, Download } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function BuyButton({
  templateId,
  price,
  owned,
  downloadUrl,
}: {
  templateId: string;
  price: number;
  owned: boolean;
  downloadUrl: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pay/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login?next=" + encodeURIComponent(window.location.pathname));
        return;
      }
      if (data.alreadyOwned) {
        router.push("/account/templates");
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

  if (owned) {
    return (
      <div className="space-y-3">
        <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-bold text-white">
          <CheckCircle2 className="h-5 w-5" />
          این قالب را خریده‌اید
        </div>
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300"
          >
            <Download className="h-4 w-4" />
            دانلود قالب
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleBuy}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال پردازش...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            خرید قالب — {formatNumber(price)} تومان
          </>
        )}
      </button>
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </div>
  );
}
