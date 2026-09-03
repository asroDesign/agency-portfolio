import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId, slugify } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await db
    .select()
    .from(portfolioItems)
    .orderBy(desc(portfolioItems.featured), asc(portfolioItems.sortOrder));
  return NextResponse.json({ items });
}

const portfolioSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(120),
  description: z.string().min(1, "توضیحات الزامی است"),
  category: z.enum(["web", "app", "seo", "ecommerce", "branding"]),
  imageUrl: z.string().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
  liveUrl: z.string().url("آدرس بازدید معتبر نیست").optional().or(z.literal("")),
  demoUrl: z.string().url("آدرس دمو معتبر نیست").optional().or(z.literal("")),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const parsed = portfolioSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "ورودی نامعتبر" },
        { status: 400 },
      );
    }
    const data = parsed.data;
    const id = newId("pf");
    const baseSlug = slugify(data.title) || id;
    const slug = `${baseSlug}-${id.slice(-4)}`;

    const [item] = await db
      .insert(portfolioItems)
      .values({
        id,
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl || null,
        liveUrl: data.liveUrl || null,
        demoUrl: data.demoUrl || null,
        technologies: data.technologies,
        featured: data.featured,
        sortOrder: data.sortOrder,
      })
      .returning();

    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
