import { NextResponse } from "next/server";
import { db } from "@/db";
import { templates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  coverUrl: z.string().url().optional().or(z.literal("")).optional(),
  gallery: z.array(z.string()).optional(),
  price: z.coerce.number().int().min(0).optional(),
  category: z.string().min(1).optional(),
  technology: z.string().optional().or(z.literal("")).optional(),
  features: z.array(z.string()).optional(),
  liveUrl: z.string().url().optional().or(z.literal("")).optional(),
  demoUrl: z.string().url().optional().or(z.literal("")).optional(),
  downloadUrl: z.string().url().optional().or(z.literal("")).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

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
      ...(data.gallery !== undefined ? { gallery: data.gallery } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.technology !== undefined ? { technology: data.technology || null } : {}),
      ...(data.features !== undefined ? { features: data.features } : {}),
      ...(data.liveUrl !== undefined ? { liveUrl: data.liveUrl || null } : {}),
      ...(data.demoUrl !== undefined ? { demoUrl: data.demoUrl || null } : {}),
      ...(data.downloadUrl !== undefined ? { downloadUrl: data.downloadUrl || null } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
      ...(data.featured !== undefined ? { featured: data.featured } : {}),
      updatedAt: new Date(),
    };

    const [template] = await db.update(templates).set(clean).where(eq(templates.id, id)).returning();
    if (!template) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    return NextResponse.json({ template });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  try {
    const { id } = await params;
    await db.delete(templates).where(eq(templates.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
