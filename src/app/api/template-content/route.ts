import { NextResponse } from "next/server";
import { db } from "@/db";
import { templateTutorials, templateFaqs, templateUpdates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

const tutorialSchema = z.object({
  templateId: z.string().min(1),
  title: z.string().min(1, "عنوان الزامی است").max(200),
  type: z.enum(["video", "text"]),
  videoUrl: z.string().url().optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
});

const faqSchema = z.object({
  templateId: z.string().min(1),
  question: z.string().min(1, "سوال الزامی است").max(300),
  answer: z.string().min(1, "پاسخ الزامی است").max(2000),
  sortOrder: z.coerce.number().int().default(0),
});

const updateSchema = z.object({
  templateId: z.string().min(1),
  version: z.string().min(1, "نسخه الزامی است").max(50),
  title: z.string().min(1, "عنوان الزامی است").max(200),
  changes: z.string().min(1, "تغییرات الزامی است"),
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const kind = body.kind as string;

    if (kind === "tutorial") {
      const parsed = tutorialSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "ورودی نامعتبر" }, { status: 400 });
      const d = parsed.data;
      const [t] = await db
        .insert(templateTutorials)
        .values({
          id: newId("tut"),
          templateId: d.templateId,
          title: d.title,
          type: d.type,
          videoUrl: d.videoUrl || null,
          content: d.content || null,
          sortOrder: d.sortOrder,
        })
        .returning();
      return NextResponse.json({ item: t }, { status: 201 });
    }

    if (kind === "faq") {
      const parsed = faqSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "ورودی نامعتبر" }, { status: 400 });
      const d = parsed.data;
      const [f] = await db
        .insert(templateFaqs)
        .values({ id: newId("faq"), templateId: d.templateId, question: d.question, answer: d.answer, sortOrder: d.sortOrder })
        .returning();
      return NextResponse.json({ item: f }, { status: 201 });
    }

    if (kind === "update") {
      const parsed = updateSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "ورودی نامعتبر" }, { status: 400 });
      const d = parsed.data;
      const [u] = await db
        .insert(templateUpdates)
        .values({ id: newId("upd"), templateId: d.templateId, version: d.version, title: d.title, changes: d.changes, releasedAt: new Date() })
        .returning();
      return NextResponse.json({ item: u }, { status: 201 });
    }

    return NextResponse.json({ error: "نوع نامعتبر" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
