import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { templates, addons, templateOrders } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { secureFileDir } from "@/lib/files";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type"); // "template" | "addon"
  const id = url.searchParams.get("id");

  if (!type || !id) return NextResponse.json({ error: "پارامتر نامعتبر" }, { status: 400 });

  try {
    if (type === "template") {
      const [template] = await db.select().from(templates).where(eq(templates.id, id));
      if (!template) return NextResponse.json({ error: "قالب پیدا نشد" }, { status: 404 });

      const [order] = await db
        .select()
        .from(templateOrders)
        .where(
          and(
            eq(templateOrders.userId, session.userId),
            eq(templateOrders.templateId, id),
            eq(templateOrders.status, "paid"),
          ),
        );
      if (!order) return NextResponse.json({ error: "این قالب را خریداری نکرده‌اید" }, { status: 403 });

      return streamFile(template.filePath, template.fileName || `${template.title}.zip`);
    }

    if (type === "addon") {
      const [addon] = await db.select().from(addons).where(eq(addons.id, id));
      if (!addon) return NextResponse.json({ error: "ادان پیدا نشد" }, { status: 404 });

      const [order] = await db
        .select()
        .from(templateOrders)
        .where(
          and(
            eq(templateOrders.userId, session.userId),
            eq(templateOrders.status, "paid"),
            sql`${id} = ANY(${templateOrders.addonIds})`,
          ),
        );
      if (!order) return NextResponse.json({ error: "این ادان را خریداری نکرده‌اید" }, { status: 403 });

      return streamFile(addon.filePath, addon.fileName || `${addon.name}.zip`);
    }

    return NextResponse.json({ error: "نوع نامعتبر" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

async function streamFile(filePath: string | null, fileName: string) {
  if (!filePath) {
    return NextResponse.json({ error: "فایلی برای دانلود وجود ندارد" }, { status: 404 });
  }

  try {
    const fullPath = path.join(secureFileDir(), path.basename(filePath));
    const bytes = await readFile(fullPath);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": String(bytes.length),
      },
    });
  } catch {
    return NextResponse.json({ error: "فایل یافت نشد" }, { status: 404 });
  }
}
