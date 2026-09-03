import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import type { Template } from "@/db/schema";
import { formatNumber } from "@/lib/utils";

export function TemplateCard({ template }: { template: Template }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
      <Link href={`/templates/${template.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        {template.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={template.coverUrl}
            alt={template.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 text-4xl">
            🧩
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            href={`/templates/${template.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow"
          >
            <Eye className="h-3.5 w-3.5" />
            مشاهده جزئیات
          </Link>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium text-indigo-500">{template.category}</span>
        <Link href={`/templates/${template.slug}`}>
          <h3 className="mt-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
            {template.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {template.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <ShoppingBag className="h-3.5 w-3.5" />
            {formatNumber(template.sales)} فروش
          </span>
          <div className="text-left">
            {template.price > 0 ? (
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                {formatNumber(template.price)}
                <span className="mr-1 text-xs font-normal text-slate-400">تومان</span>
              </span>
            ) : (
              <span className="text-sm font-bold text-emerald-500">رایگان</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
