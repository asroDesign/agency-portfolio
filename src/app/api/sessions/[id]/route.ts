import { NextResponse } from "next/server";
import { db } from "@/db";
import { courseSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  title: z.string().min(1, "عنوان جلسه الزامی است").optional(),
  summary: z.string().min(1, "خلاصه جلسه الزامی است").optional(),
  videoUrl: z.string().optional(),
  duration: z.string().optional().nullable(),
  isPreview: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "ورودی نامعتبر" }, { status: 400 });

    const data = parsed.data;
    const clean: Record<string, unknown> = {};
    if (data.title !== undefined) clean.title = data.title;
    if (data.summary !== undefined) clean.summary = data.summary;
    if (data.videoUrl !== undefined) clean.videoUrl = data.videoUrl;
    if (data.duration !== undefined) clean.duration = data.duration || null;
    if (data.isPreview !== undefined) clean.isPreview = data.isPreview;
    if (data.sortOrder !== undefined) clean.sortOrder = data.sortOrder;

    const [session] = await db
      .update(courseSessions)
      .set(clean)
      .where(eq(courseSessions.id, id))
      .returning();

    if (!session) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  try {
    const { id } = await params;
    await db.delete(courseSessions).where(eq(courseSessions.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
