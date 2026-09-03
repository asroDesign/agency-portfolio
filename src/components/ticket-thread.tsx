"use client";

import { useState } from "react";
import { Loader2, Send, ChevronDown } from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";

type Reply = {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  userName: string | null;
};

export function TicketThread({ ticketId, initialMessage }: { ticketId: string; initialMessage: string }) {
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  async function toggle() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (replies.length === 0) {
      setLoading(true);
      const res = await fetch(`/api/tickets/${ticketId}`);
      const data = await res.json();
      setReplies(data.replies ?? []);
      setLoading(false);
    }
  }

  async function send() {
    if (!text.trim()) return;
    setSending(true);
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      setText("");
      const res = await fetch(`/api/tickets/${ticketId}`);
      const data = await res.json();
      setReplies(data.replies ?? []);
    } finally { setSending(false); }
  }

  return (
    <div className="mt-3">
      <button type="button" onClick={toggle} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:underline">
        مشاهده گفتگو
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="mt-3 space-y-3 border-t border-slate-100 pt-3 dark:border-white/5">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> در حال بارگذاری...</div>
          ) : (
            <>
              <div className="ml-auto max-w-[85%] rounded-2xl bg-slate-100 p-3 text-sm leading-7 text-slate-700 dark:bg-white/5 dark:text-slate-200">
                <p>{initialMessage}</p>
                <p className="mt-1 text-[11px] text-slate-400">شما</p>
              </div>
              {replies.map((r) => (
                <div key={r.id} className={cn("max-w-[85%] rounded-2xl p-3 text-sm leading-7", r.isStaff ? "mr-auto bg-indigo-500/10 text-slate-700 dark:text-slate-200" : "ml-auto bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-200")}>
                  <p>{r.message}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{r.isStaff ? "پشتیبانی" : "شما"} · {formatDateTime(r.createdAt)}</p>
                </div>
              ))}
            </>
          )}
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="پاسخ جدید..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <button type="button" onClick={send} disabled={sending} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
