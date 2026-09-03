import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { signSession, SESSION_COOKIE } from "@/lib/auth";
import { newId } from "@/lib/utils";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ حرف باشد").max(80),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور حداقل ۶ حرف باشد").max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "ورودی نامعتبر" },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const emailLower = email.toLowerCase();

    const [existing] = await db.select().from(users).where(eq(users.email, emailLower));
    if (existing) {
      return NextResponse.json({ error: "این ایمیل قبلاً ثبت شده است" }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({ id: newId("usr"), name, email: emailLower, passwordHash, role: "customer" })
      .returning();

    const token = await signSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({ ok: true, user: { name: user.name, email: user.email, role: user.role } });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
