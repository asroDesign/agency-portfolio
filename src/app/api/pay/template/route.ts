import { NextResponse } from "next/server";
import { db } from "@/db";
import { templates, templateOrders, addons } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { requestPayment, getRequestOrigin } from "@/lib/payment";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  templateId: z.string().min(1),
  addonIds: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "برای خرید وارد حساب کاربری شوید" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "ورودی نامعتبر" }, { status: 400 });

    const { templateId, addonIds } = parsed.data;
    const [template] = await db.select().from(templates).where(eq(templates.id, templateId));
    if (!template) return NextResponse.json({ error: "قالب پیدا نشد" }, { status: 404 });

    const [owned] = await db
      .select()
      .from(templateOrders)
      .where(
        and(
          eq(templateOrders.userId, session.userId),
          eq(templateOrders.templateId, templateId),
          eq(templateOrders.status, "paid"),
        ),
      );
    if (owned) return NextResponse.json({ alreadyOwned: true });

    // Compute total: template price + selected addons
    let addonList: typeof addons.$inferSelect[] = [];
    if (addonIds.length > 0) {
      addonList = await db.select().from(addons).where(inArray(addons.id, addonIds));
    }
    const addonsTotal = addonList.reduce((sum, a) => sum + a.price, 0);
    const total = template.price + addonsTotal;

    const origin = getRequestOrigin(req);
    const callbackUrl = `${origin}/api/pay/template/verify`;

    const { authority, redirectUrl } = await requestPayment({
      amount: total,
      description: `خرید قالب «${template.title}»${addonList.length ? " + ادان‌ها" : ""}`,
      callbackUrl,
    });

    await db.insert(templateOrders).values({
      id: newId("tpl"),
      userId: session.userId,
      templateId,
      addonIds,
      amount: total,
      status: "pending",
      authority,
    });

    return NextResponse.json({ redirectUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطای سرور" },
      { status: 500 },
    );
  }
}
