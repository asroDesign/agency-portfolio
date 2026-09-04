"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, CheckCircle2, Download, Package, FileText, Settings2 } from "lucide-react";
import type { Addon } from "@/db/schema";
import { formatNumber } from "@/lib/utils";

export function PurchaseBox({
  templateId,
  price,
  owned,
  addons,
}: {
  templateId: string;
  price: number;
  owned: boolean;
  addons: Addon[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addonsTotal = addons.filter((a) => selected.has(a.id)).reduce((s, a) => s + a.price, 0);
  const total = price + addonsTotal;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBuy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pay/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, addonIds: Array.from(selected) }),
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
          <CheckCircle2 className="h-5 w-5" /> این قالب را خریده‌اید
        </div>
        <a href={`/api/download?type=template&id=${templateId}`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/10">
          <Download className="h-4 w-4" /> دانلود قالب
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Addons */}
      {addons.length > 0 && (
        <div className="rounded-2xl border border-slate-200 p-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Package className="h-4 w-4 text-primary" /> ادان‌های قابل انتخاب
          </h4>
          <div className="mt-2 space-y-2">
            {addons.map((a) => (
              <label key={a.id} className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-100 p-2.5 transition-colors hover:border-primary/25">
                <input
                  type="checkbox"
                  checked={selected.has(a.id)}
                  onChange={() => toggle(a.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {a.type === "file" ? <FileText className="h-3.5 w-3.5 text-primary" /> : <Settings2 className="h-3.5 w-3.5 text-emerald-500" />}
                    <span className="text-sm font-medium">{a.name}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{a.description}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-slate-700">
                  {a.price > 0 ? formatNumber(a.price) : "رایگان"}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Total + buy */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
        <span className="text-sm text-slate-500">جمع کل</span>
        <span className="text-lg font-extrabold text-slate-900">
          {formatNumber(total)} <span className="text-xs font-normal text-slate-400">تومان</span>
        </span>
      </div>

      <button
        type="button"
        onClick={handleBuy}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> در حال پردازش...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" /> خرید و پرداخت
          </>
        )}
      </button>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}
