import { NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  try {
    const { id } = await params;
    const body = await req.json();
    const [t] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    if (!t) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });

    const updates: Record<string, unknown> = {};
    if (body.approved !== undefined) updates.approved = body.approved;
    if (body.featured !== undefined) updates.featured = body.featured;

    const [updated] = await db.update(testimonials).set(updates).where(eq(testimonials.id, id)).returning();
    return NextResponse.json({ testimonial: updated });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  try {
    const { id } = await params;
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
