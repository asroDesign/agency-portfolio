"use client";

import { useState } from "react";
import type { PortfolioItem } from "@/db/schema";
import { PortfolioCard } from "@/components/portfolio-card";
import { CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category)))];
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              active === c
                ? "border-transparent bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
            )}
          >
            {c === "all" ? "همه" : CATEGORY_LABELS[c] ?? c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">🔍</p>
          <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">نمونه‌کاری در این دسته پیدا نشد</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
