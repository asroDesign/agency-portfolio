import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, courseSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  coverUrl: z.string().url().optional().or(z.literal("")).optional(),
  level: z.string().min(1).optional(),
  instructor: z.string().min(1).optional(),
  price: z.coerce.number().int().min(0).optional(),
  totalDuration: z.string().optional().or(z.literal("")).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const { id } = await params;
  const sessions = await db.select().from(courseSessions).where(eq(courseSessions.courseId, id));
  return NextResponse.json({ sessions });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "ورودی نامعتبر" }, { status: 400 });

    const data = parsed.data;
    const clean = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.coverUrl !== undefined ? { coverUrl: data.coverUrl || null } : {}),
      ...(data.level !== undefined ? { level: data.level } : {}),
      ...(data.instructor !== undefined ? { instructor: data.instructor } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.totalDuration !== undefined ? { totalDuration: data.totalDuration || null } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
      ...(data.featured !== undefined ? { featured: data.featured } : {}),
      updatedAt: new Date(),
    };

    const [course] = await db.update(courses).set(clean).where(eq(courses.id, id)).returning();
    if (!course) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    return NextResponse.json({ course });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  try {
    const { id } = await params;
    await db.delete(courseSessions).where(eq(courseSessions.courseId, id));
    await db.delete(courses).where(eq(courses.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

const sessionSchema = z.object({
  title: z.string().min(1, "عنوان جلسه الزامی است"),
  summary: z.string().min(1, "خلاصه جلسه الزامی است"),
  videoUrl: z.string().url("آدرس ویدیو معتبر نیست"),
  duration: z.string().optional().or(z.literal("")),
  isPreview: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = sessionSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "ورودی نامعتبر" }, { status: 400 });

    const [s] = await db
      .insert(courseSessions)
      .values({
        id: newId("ses"),
        courseId: id,
        title: parsed.data.title,
        summary: parsed.data.summary,
        videoUrl: parsed.data.videoUrl,
        duration: parsed.data.duration || null,
        isPreview: parsed.data.isPreview,
        sortOrder: parsed.data.sortOrder,
      })
      .returning();

    return NextResponse.json({ session: s }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
