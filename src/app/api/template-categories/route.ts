import { NextResponse } from "next/server";
import { db } from "@/db";
import { templateCategories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId, slugify } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const categories = await db
    .select()
    .from(templateCategories)
    .orderBy(asc(templateCategories.sortOrder));
  return NextResponse.json({ categories });
}

const schema = z.object({ name: z.string().min(1, "نام دسته الزامی است").max(100) });

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "نام دسته الزامی است" }, { status: 400 });

    const name = parsed.data.name;
    const id = newId("cat");
    const slug = `${slugify(name) || id}-${id.slice(-4)}`;

    const [category] = await db
      .insert(templateCategories)
      .values({ id, name, slug, sortOrder: 0 })
      .returning();

    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
