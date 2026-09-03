import { NextResponse } from "next/server";
import { db } from "@/db";
import { templateTutorials, templateFaqs, templateUpdates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const kind = new URL(req.url).searchParams.get("kind");

    if (kind === "tutorial") await db.delete(templateTutorials).where(eq(templateTutorials.id, id));
    else if (kind === "faq") await db.delete(templateFaqs).where(eq(templateFaqs.id, id));
    else if (kind === "update") await db.delete(templateUpdates).where(eq(templateUpdates.id, id));
    else return NextResponse.json({ error: "نوع نامعتبر" }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
