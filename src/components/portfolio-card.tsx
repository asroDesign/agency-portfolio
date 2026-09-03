import Link from "next/link";
import { ExternalLink, PlayCircle } from "lucide-react";
import type { PortfolioItem } from "@/db/schema";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/constants";
import { LivePreviewFrame, LivePreviewButton } from "@/components/live-preview";
import { cn } from "@/lib/utils";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
      <div className="relative aspect-[16/10] overflow-hidden">
        {item.liveUrl ? (
          <LivePreviewFrame url={item.liveUrl} className="h-full w-full" />
        ) : item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20 text-4xl">
            🖥️
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {item.liveUrl && (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            زنده
          </span>
        )}

        <div className="absolute left-3 top-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          {item.liveUrl && <LivePreviewButton url={item.liveUrl} />}
        </div>

        <div className="absolute bottom-3 right-3 flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur",
              CATEGORY_COLORS[item.category],
            )}
          >
            {CATEGORY_LABELS[item.category] ?? item.category}
          </span>
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow backdrop-blur"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              بازدید
            </a>
          )}
          {item.demoUrl && (
            <a
              href={item.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-1 text-xs font-semibold text-white shadow"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              دموی زنده
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {item.description}
        </p>
        {item.technologies && item.technologies.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {item.technologies.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-white/5 dark:text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
