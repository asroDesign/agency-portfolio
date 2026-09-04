import type { Metadata } from "next";
import { TemplateForm } from "@/components/template-form";
import { getTemplateCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "قالب جدید" };

export default async function NewTemplatePage() {
  const categories = await getTemplateCategories();
  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">قالب جدید</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">مشخصات قالب را وارد کنید. ادان‌ها پس از ایجاد قابل افزودن هستند.</p>
      <div className="mt-6">
        <TemplateForm categories={categories} addons={[]} />
      </div>
    </div>
  );
}
