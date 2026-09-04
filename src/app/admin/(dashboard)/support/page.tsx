"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Trash2, Send, ChevronDown } from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  templateTitle: string | null;
};

type Reply = {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  userName: string | null;
};

const STATUS_LABEL: Record<string, string> = { open: "باز", answered: "پاسخ داده شده", closed: "بسته" };
const STATUS_COLOR: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-600",
  answered: "bg-emerald-500/10 text-emerald-600",
  closed: "bg-slate-500/10 text-slate-500",
};

export default function SupportAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(data.tickets ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggle(id: string) {
    if (openId === id) { setOpenId(null); return; }
    setOpenId(id);
    if (!replies[id]) {
      const res = await fetch(`/api/tickets/${id}`);
      const data = await res.json();
      setReplies((r) => ({ ...r, [id]: data.replies ?? [] }));
    }
  }

  async function sendReply(id: string) {
    const text = replyText[id]?.trim();
    if (!text) return;
    setSending(id);
    try {
      await fetch(`/api/tickets/${id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      setReplyText((r) => ({ ...r, [id]: "" }));
      const res = await fetch(`/api/tickets/${id}`);
      const data = await res.json();
      setReplies((r) => ({ ...r, [id]: data.replies ?? [] }));
      await load();
    } finally { setSending(null); }
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/tickets/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    await load();
  }

  async function del(id: string) {
    if (!confirm("این تیکت حذف شود؟")) return;
    await fetch(`/api/tickets/${id}`, { method: "DELETE" });
    await load();
  }

  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">تیکت‌های پشتیبانی</h1>
        <p className="mt-1 text-sm text-slate-500">
          {openCount > 0 ? `${openCount} تیکت باز` : "همه تیکت‌ها رسیدگی شده‌اند"}
        </p>
      </div>

      {loading ? (
        <div className="mt-16 flex flex-col items-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : tickets.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center">
          <p className="text-5xl">🎫</p><p className="mt-4 font-semibold">هنوز تیکتی ثبت نشده است</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="soft-card overflow-hidden rounded-2xl">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => toggle(t.id)} className="flex min-w-0 flex-1 items-center gap-3 text-right">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", STATUS_COLOR[t.status])}>{STATUS_LABEL[t.status]}</span>
                      {t.templateTitle && <span className="text-xs text-slate-400">قالب: {t.templateTitle}</span>}
                    </div>
                    <p className="mt-1 truncate font-semibold">{t.subject}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{formatDateTime(t.updatedAt)}</p>
                  </div>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  <select value={t.status} onChange={(e) => setStatus(t.id, e.target.value)} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">
                    <option value="open">باز</option>
                    <option value="answered">پاسخ داده شده</option>
                    <option value="closed">بسته</option>
                  </select>
                  <button type="button" onClick={() => del(t.id)} className="rounded-lg border border-rose-200 p-1.5 text-rose-500 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
                  <button type="button" onClick={() => toggle(t.id)} className="text-slate-400"><ChevronDown className={cn("h-5 w-5 transition-transform", openId === t.id && "rotate-180")} /></button>
                </div>
              </div>

              {openId === t.id && (
                <div className="border-t border-slate-100 p-4">
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm leading-7 text-slate-600">{t.message}</div>
                  <div className="mt-4 space-y-3">
                    {(replies[t.id] ?? []).map((r) => (
                      <div key={r.id} className={cn("max-w-[85%] rounded-2xl p-3 text-sm leading-7", r.isStaff ? "mr-auto bg-primary/10 text-slate-700" : "ml-auto bg-slate-100 text-slate-700")}>
                        <p>{r.message}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{r.isStaff ? "پشتیبانی" : r.userName} · {formatDateTime(r.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      value={replyText[t.id] ?? ""}
                      onChange={(e) => setReplyText((r) => ({ ...r, [t.id]: e.target.value }))}
                      placeholder="پاسخ خود را بنویسید..."
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                    <button type="button" onClick={() => sendReply(t.id)} disabled={sending === t.id} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                      {sending === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} ارسال
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
