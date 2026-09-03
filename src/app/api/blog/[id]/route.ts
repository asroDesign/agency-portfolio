import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  title: z.string().min(1).max(200).optional(),
  excerpt: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  coverUrl: z.string().url().optional().or(z.literal("")).optional(),
  category: z.string().min(1).max(100).optional(),
  author: z.string().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
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
      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.coverUrl !== undefined ? { coverUrl: data.coverUrl || null } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.author !== undefined ? { author: data.author } : {}),
      ...(data.tags !== undefined ? { tags: data.tags } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
      ...(data.featured !== undefined ? { featured: data.featured } : {}),
      updatedAt: new Date(),
    };

    const [post] = await db.update(blogPosts).set(clean).where(eq(blogPosts.id, id)).returning();
    if (!post) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  try {
    const { id } = await params;
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
