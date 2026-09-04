import { NextResponse } from "next/server";
import { db } from "@/db";
import { templateOrders, templates, addons, users } from "@/db/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { verifyPayment, getRequestOrigin } from "@/lib/payment";
import { sendMail, purchaseEmailHtml } from "@/lib/mailer";

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

    // Send email with download link + addons
    try {
      const [template] = await db.select().from(templates).where(eq(templates.id, order.templateId));
      const [user] = await db.select().from(users).where(eq(users.id, order.userId));

      const addonIds = order.addonIds ?? [];
      let addonList: { name: string }[] = [];
      if (addonIds.length > 0) {
        const rows = await db.select().from(addons).where(inArray(addons.id, addonIds));
        addonList = rows.map((a) => ({ name: a.name }));
      }

      const downloadUrl = `${origin}/api/download?type=template&id=${order.templateId}`;
      await sendMail({
        to: user?.email ?? "",
        subject: `دانلود قالب «${template?.title ?? ""}»`,
        html: purchaseEmailHtml({
          customerName: user?.name ?? "کاربر",
          templateTitle: template?.title ?? "",
          downloadUrl,
          addons: addonList,
        }),
      });
    } catch (emailErr) {
      console.error("Failed to send purchase email:", emailErr);
    }

    return NextResponse.redirect(new URL("/account/templates?status=success", origin));
  } catch {
    return NextResponse.redirect(new URL("/account/templates?status=failed", origin));
  }
}
