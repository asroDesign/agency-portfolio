import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { courses, courseSessions } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { CourseForm } from "@/components/course-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ویرایش دوره" };

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [course] = await db.select().from(courses).where(eq(courses.id, id));
  if (!course) notFound();

  const sessions = await db
    .select()
    .from(courseSessions)
    .where(eq(courseSessions.courseId, id))
    .orderBy(asc(courseSessions.sortOrder));

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">ویرایش دوره</h1>
      <p className="mt-1 text-sm text-slate-500">در حال ویرایش «{course.title}»</p>
      <div className="mt-6">
        <CourseForm initial={course} sessions={sessions} />
      </div>
    </div>
  );
}
