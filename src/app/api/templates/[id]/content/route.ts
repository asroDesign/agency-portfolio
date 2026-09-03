import { NextResponse } from "next/server";
import { db } from "@/db";
import { templateTutorials, templateFaqs, templateUpdates } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { id } = await params;
  const kind = new URL(req.url).searchParams.get("kind");

  if (kind === "tutorial") {
    const items = await db
      .select()
      .from(templateTutorials)
      .where(eq(templateTutorials.templateId, id))
      .orderBy(asc(templateTutorials.sortOrder));
    return NextResponse.json({ items });
  }
  if (kind === "faq") {
    const items = await db
      .select()
      .from(templateFaqs)
      .where(eq(templateFaqs.templateId, id))
      .orderBy(asc(templateFaqs.sortOrder));
    return NextResponse.json({ items });
  }
  if (kind === "update") {
    const items = await db
      .select()
      .from(templateUpdates)
      .where(eq(templateUpdates.templateId, id))
      .orderBy(desc(templateUpdates.releasedAt));
    return NextResponse.json({ items });
  }

  return NextResponse.json({ error: "نوع نامعتبر" }, { status: 400 });
}
