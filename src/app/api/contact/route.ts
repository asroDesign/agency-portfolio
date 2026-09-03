import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2, "نام حداقل ۲ حرف باشد").max(80),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  subject: z.string().min(2, "موضوع را وارد کنید").max(150),
  message: z.string().min(5, "پیام حداقل ۵ حرف باشد").max(3000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "ورودی نامعتبر" },
        { status: 400 },
      );
    }

    const [msg] = await db
      .insert(messages)
      .values({ id: newId("msg"), ...parsed.data, read: false })
      .returning();

    return NextResponse.json({ ok: true, id: msg.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
