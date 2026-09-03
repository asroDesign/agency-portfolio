import { NextResponse } from "next/server";
import { db } from "@/db";
import { supportTickets, ticketReplies, users } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { requireAdmin } from "@/lib/api";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

async function canAccess(userId: string, ticketId: string) {
  const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, ticketId));
  return ticket && ticket.userId === userId ? ticket : null;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });

  const { id } = await params;
  const isAdmin = session.role === "admin";
  const ticket = isAdmin
    ? (await db.select().from(supportTickets).where(eq(supportTickets.id, id)))[0]
    : await canAccess(session.userId, id);

  if (!ticket) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });

  const replies = await db
    .select({
      id: ticketReplies.id,
      message: ticketReplies.message,
      isStaff: ticketReplies.isStaff,
      createdAt: ticketReplies.createdAt,
      userName: users.name,
    })
    .from(ticketReplies)
    .leftJoin(users, eq(users.id, ticketReplies.userId))
    .where(eq(ticketReplies.ticketId, id))
    .orderBy(asc(ticketReplies.createdAt));

  return NextResponse.json({ ticket, replies });
}

const replySchema = z.object({ message: z.string().min(1, "پیام الزامی است").max(5000) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "پیام الزامی است" }, { status: 400 });

    const isAdmin = session.role === "admin";
    const ticket = isAdmin
      ? (await db.select().from(supportTickets).where(eq(supportTickets.id, id)))[0]
      : await canAccess(session.userId, id);

    if (!ticket) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    if (ticket.status === "closed") {
      return NextResponse.json({ error: "این تیکت بسته شده است" }, { status: 400 });
    }

    const [reply] = await db
      .insert(ticketReplies)
      .values({
        id: newId("rpl"),
        ticketId: id,
        userId: session.userId,
        isStaff: isAdmin,
        message: parsed.data.message,
      })
      .returning();

    // If customer replies to an answered ticket, reopen it. If staff replies, mark answered.
    const newStatus = isAdmin ? "answered" : ticket.status === "answered" ? "open" : ticket.status;
    await db
      .update(supportTickets)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(supportTickets.id, id));

    return NextResponse.json({ reply }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

const patchSchema = z.object({ status: z.enum(["open", "answered", "closed"]) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });

    const [ticket] = await db
      .update(supportTickets)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();

    if (!ticket) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    return NextResponse.json({ ticket });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    await db.delete(ticketReplies).where(eq(ticketReplies.ticketId, id));
    await db.delete(supportTickets).where(eq(supportTickets.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
