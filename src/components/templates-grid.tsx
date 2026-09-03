"use client";

import { useState } from "react";
import type { Template, TemplateCategory } from "@/db/schema";
import { TemplateCard } from "@/components/template-card";
import { cn } from "@/lib/utils";

export function TemplatesGrid({
  templates,
  categories,
}: {
  templates: Template[];
  categories: TemplateCategory[];
}) {
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all" ? templates : templates.filter((t) => t.categoryId === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-all",
            active === "all"
              ? "border-transparent bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25"
              : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
          )}
        >
          همه قالب‌ها
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              active === c.id
                ? "border-transparent bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/15">
          <p className="text-5xl">🧩</p>
          <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">قالبی در این دسته پیدا نشد</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}
    </div>
  );
}
