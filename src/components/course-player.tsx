"use client";

import { useState } from "react";
import { PlayCircle, Lock, Clock } from "lucide-react";
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
    <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
      {/* Video + summary */}
      <div className="min-w-0">
        {active ? (
          canView(active) ? (
            <div>
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-black">
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
              <div className="mt-5 soft-card rounded-3xl p-6">
                <h2 className="text-xl font-bold">{active.title}</h2>
                {active.duration && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    مدت: {active.duration}
                  </span>
                )}
                <p className="mt-3 leading-7 text-slate-600">{active.summary}</p>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-100 text-center">
              <Lock className="h-12 w-12 text-slate-400" />
              <p className="mt-4 font-semibold text-slate-600">
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
      <div className="min-w-0 space-y-3 rounded-3xl border border-base-content/8 bg-white/90 p-4">
        <h3 className="px-1 text-sm font-bold text-slate-500">
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
                aria-disabled={!viewable}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border p-3 text-right transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/10"
                    : "border-slate-200 bg-white hover:border-primary/25",
                  !viewable && "cursor-not-allowed opacity-60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                    isActive
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words text-sm font-medium leading-6">{s.title}</p>
                    {s.isPreview && (
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
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
                    <PlayCircle className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-300")} />
                  ) : (
                    <Lock className="h-5 w-5 text-slate-300" />
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
