"use client";

import { useState } from "react";
import { PlayCircle, Lock, Clock, CheckCircle2 } from "lucide-react";
import type { CourseSession } from "@/db/schema";
import { cn } from "@/lib/utils";

export function CoursePlayer({
  sessions,
  hasAccess,
}: {
  sessions: CourseSession[];
  hasAccess: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(sessions[0]?.id ?? null);
  const active = sessions.find((s) => s.id === activeId) ?? sessions[0];

  const canView = (s: CourseSession) => hasAccess || s.isPreview;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Video + summary */}
      <div className="lg:col-span-2">
        {active ? (
          canView(active) ? (
            <div>
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-black dark:border-white/10">
                <div className="aspect-video">
                  {isEmbeddableVideo(active.videoUrl) ? (
                    <iframe
                      src={toEmbedUrl(active.videoUrl)}
                      title={active.title}
                      className="h-full w-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <video
                      src={active.videoUrl}
                      controls
                      className="h-full w-full"
                      poster={undefined}
                    />
                  )}
                </div>
              </div>
              <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                <h2 className="text-xl font-bold">{active.title}</h2>
                {active.duration && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    مدت: {active.duration}
                  </span>
                )}
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{active.summary}</p>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-100 text-center dark:border-white/15 dark:bg-white/5">
              <Lock className="h-12 w-12 text-slate-400" />
              <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">
                این جلسه قفل است
              </p>
              <p className="mt-1 text-sm text-slate-400">
                برای مشاهده این جلسه در دوره ثبت‌نام کنید
              </p>
            </div>
          )
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-3xl border border-dashed border-slate-300 text-slate-400">
            هنوز جلسه‌ای برای این دوره ثبت نشده است
          </div>
        )}
      </div>

      {/* Session list */}
      <div className="space-y-2">
        <h3 className="px-1 text-sm font-bold text-slate-500 dark:text-slate-400">
          سرفصل‌ها و جلسات ({sessions.length})
        </h3>
        <div className="max-h-[480px] space-y-2 overflow-y-auto pr-1">
          {sessions.map((s, i) => {
            const viewable = canView(s);
            const isActive = s.id === active?.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => viewable && setActiveId(s.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border p-3 text-right transition-colors",
                  isActive
                    ? "border-indigo-300 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10"
                    : "border-slate-200 bg-white hover:border-indigo-200 dark:border-white/10 dark:bg-white/5",
                  !viewable && "cursor-not-allowed opacity-60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                    isActive
                      ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{s.title}</p>
                    {s.isPreview && (
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-300">
                        پیش‌نمایش رایگان
                      </span>
                    )}
                  </div>
                  {s.duration && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {s.duration}
                    </p>
                  )}
                </div>
                <span className="mt-1 shrink-0">
                  {viewable ? (
                    <PlayCircle className={cn("h-5 w-5", isActive ? "text-indigo-500" : "text-slate-300 dark:text-slate-600")} />
                  ) : (
                    <Lock className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function isEmbeddableVideo(url: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com|aparat\.com|dailymotion\.com/.test(url);
}

function toEmbedUrl(url: string): string {
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  const aparatMatch = url.match(/aparat\.com\/v\/([\w-]+)/);
  if (aparatMatch) return `https://www.aparat.com/video/video/embed/videohash/${aparatMatch[1]}/vt/frame`;
  return url;
}
