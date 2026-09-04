import type { Metadata } from "next";
import { BlogEditorForm } from "@/components/blog-editor-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "مقاله جدید" };

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">مقاله جدید</h1>
      <p className="mt-1 text-sm text-slate-500">
        محتوای مقاله را با ویرایشگر پیشرفته بنویسید و تنظیمات سئو را وارد کنید.
      </p>
      <div className="mt-6">
        <BlogEditorForm />
      </div>
    </div>
  );
}
