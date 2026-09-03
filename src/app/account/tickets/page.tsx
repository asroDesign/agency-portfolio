import { LifeBuoy } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { supportTickets, templates } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { TicketThread } from "@/components/ticket-thread";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountTicketsPage() {
  const session = await getSession();
  if (!session) return null;

  const tickets = await db
    .select({
      id: supportTickets.id,
      subject: supportTickets.subject,
      message: supportTickets.message,
      status: supportTickets.status,
      createdAt: supportTickets.createdAt,
      updatedAt: supportTickets.updatedAt,
      templateTitle: templates.title,
    })
    .from(supportTickets)
    .leftJoin(templates, eq(templates.id, supportTickets.templateId))
    .where(eq(supportTickets.userId, session.userId))
    .orderBy(desc(supportTickets.updatedAt));

  const STATUS_LABEL: Record<string, string> = { open: "باز", answered: "پاسخ داده شده", closed: "بسته" };

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">تیکت‌های من</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">پشتیبانی قالب‌های خریداری‌شده</p>

      {tickets.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-white/15">
          <LifeBuoy className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">هنوز تیکتی ارسال نکرده‌اید</p>
          <p className="mt-1 text-sm text-slate-400">از صفحه هر قالب می‌توانید تیکت پشتیبانی ارسال کنید.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold">{t.subject}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  t.status === "open" ? "bg-blue-500/10 text-blue-600 dark:text-blue-300"
                  : t.status === "answered" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                  : "bg-slate-500/10 text-slate-500 dark:text-slate-400"
                }`}>{STATUS_LABEL[t.status]}</span>
                {t.templateTitle && <span className="text-xs text-slate-400">قالب: {t.templateTitle}</span>}
                <span className="mr-auto text-xs text-slate-400">{formatDateTime(t.updatedAt)}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{t.message}</p>
              <TicketThread ticketId={t.id} initialMessage={t.message} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
