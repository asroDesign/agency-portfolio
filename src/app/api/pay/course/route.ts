import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { requestPayment, getRequestOrigin } from "@/lib/payment";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "برای ثبت‌نام وارد حساب کاربری شوید" }, { status: 401 });
  }

  try {
    const { courseId } = await req.json();
    const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
    if (!course) return NextResponse.json({ error: "دوره پیدا نشد" }, { status: 404 });

    // Already enrolled?
    const [existing] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, session.userId),
          eq(enrollments.courseId, courseId),
        ),
      );
    if (existing && (existing.status === "paid" || existing.status === "free")) {
      return NextResponse.json({ alreadyEnrolled: true });
    }

    // Free course
    if (!course.price || course.price <= 0) {
      await db.insert(enrollments).values({
        id: newId("enr"),
        userId: session.userId,
        courseId,
        status: "free",
        amount: 0,
      });
      return NextResponse.json({ status: "free" });
    }

    const origin = getRequestOrigin(req);
    const callbackUrl = `${origin}/api/pay/course/verify`;

    const { authority, redirectUrl } = await requestPayment({
      amount: course.price,
      description: `ثبت‌نام در دوره «${course.title}»`,
      callbackUrl,
    });

    await db.insert(enrollments).values({
      id: newId("enr"),
      userId: session.userId,
      courseId,
      status: "pending",
      amount: course.price,
      authority,
    });

    return NextResponse.json({ redirectUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطای سرور" },
      { status: 500 },
    );
  }
}
