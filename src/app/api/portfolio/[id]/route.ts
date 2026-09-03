import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).optional(),
  category: z.enum(["web", "app", "seo", "ecommerce", "branding"]).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")).optional(),
  liveUrl: z.string().url().optional().or(z.literal("")).optional(),
  demoUrl: z.string().url().optional().or(z.literal("")).optional(),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "ورودی نامعتبر" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const clean = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl || null } : {}),
      ...(data.liveUrl !== undefined ? { liveUrl: data.liveUrl || null } : {}),
      ...(data.demoUrl !== undefined ? { demoUrl: data.demoUrl || null } : {}),
      ...(data.technologies !== undefined ? { technologies: data.technologies } : {}),
      ...(data.featured !== undefined ? { featured: data.featured } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      updatedAt: new Date(),
    };

    const [item] = await db
      .update(portfolioItems)
      .set(clean)
      .where(eq(portfolioItems.id, id))
      .returning();

    if (!item) {
      return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const [deleted] = await db
      .delete(portfolioItems)
      .where(eq(portfolioItems.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
