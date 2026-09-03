import { NextResponse } from "next/server";
import { db } from "@/db";
import { templateOrders, templates } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { verifyPayment, getRequestOrigin } from "@/lib/payment";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const authority = url.searchParams.get("Authority");
  const status = url.searchParams.get("Status");
  const origin = getRequestOrigin(req);

  if (!authority || status !== "OK") {
    return NextResponse.redirect(new URL("/account/templates?status=failed", origin));
  }

  try {
    const [order] = await db
      .select()
      .from(templateOrders)
      .where(eq(templateOrders.authority, authority));
    if (!order) throw new Error("not found");

    const { refId } = await verifyPayment(authority, order.amount);
    await db
      .update(templateOrders)
      .set({ status: "paid", refId })
      .where(eq(templateOrders.id, order.id));

    // Increment sales counter
    await db
      .update(templates)
      .set({ sales: sql`${templates.sales} + 1` })
      .where(eq(templates.id, order.templateId));

    return NextResponse.redirect(new URL("/account/templates?status=success", origin));
  } catch {
    return NextResponse.redirect(new URL("/account/templates?status=failed", origin));
  }
}
