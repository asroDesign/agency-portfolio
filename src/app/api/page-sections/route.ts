import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageSections } from "@/db/schema";
import { asc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId } from "@/lib/utils";
import { SECTION_META, type SectionType } from "@/lib/constants";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const sections = await db.select().from(pageSections).orderBy(asc(pageSections.sortOrder));
  return NextResponse.json({ sections });
}

const createSchema = z.object({
  type: z.enum([
    "hero",
    "stats",
    "services",
    "portfolio",
    "courses",
    "blog",
    "testimonials",
    "testimonial_form",
    "cta",
  ]),
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "نوع بخش نامعتبر" }, { status: 400 });

    const type = parsed.data.type as SectionType;
    const meta = SECTION_META[type];

    const [maxRow] = await db
      .select({ max: sql<number>`coalesce(max(sort_order), 0)` })
      .from(pageSections);

    const [section] = await db
      .insert(pageSections)
      .values({
        id: newId("sec"),
        type,
        title: meta.defaultTitle || null,
        subtitle: meta.defaultSubtitle || null,
        count: meta.count ?? 3,
        enabled: true,
        sortOrder: Number(maxRow?.max ?? 0) + 1,
      })
      .returning();

    return NextResponse.json({ section }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
