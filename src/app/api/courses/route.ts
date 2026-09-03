import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId, slugify } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const list = await db.select().from(courses).orderBy(asc(courses.createdAt));
  return NextResponse.json({ courses: list });
}

const schema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(200),
  description: z.string().min(1, "توضیحات الزامی است"),
  coverUrl: z.string().url().optional().or(z.literal("")),
  level: z.string().min(1),
  instructor: z.string().min(1),
  price: z.coerce.number().int().min(0),
  totalDuration: z.string().optional().or(z.literal("")),
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
    const id = newId("crs");
    const slug = `${slugify(data.title) || id}-${id.slice(-4)}`;

    const [course] = await db
      .insert(courses)
      .values({
        id,
        slug,
        title: data.title,
        description: data.description,
        coverUrl: data.coverUrl || null,
        level: data.level,
        instructor: data.instructor,
        price: data.price,
        totalDuration: data.totalDuration || null,
        published: data.published,
        featured: data.featured,
      })
      .returning();

    return NextResponse.json({ course }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
