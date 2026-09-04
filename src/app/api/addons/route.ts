import { NextResponse } from "next/server";
import { db } from "@/db";
import { addons } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const templateId = new URL(req.url).searchParams.get("templateId");
  const list = templateId
    ? await db.select().from(addons).where(eq(addons.templateId, templateId)).orderBy(asc(addons.sortOrder))
    : await db.select().from(addons).orderBy(asc(addons.sortOrder));
  return NextResponse.json({ addons: list });
}

const schema = z.object({
  name: z.string().min(1, "نام الزامی است").max(150),
  description: z.string().min(1, "توضیحات الزامی است"),
  price: z.coerce.number().int().min(0),
  type: z.enum(["file", "option"]),
  filePath: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
  templateId: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "ورودی نامعتبر" }, { status: 400 });

    const [addon] = await db
      .insert(addons)
      .values({
        id: newId("adn"),
        name: parsed.data.name,
        description: parsed.data.description,
        price: parsed.data.price,
        type: parsed.data.type,
        filePath: parsed.data.filePath || null,
        fileName: parsed.data.fileName || null,
        templateId: parsed.data.templateId || null,
        sortOrder: 0,
      })
      .returning();

    return NextResponse.json({ addon }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
