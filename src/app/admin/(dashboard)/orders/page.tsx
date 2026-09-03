import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Mail, Phone } from "lucide-react";
import { OrderStatusSelect, OrderDeleteButton } from "@/components/order-row-actions";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const list = await db.select().from(orders).orderBy(desc(orders.createdAt));

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">سفارش‌های پروژه</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            مدیریت سفارش‌های دریافتی از سایت
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">📦</p>
          <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">هنوز سفارشی ثبت نشده است</p>
          <p className="mt-1 text-sm text-slate-400">سفارش‌های جدید اینجا نمایش داده می‌شوند</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((o) => (
            <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{o.name}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">
                      {o.service}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <a href={`mailto:${o.email}`} className="inline-flex items-center gap-1 hover:text-indigo-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span dir="ltr">{o.email}</span>
                    </a>
                    {o.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        <span dir="ltr">{o.phone}</span>
                      </span>
                    )}
                    {o.budget && <span>بودجه: {o.budget}</span>}
                    <span className="text-xs">{formatDateTime(o.createdAt)}</span>
                  </div>
                  <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-7 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    {o.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <OrderStatusSelect id={o.id} status={o.status} />
                  <OrderDeleteButton id={o.id} title={o.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
