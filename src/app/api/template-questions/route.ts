import { NextResponse } from "next/server";
import { db } from "@/db";
import { templateQuestions, templates } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { requireAdmin } from "@/lib/api";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Admin: list all questions (optionally filter by templateId)
export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const url = new URL(req.url);
  const templateId = url.searchParams.get("templateId");

  const rows = await db
    .select({
      id: templateQuestions.id,
      templateId: templateQuestions.templateId,
      userId: templateQuestions.userId,
      name: templateQuestions.name,
      email: templateQuestions.email,
      question: templateQuestions.question,
      answer: templateQuestions.answer,
      answered: templateQuestions.answered,
      createdAt: templateQuestions.createdAt,
      updatedAt: templateQuestions.updatedAt,
      templateTitle: templates.title,
    })
    .from(templateQuestions)
    .leftJoin(templates, eq(templates.id, templateQuestions.templateId))
    .where(templateId ? eq(templateQuestions.templateId, templateId) : undefined)
    .orderBy(desc(templateQuestions.createdAt));

  return NextResponse.json({ questions: rows });
}

const createSchema = z.object({
  templateId: z.string().min(1),
  name: z.string().min(2, "نام حداقل ۲ حرف باشد").max(80),
  email: z.string().email("ایمیل معتبر وارد کنید").optional().or(z.literal("")),
  question: z.string().min(5, "سوال حداقل ۵ حرف باشد").max(1000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "ورودی نامعتبر" },
        { status: 400 },
      );
    }

    const session = await getSession();
    const { templateId, question } = parsed.data;

    // Use session name if available, otherwise provided name
    const name = session?.name || parsed.data.name;
    const email = session?.email || parsed.data.email || null;

    const [q] = await db
      .insert(templateQuestions)
      .values({
        id: newId("tq"),
        templateId,
        userId: session?.userId ?? null,
        name,
        email,
        question,
        answered: false,
      })
      .returning();

    return NextResponse.json({ ok: true, question: q }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
