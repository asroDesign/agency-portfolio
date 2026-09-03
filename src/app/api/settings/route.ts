import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { z } from "zod";

export const dynamic = "force-dynamic";

const settingsSchema = z.record(z.string(), z.string().max(10000));

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "ورودی نامعتبر" }, { status: 400 });

    const existing = await db.select().from(settings);
    const existingKeys = new Set(existing.map((s) => s.key));

    for (const [key, value] of Object.entries(parsed.data)) {
      if (existingKeys.has(key)) {
        await db
          .update(settings)
          .set({ value, updatedAt: new Date() })
          .where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({ key, value });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
