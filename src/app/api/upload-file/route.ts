import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { savePublicVideo, saveSecureFile } from "@/lib/files";

export const dynamic = "force-dynamic";

const MAX_SIZE = 200 * 1024 * 1024; // 200MB for files/videos

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const kind = (formData.get("kind") as string) || "file";

    if (!file) return NextResponse.json({ error: "فایلی ارسال نشده است" }, { status: 400 });
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "حجم فایل بیش از حد مجاز است" }, { status: 400 });
    }

    if (kind === "video") {
      const result = await savePublicVideo(file);
      return NextResponse.json({ url: result.publicUrl, fileName: result.fileName });
    }

    const result = await saveSecureFile(file);
    return NextResponse.json({ filePath: result.filePath, fileName: result.fileName });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطا در بارگذاری" },
      { status: 400 },
    );
  }
}
