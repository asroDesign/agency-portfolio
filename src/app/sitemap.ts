import type { MetadataRoute } from "next";
import { db } from "@/db";
import { blogPosts, courses, templates, portfolioItems } from "@/db/schema";
import { eq } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexatech.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, courseList, templateList, portfolioList] = await Promise.all([
    db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts).where(eq(blogPosts.published, true)),
    db.select({ slug: courses.slug }).from(courses).where(eq(courses.published, true)),
    db.select({ slug: templates.slug }).from(templates).where(eq(templates.published, true)),
    db.select({ slug: portfolioItems.slug }).from(portfolioItems),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "/",
    "/portfolio",
    "/blog",
    "/courses",
    "/templates",
    "/about",
    "/contact",
    "/order",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const dynamicPages: MetadataRoute.Sitemap = [
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...courseList.map((c) => ({ url: `${SITE_URL}/courses/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...templateList.map((t) => ({ url: `${SITE_URL}/templates/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...portfolioList.map((p) => ({ url: `${SITE_URL}/portfolio/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  return [...staticPages, ...dynamicPages];
}
