"use client";

import { useState } from "react";
import { Trash2, Loader2, MailOpen, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export function MessageActions({ id, read }: { id: string; read: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"toggle" | "delete" | null>(null);

  async function toggle() {
    setBusy("toggle");
    try {
      await fetch(`/api/messages/${id}`, { method: "PATCH" });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function del() {
    if (!confirm("این پیام حذف شود؟")) return;
    setBusy("delete");
    try {
      await fetch(`/api/messages/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={busy !== null}
        title={read ? "علامت‌گذاری به‌عنوان خوانده‌نشده" : "علامت‌گذاری به‌عنوان خوانده‌شده"}
        className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:border-primary/40 hover:text-primary"
      >
        {busy === "toggle" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : read ? (
          <Mail className="h-4 w-4" />
        ) : (
          <MailOpen className="h-4 w-4" />
        )}
      </button>
      <button
        type="button"
        onClick={del}
        disabled={busy !== null}
        aria-label="حذف"
        className="inline-flex items-center justify-center rounded-xl border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-500/10"
      >
        {busy === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
