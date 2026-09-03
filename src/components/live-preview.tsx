"use client";

import { useState } from "react";
import { Maximize2, X, ExternalLink } from "lucide-react";

/**
 * Inline, zoomed-out, non-interactive live preview of a website using an iframe.
 * Falls back gracefully when the target site blocks embedding.
 */
export function LivePreviewFrame({ url, className = "" }: { url: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <iframe
        src={url}
        title="پیش‌نمایش زنده"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
        className="pointer-events-none absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-[0.5] border-0"
        style={{ backgroundColor: "#fff" }}
      />
      <div className="pointer-events-none absolute inset-0" />
    </div>
  );
}

/**
 * Full-screen interactive live preview modal.
 */
export function LivePreviewButton({ url, label = "پیش‌نمایش زنده" }: { url: string; label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-slate-900"
      >
        <Maximize2 className="h-3.5 w-3.5" />
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950/80 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-200">
                <span className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span dir="ltr" className="font-mono text-xs text-slate-400">{url}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                باز کردن در تب جدید
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10"
                aria-label="بستن"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-white">
            <iframe src={url} title="پیش‌نمایش زنده" className="h-full w-full border-0" />
          </div>
        </div>
      )}
    </>
  );
}
