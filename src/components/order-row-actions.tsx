"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STATUSES = ["new", "in_review", "in_progress", "completed", "rejected"] as const;

export function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  function change(next: string) {
    setValue(next); // optimistic
    startTransition(async () => {
      try {
        await fetch(`/api/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        router.refresh();
      } catch {
        setValue(status);
      }
    });
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => change(e.target.value)}
        disabled={pending}
        className={cn(
          "cursor-pointer appearance-none rounded-full border py-1.5 pl-8 pr-4 text-xs font-medium outline-none transition-colors",
          ORDER_STATUS_COLORS[value],
        )}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="bg-white text-slate-800">
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="pointer-events-none absolute left-3 h-3.5 w-3.5 animate-spin text-slate-400" />}
    </div>
  );
}

export function OrderDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function del() {
    if (!confirm(`سفارش «${title}» حذف شود؟`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={del}
      disabled={deleting}
      className="inline-flex items-center justify-center rounded-xl border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-500/10"
      aria-label="حذف"
    >
      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
