import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { newId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2, "نام حداقل ۲ حرف باشد").max(80),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  phone: z.string().optional().or(z.literal("")),
  service: z.string().min(1, "نوع خدمت را انتخاب کنید"),
  budget: z.string().optional().or(z.literal("")),
  description: z.string().min(10, "توضیحات پروژه را کامل‌تر بنویسید").max(5000),
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

    const data = parsed.data;
    const [order] = await db
      .insert(orders)
      .values({
        id: newId("ord"),
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        service: data.service,
        budget: data.budget || null,
        description: data.description,
        status: "new",
      })
      .returning();

    return NextResponse.json({ ok: true, id: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
