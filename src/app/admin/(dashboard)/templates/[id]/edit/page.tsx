import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { templates, addons } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { TemplateForm } from "@/components/template-form";
import { TemplateContentManager } from "@/components/template-content-manager";
import { getTemplateCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ویرایش قالب" };

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [template] = await db.select().from(templates).where(eq(templates.id, id));
  if (!template) notFound();

  const [categories, addonsList] = await Promise.all([
    getTemplateCategories(),
    db.select().from(addons).where(eq(addons.templateId, id)).orderBy(asc(addons.sortOrder)),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">ویرایش قالب</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">در حال ویرایش «{template.title}»</p>
      <div className="mt-6 space-y-6">
        <TemplateForm initial={template} categories={categories} addons={addonsList} />
        <TemplateContentManager templateId={id} />
      </div>
    </div>
  );
}
