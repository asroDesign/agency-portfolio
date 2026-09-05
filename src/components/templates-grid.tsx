"use client";

import { useState } from "react";
import type { Template, TemplateCategory } from "@/db/schema";
import { TemplateCard } from "@/components/template-card";
import { SearchX } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

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
      <div className="flex flex-wrap gap-2" role="group" aria-label="دسته‌بندی قالب‌ها">
        <button
          type="button"
          onClick={() => setActive("all")}
          aria-pressed={active === "all"}
          className={cn(
            "btn h-10 min-h-10 rounded-xl border px-4 text-sm font-semibold shadow-none transition-colors duration-200 motion-reduce:transition-none",
            active === "all"
              ? "border-primary bg-primary text-primary-content hover:bg-primary"
              : "border-base-content/8 bg-white/80 text-base-content/65 hover:border-primary/30 hover:bg-white hover:text-primary",
          )}
        >
          همه قالب‌ها
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            aria-pressed={active === c.id}
            className={cn(
              "btn h-10 min-h-10 rounded-xl border px-4 text-sm font-semibold shadow-none transition-colors duration-200 motion-reduce:transition-none",
              active === c.id
                ? "border-primary bg-primary text-primary-content hover:bg-primary"
                : "border-base-content/8 bg-white/80 text-base-content/65 hover:border-primary/30 hover:bg-white hover:text-primary",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p role="status" className="mt-4 text-xs text-base-content/55">{formatNumber(filtered.length)} قالب</p>
      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-base-content/8 bg-white/80 px-6 py-16 text-center">
          <SearchX aria-hidden="true" className="mx-auto h-10 w-10 text-primary/60" />
          <p className="mt-4 font-semibold text-base-content/65">قالبی در این دسته پیدا نشد</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}
    </div>
  );
}
