import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageSections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({ ids: z.array(z.string()) });

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "ورودی نامعتبر" }, { status: 400 });

    for (let i = 0; i < parsed.data.ids.length; i++) {
      await db
        .update(pageSections)
        .set({ sortOrder: i })
        .where(eq(pageSections.id, parsed.data.ids[i]));
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
