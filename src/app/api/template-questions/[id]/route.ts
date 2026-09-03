import { NextResponse } from "next/server";
import { db } from "@/db";
import { templateQuestions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { z } from "zod";

export const dynamic = "force-dynamic";

const answerSchema = z.object({
  answer: z.string().min(2, "پاسخ الزامی است").max(3000),
});

// Admin: answer a question
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = answerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "پاسخ الزامی است" }, { status: 400 });

    const [q] = await db
      .update(templateQuestions)
      .set({ answer: parsed.data.answer, answered: true, updatedAt: new Date() })
      .where(eq(templateQuestions.id, id))
      .returning();

    if (!q) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
    return NextResponse.json({ question: q });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    await db.delete(templateQuestions).where(eq(templateQuestions.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
