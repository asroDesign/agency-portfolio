import { db } from "@/db";
import { enrollments, templateOrders, courses, templates, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { GraduationCap, Puzzle } from "lucide-react";
import { formatDateTime, formatNumber, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const enrollmentList = await db
    .select({
      id: enrollments.id,
      status: enrollments.status,
      amount: enrollments.amount,
      refId: enrollments.refId,
      createdAt: enrollments.createdAt,
      courseTitle: courses.title,
      userName: users.name,
      userEmail: users.email,
    })
    .from(enrollments)
    .leftJoin(courses, eq(courses.id, enrollments.courseId))
    .leftJoin(users, eq(users.id, enrollments.userId))
    .orderBy(desc(enrollments.createdAt))
    .limit(50);

  const templateList = await db
    .select({
      id: templateOrders.id,
      status: templateOrders.status,
      amount: templateOrders.amount,
      refId: templateOrders.refId,
      createdAt: templateOrders.createdAt,
      templateTitle: templates.title,
      userName: users.name,
      userEmail: users.email,
    })
    .from(templateOrders)
    .leftJoin(templates, eq(templates.id, templateOrders.templateId))
    .leftJoin(users, eq(users.id, templateOrders.userId))
    .orderBy(desc(templateOrders.createdAt))
    .limit(50);

  const statusBadge = (status: string) =>
    cn(
      "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
      status === "paid" || status === "free"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
        : "border-amber-500/20 bg-amber-500/10 text-amber-600",
    );

  const statusLabel = (status: string) =>
    status === "paid" ? "پرداخت شده" : status === "free" ? "رایگان" : "در انتظار";

  const Row = ({ icon: Icon, title, user, amount, status, refId, date }: { icon: typeof GraduationCap; title: string; user: string; amount: number; status: string; refId: string | null; date: Date | string }) => (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-slate-400">{user}</p>
      </div>
      <div className="shrink-0 text-left">
        <p className="text-sm font-bold">{amount > 0 ? formatNumber(amount) : "رایگان"}</p>
        {refId && <p className="text-[10px] text-slate-400" dir="ltr">{refId}</p>}
      </div>
      <span className={statusBadge(status)}>{statusLabel(status)}</span>
      <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{formatDateTime(date)}</span>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">پرداخت‌ها</h1>
      <p className="mt-1 text-sm text-slate-500">ثبت‌نام دوره‌ها و خرید قالب‌ها</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="soft-card rounded-3xl p-5">
          <h2 className="font-bold">ثبت‌نام دوره‌ها</h2>
          <div className="mt-4 space-y-2">
            {enrollmentList.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">هنوز ثبت‌نامی انجام نشده است.</p>
            ) : (
              enrollmentList.map((e) => (
                <Row key={`e-${e.id}`} icon={GraduationCap} title={e.courseTitle ?? "—"} user={`${e.userName ?? "—"} · ${e.userEmail ?? ""}`} amount={e.amount} status={e.status} refId={e.refId} date={e.createdAt} />
              ))
            )}
          </div>
        </div>

        <div className="soft-card rounded-3xl p-5">
          <h2 className="font-bold">خرید قالب‌ها</h2>
          <div className="mt-4 space-y-2">
            {templateList.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">هنوز خریدی انجام نشده است.</p>
            ) : (
              templateList.map((t) => (
                <Row key={`t-${t.id}`} icon={Puzzle} title={t.templateTitle ?? "—"} user={`${t.userName ?? "—"} · ${t.userEmail ?? ""}`} amount={t.amount} status={t.status} refId={t.refId} date={t.createdAt} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
