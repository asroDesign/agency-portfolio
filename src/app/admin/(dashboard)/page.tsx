import Link from "next/link";
import { FolderKanban, ShoppingCart, MessagesSquare, Inbox, ArrowLeft, Plus } from "lucide-react";
import { db } from "@/db";
import { orders, messages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getDashboardStats } from "@/lib/data";
import { formatDate, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);
  const recentMessages = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(5);

  const cards = [
    {
      label: "کل سفارش‌ها",
      value: stats.orders,
      sub: `${stats.newOrders} سفارش جدید`,
      icon: ShoppingCart,
      href: "/admin/orders",
      gradient: "from-primary to-info",
    },
    {
      label: "پیام‌های دریافتی",
      value: stats.messages,
      sub: `${stats.unread} پیام خوانده‌نشده`,
      icon: MessagesSquare,
      href: "/admin/messages",
      gradient: "from-secondary to-primary",
    },
    {
      label: "نمونه‌کارها",
      value: stats.portfolio,
      sub: "پروژه منتشرشده",
      icon: FolderKanban,
      href: "/admin/portfolio",
      gradient: "from-accent to-primary",
    },
    {
      label: "پیام‌های جدید",
      value: stats.unread,
      sub: "نیاز به بررسی",
      icon: Inbox,
      href: "/admin/messages",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">داشبورد</h1>
          <p className="mt-1 text-sm text-slate-500">
            نمای کلی از وضعیت کسب‌وکار شما
          </p>
        </div>
        <Link
          href="/admin/portfolio"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          نمونه‌کار جدید
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group soft-card rounded-3xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-lg`}
              >
                <c.icon className="h-6 w-6" />
              </span>
              <ArrowLeft className="h-4 w-4 text-slate-300 transition-transform group-hover:-translate-x-1" />
            </div>
            <div className="mt-4 text-3xl font-extrabold">{c.value}</div>
            <div className="mt-1 text-sm font-medium text-slate-700">{c.label}</div>
            <div className="mt-0.5 text-xs text-slate-400">{c.sub}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="soft-card rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">آخرین سفارش‌ها</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline">
              مشاهده همه
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">هنوز سفارشی ثبت نشده است.</p>
            ) : (
              recentOrders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{o.name}</p>
                    <p className="truncate text-xs text-slate-400">{o.service}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", ORDER_STATUS_COLORS[o.status])}>
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                    <span className="hidden text-xs text-slate-400 sm:inline">{formatDate(o.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="soft-card rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">آخرین پیام‌ها</h2>
            <Link href="/admin/messages" className="text-sm font-medium text-primary hover:underline">
              مشاهده همه
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentMessages.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">هنوز پیامی دریافت نشده است.</p>
            ) : (
              recentMessages.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {m.name}
                      {!m.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />}
                    </p>
                    <p className="truncate text-xs text-slate-400">{m.subject}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{formatDate(m.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
