import { mkdir, writeFile } from "fs/promises";
import path from "path";

const IMAGE_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
]);

const VIDEO_TYPES = new Map([
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["video/ogg", ".ogv"],
  ["video/quicktime", ".mov"],
]);

const FILE_TYPES = new Map([
  ["application/zip", ".zip"],
  ["application/x-zip-compressed", ".zip"],
  ["application/x-rar-compressed", ".rar"],
  ["application/pdf", ".pdf"],
]);

function extFor(mime: string, kind: "image" | "video" | "file"): string | null {
  if (kind === "image") return IMAGE_TYPES.get(mime) ?? null;
  if (kind === "video") return VIDEO_TYPES.get(mime) ?? null;
  return FILE_TYPES.get(mime) ?? ".bin";
}

export interface SaveResult {
  publicUrl?: string; // for public files
  filePath?: string; // for secure files (relative storage key)
  fileName: string;
}

/** Save an uploaded image to the public uploads directory. */
export async function savePublicImage(file: File): Promise<SaveResult> {
  const ext = extFor(file.type, "image");
  if (!ext) throw new Error("فرمت تصویر مجاز نیست");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return { publicUrl: `/uploads/${filename}`, fileName: file.name };
}

/** Save a video file to the public uploads directory (for streaming). */
export async function savePublicVideo(file: File): Promise<SaveResult> {
  const ext = extFor(file.type, "video");
  if (!ext) throw new Error("فرمت ویدیو مجاز نیست");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return { publicUrl: `/uploads/${filename}`, fileName: file.name };
}

/** Save a file to the secure storage directory (NOT publicly accessible). */
export async function saveSecureFile(file: File): Promise<SaveResult> {
  const ext = extFor(file.type, "file");
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}${ext}`;
  const dir = path.join(process.cwd(), "storage");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, key), Buffer.from(await file.arrayBuffer()));
  return { filePath: key, fileName: file.name };
}

export const secureFileDir = () => path.join(process.cwd(), "storage");
