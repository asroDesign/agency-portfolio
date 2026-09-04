import Link from "next/link";
import { Puzzle, Download, Package, LifeBuoy } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { templates, templateOrders, addons } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const session = await getSession();
  if (!session) return null;

  // Paid orders for this user
  const orders = await db
    .select()
    .from(templateOrders)
    .where(and(eq(templateOrders.userId, session.userId), eq(templateOrders.status, "paid")));

  const templateIds = orders.map((o) => o.templateId);
  const ownedTemplates = templateIds.length
    ? await db.select().from(templates).where(inArray(templates.id, templateIds))
    : [];

  // Fetch addons for all orders
  const allAddonIds = orders.flatMap((o) => o.addonIds ?? []);
  const addonMap = new Map<string, typeof addons.$inferSelect>();
  if (allAddonIds.length) {
    const rows = await db.select().from(addons).where(inArray(addons.id, allAddonIds));
    for (const a of rows) addonMap.set(a.id, a);
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">قالب‌های من</h1>
      <p className="mt-1 text-sm text-slate-500">قالب‌ها و ادان‌هایی که خریداری کرده‌اید.</p>

      {status === "success" && (
        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600">
          ✅ خرید با موفقیت انجام شد. لینک دانلود به ایمیل شما ارسال شد و از پایین نیز قابل دسترسی است.
        </div>
      )}
      {status === "failed" && (
        <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600">
          پرداخت ناموفق بود یا لغو شد. لطفاً دوباره تلاش کنید.
        </div>
      )}

      {ownedTemplates.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 py-16 text-center">
          <Puzzle className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 font-semibold text-slate-600">هنوز قالبی خریداری نکرده‌اید</p>
          <Link href="/templates" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            مشاهده فروشگاه قالب
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {ownedTemplates.map((t) => {
            const order = orders.find((o) => o.templateId === t.id);
            const purchasedAddons = (order?.addonIds ?? [])
              .map((id) => addonMap.get(id))
              .filter(Boolean) as typeof addons.$inferSelect[];

            return (
              <div key={t.id} className="soft-card rounded-2xl p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {t.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.coverUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">🧩</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{t.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">{t.category}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {t.version ? `نسخه ${t.version}` : ""} · خریداری‌شده با {formatNumber(order?.amount ?? t.price)} تومان
                    </p>

                    {/* Download */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href={`/api/download?type=template&id=${t.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
                        <Download className="h-4 w-4" /> دانلود قالب
                      </a>
                      <Link href={`/templates/${t.slug}`} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
                        مشاهده قالب
                      </Link>
                      <a href={`/templates/${t.slug}#support`} className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 px-4 py-2 text-sm font-medium text-primary">
                        <LifeBuoy className="h-4 w-4" /> ارسال تیکت
                      </a>
                    </div>

                    {/* Purchased addons */}
                    {purchasedAddons.length > 0 && (
                      <div className="mt-4 rounded-xl bg-slate-50 p-3">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Package className="h-3.5 w-3.5" /> ادان‌های خریداری‌شده
                        </h4>
                        <div className="mt-2 space-y-1.5">
                          {purchasedAddons.map((a) => (
                            <div key={a.id} className="flex items-center justify-between gap-2 text-sm">
                              <span className="text-slate-600">{a.name}</span>
                              {a.type === "file" ? (
                                <a href={`/api/download?type=addon&id=${a.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                  <Download className="h-3.5 w-3.5" /> دانلود
                                </a>
                              ) : (
                                <span className="text-xs text-emerald-600">فعال ✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
