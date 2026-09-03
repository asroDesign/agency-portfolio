import { NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const list = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  return NextResponse.json({ testimonials: list });
}

const schema = z.object({
  name: z.string().min(2, "نام حداقل ۲ حرف باشد").max(80),
  role: z.string().optional().or(z.literal("")),
  content: z.string().min(5, "نظر حداقل ۵ حرف باشد").max(2000),
  rating: z.coerce.number().int().min(1).max(5),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "ورودی نامعتبر" },
        { status: 400 },
      );
    }

    const [t] = await db
      .insert(testimonials)
      .values({
        id: newId("tst"),
        name: parsed.data.name,
        role: parsed.data.role || null,
        content: parsed.data.content,
        rating: parsed.data.rating,
        approved: false,
        featured: false,
        sortOrder: 0,
      })
      .returning();

    return NextResponse.json({ ok: true, id: t.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
