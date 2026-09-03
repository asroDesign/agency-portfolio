import { NextResponse } from "next/server";
import { db } from "@/db";
import { enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPayment, getRequestOrigin } from "@/lib/payment";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const authority = url.searchParams.get("Authority");
  const status = url.searchParams.get("Status");
  const origin = getRequestOrigin(req);

  if (!authority || status !== "OK") {
    return NextResponse.redirect(new URL("/account/courses?status=failed", origin));
  }

  try {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.authority, authority));
    if (!enrollment) throw new Error("not found");

    const { refId } = await verifyPayment(authority, enrollment.amount);
    await db
      .update(enrollments)
      .set({ status: "paid", refId })
      .where(eq(enrollments.id, enrollment.id));

    return NextResponse.redirect(new URL("/account/courses?status=success", origin));
  } catch {
    return NextResponse.redirect(new URL("/account/courses?status=failed", origin));
  }
}
