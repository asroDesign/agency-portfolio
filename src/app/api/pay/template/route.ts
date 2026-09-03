import { NextResponse } from "next/server";
import { db } from "@/db";
import { templates, templateOrders } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { requestPayment, getRequestOrigin } from "@/lib/payment";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "برای خرید وارد حساب کاربری شوید" }, { status: 401 });
  }

  try {
    const { templateId } = await req.json();
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

    const origin = getRequestOrigin(req);
    const callbackUrl = `${origin}/api/pay/template/verify`;

    const { authority, redirectUrl } = await requestPayment({
      amount: template.price,
      description: `خرید قالب «${template.title}»`,
      callbackUrl,
    });

    await db.insert(templateOrders).values({
      id: newId("tpl"),
      userId: session.userId,
      templateId,
      amount: template.price,
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
