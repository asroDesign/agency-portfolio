import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageSections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  title: z.string().max(300).optional().nullable(),
  subtitle: z.string().max(1000).optional().nullable(),
  count: z.coerce.number().int().min(1).max(12).optional(),
  enabled: z.boolean().optional(),
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
    if (data.subtitle !== undefined) clean.subtitle = data.subtitle;
    if (data.count !== undefined) clean.count = data.count;
    if (data.enabled !== undefined) clean.enabled = data.enabled;

    const [section] = await db
      .update(pageSections)
      .set(clean)
      .where(eq(pageSections.id, id))
      .returning();

    if (!section) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    return NextResponse.json({ section });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    await db.delete(pageSections).where(eq(pageSections.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
