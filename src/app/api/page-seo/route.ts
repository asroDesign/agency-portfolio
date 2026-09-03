import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageMeta } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const metas = await db.select().from(pageMeta).orderBy(asc(pageMeta.path));
  return NextResponse.json({ metas });
}

const schema = z.object({
  path: z.string().min(1, "مسیر صفحه الزامی است").startsWith("/"),
  title: z.string().min(1, "عنوان الزامی است").max(200),
  description: z.string().min(1, "توضیحات الزامی است").max(500),
  keywords: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
  noIndex: z.boolean().optional(),
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "ورودی نامعتبر" }, { status: 400 });

    const { path, ...data } = parsed.data;
    const existing = await db.select().from(pageMeta).where(eq(pageMeta.path, path));

    let meta;
    if (existing.length > 0) {
      const [updated] = await db
        .update(pageMeta)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(pageMeta.path, path))
        .returning();
      meta = updated;
    } else {
      const [inserted] = await db
        .insert(pageMeta)
        .values({ id: newId("seo"), path, ...data })
        .returning();
      meta = inserted;
    }

    return NextResponse.json({ meta });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
