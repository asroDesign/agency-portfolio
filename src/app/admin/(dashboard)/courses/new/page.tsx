import type { Metadata } from "next";
import { CourseForm } from "@/components/course-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "دوره جدید" };

export default function NewCoursePage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">دوره جدید</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">مشخصات دوره را وارد کنید. جلسات پس از ایجاد دوره قابل افزودن هستند.</p>
      <div className="mt-6">
        <CourseForm sessions={[]} />
      </div>
    </div>
  );
}
