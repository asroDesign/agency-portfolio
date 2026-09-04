"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function TemplateGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [];

  if (list.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 text-6xl">
        🧩
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={list[active]} alt={title} className="aspect-[16/10] w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {active + 1} / {list.length}
        </span>
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                i === active
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
