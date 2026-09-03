import Link from "next/link";
import { Puzzle, Download } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getOwnedTemplates } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AccountTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const session = await getSession();
  if (!session) return null;

  const templates = await getOwnedTemplates(session.userId);

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">قالب‌های من</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">قالب‌هایی که خریداری کرده‌اید.</p>

      {status === "success" && (
        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-300">
          ✅ خرید با موفقیت انجام شد. قالب شما آماده دانلود است.
        </div>
      )}
      {status === "failed" && (
        <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-300">
          پرداخت ناموفق بود یا لغو شد. لطفاً دوباره تلاش کنید.
        </div>
      )}

      {templates.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-white/15">
          <Puzzle className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">هنوز قالبی خریداری نکرده‌اید</p>
          <Link
            href="/templates"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            مشاهده فروشگاه قالب
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                {t.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.coverUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">🧩</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">{t.title}</h3>
                <p className="text-xs text-slate-400">{t.category}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {t.downloadUrl && (
                  <a
                    href={t.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Download className="h-4 w-4" />
                    دانلود
                  </a>
                )}
                <Link
                  href={`/templates/${t.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 dark:border-white/10 dark:text-slate-300"
                >
                  مشاهده
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
