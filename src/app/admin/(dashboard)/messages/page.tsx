import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Mail } from "lucide-react";
import { MessageActions } from "@/components/message-actions";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const list = await db.select().from(messages).orderBy(desc(messages.createdAt));

  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">پیام‌ها</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          پیام‌های دریافتی از فرم تماس با ما
        </p>
      </div>

      {list.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">✉️</p>
          <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">پیامی دریافت نشده است</p>
          <p className="mt-1 text-sm text-slate-400">پیام‌های جدید اینجا نمایش داده می‌شوند</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {list.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 transition-colors ${
                m.read
                  ? "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
                  : "border-indigo-200 bg-indigo-50/40 dark:border-indigo-500/30 dark:bg-indigo-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
                    {m.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{m.name}</h3>
                      {!m.read && (
                        <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-300">
                          جدید
                        </span>
                      )}
                    </div>
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-500 dark:text-slate-400">
                      <Mail className="h-3 w-3" />
                      <span dir="ltr">{m.email}</span>
                    </a>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-xs text-slate-400 sm:inline">{formatDateTime(m.createdAt)}</span>
                  <MessageActions id={m.id} read={m.read} />
                </div>
              </div>
              <h4 className="mt-3 font-semibold text-slate-800 dark:text-slate-100">{m.subject}</h4>
              <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-300">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
