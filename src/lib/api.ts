import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return { authorized: false as const, response: NextResponse.json({ error: "غیرمجاز" }, { status: 401 }) };
  }
  return { authorized: true as const, session };
}
