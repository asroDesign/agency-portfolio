import { NextResponse } from "next/server";
import { db } from "@/db";
import { supportTickets, ticketReplies, templates, templateOrders } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { requireAdmin } from "@/lib/api";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Admin: list all tickets (with template + user info)
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const tickets = await db
    .select({
      id: supportTickets.id,
      subject: supportTickets.subject,
      message: supportTickets.message,
      status: supportTickets.status,
      createdAt: supportTickets.createdAt,
      updatedAt: supportTickets.updatedAt,
      userId: supportTickets.userId,
      templateId: supportTickets.templateId,
      templateTitle: templates.title,
      userName: supportTickets.userId,
    })
    .from(supportTickets)
    .leftJoin(templates, eq(templates.id, supportTickets.templateId))
    .orderBy(desc(supportTickets.updatedAt));

  return NextResponse.json({ tickets });
}

const createSchema = z.object({
  templateId: z.string().min(1),
  subject: z.string().min(3, "موضوع حداقل ۳ حرف باشد").max(200),
  message: z.string().min(10, "پیام حداقل ۱۰ حرف باشد").max(5000),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "برای ارسال تیکت وارد حساب کاربری شوید" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "ورودی نامعتبر" }, { status: 400 });
    }

    const { templateId, subject, message } = parsed.data;

    // Verify ownership (only paid templates require purchase)
    const [template] = await db.select().from(templates).where(eq(templates.id, templateId));
    if (!template) return NextResponse.json({ error: "قالب پیدا نشد" }, { status: 404 });

    if (template.price > 0) {
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
      if (!owned) {
        return NextResponse.json({ error: "برای ارسال تیکت باید ابتدا قالب را خریداری کنید" }, { status: 403 });
      }
    }

    const [ticket] = await db
      .insert(supportTickets)
      .values({
        id: newId("tkt"),
        userId: session.userId,
        templateId,
        subject,
        message,
        status: "open",
      })
      .returning();

    return NextResponse.json({ ticket }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
