import type { Metadata } from "next";
import { db } from "@/db";
import { pageMeta } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

const SITE_NAME = "نکسا تک | طراحی وب‌سایت، اپلیکیشن و سئو";

export const getPageMeta = cache(async (path: string) => {
  const [meta] = await db.select().from(pageMeta).where(eq(pageMeta.path, path));
  return meta ?? null;
});

export async function buildMetadata(
  path: string,
  fallback: { title: string; description: string; keywords?: string[] },
): Promise<Metadata> {
  const meta = await getPageMeta(path);
  const title = meta?.title || fallback.title;
  const description = meta?.description || fallback.description;
  const keywords = meta?.keywords
    ? meta.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : fallback.keywords;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    ...(meta?.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
      locale: "fa_IR",
      ...(meta?.ogImage ? { images: [{ url: meta.ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
