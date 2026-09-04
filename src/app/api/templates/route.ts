import { NextResponse } from "next/server";
import { db } from "@/db";
import { templates } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId, slugify } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const list = await db.select().from(templates).orderBy(asc(templates.createdAt));
  return NextResponse.json({ templates: list });
}

const schema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(200),
  description: z.string().min(1, "توضیحات الزامی است"),
  coverUrl: z.string().url().optional().or(z.literal("")),
  gallery: z.array(z.string()).default([]),
  price: z.coerce.number().int().min(0),
  category: z.string().min(1),
  technology: z.string().optional().or(z.literal("")),
  features: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  downloadUrl: z.string().optional().or(z.literal("")),
  filePath: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
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
    const id = newId("tpl");
    const slug = `${slugify(data.title) || id}-${id.slice(-4)}`;

    const [template] = await db
      .insert(templates)
      .values({
        id,
        slug,
        title: data.title,
        description: data.description,
        coverUrl: data.coverUrl || null,
        gallery: data.gallery,
        price: data.price,
        category: data.category,
        technology: data.technology || null,
        features: data.features,
        liveUrl: data.liveUrl || null,
        demoUrl: data.demoUrl || null,
        downloadUrl: data.downloadUrl || null,
        filePath: data.filePath || null,
        fileName: data.fileName || null,
        published: data.published,
        featured: data.featured,
      })
      .returning();

    return NextResponse.json({ template }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
