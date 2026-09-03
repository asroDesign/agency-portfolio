import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId, slugify } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return NextResponse.json({ posts });
}

const schema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(200),
  excerpt: z.string().min(1, "خلاصه الزامی است").max(500),
  content: z.string().min(1, "محتوا الزامی است"),
  coverUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1).max(100),
  author: z.string().min(1).max(100),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "ورودی نامعتبر" }, { status: 400 });

    const data = parsed.data;
    const id = newId("post");
    const slug = `${slugify(data.title) || id}-${id.slice(-4)}`;

    const [post] = await db
      .insert(blogPosts)
      .values({
        id,
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverUrl: data.coverUrl || null,
        category: data.category,
        author: data.author,
        tags: data.tags,
        published: data.published,
        featured: data.featured,
      })
      .returning();

    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
