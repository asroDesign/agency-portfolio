"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import type { PortfolioItem } from "@/db/schema";
import { PortfolioCard } from "@/components/portfolio-card";
import { CATEGORY_LABELS } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category)))];
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2" role="group" aria-label="دسته‌بندی نمونه‌کارها">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            aria-pressed={active === c}
            aria-controls="portfolio-results"
            className={cn(
              "btn h-10 min-h-10 rounded-xl border px-4 text-sm font-semibold shadow-none transition-colors duration-200 motion-reduce:transition-none",
              active === c
                ? "border-primary bg-primary text-primary-content hover:bg-primary"
                : "border-base-content/8 bg-white/80 text-base-content/65 hover:border-primary/30 hover:bg-white hover:text-primary",
            )}
          >
            {c === "all" ? "همه" : CATEGORY_LABELS[c] ?? c}
          </button>
        ))}
      </div>
      <p role="status" className="shrink-0 text-xs text-base-content/55">{formatNumber(filtered.length)} پروژه</p>
      </div>

      <div id="portfolio-results">
      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-base-content/8 bg-white/80 px-6 py-16 text-center">
          <SearchX aria-hidden="true" className="mx-auto h-10 w-10 text-primary/60" />
          <p className="mt-4 font-semibold text-base-content/65">نمونه‌کاری در این دسته پیدا نشد</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
