import { db } from "@/db";
import {
  blogPosts,
  courses,
  courseSessions,
  testimonials,
  templates,
  templateCategories,
  templateTutorials,
  templateFaqs,
  templateUpdates,
  templateQuestions,
  enrollments,
  templateOrders,
} from "@/db/schema";
import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import { cache } from "react";

// ---- Blog ----
export const getPublishedPosts = cache(async () => {
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.createdAt));
});

export const getPostBySlug = cache(async (slug: string) => {
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)));
  return post ?? null;
});

export const getFeaturedPosts = cache(async () => {
  return db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.published, true), eq(blogPosts.featured, true)))
    .orderBy(desc(blogPosts.createdAt))
    .limit(3);
});

// ---- Courses ----
export const getPublishedCourses = cache(async () => {
  return db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(asc(courses.createdAt));
});

export const getCourseBySlug = cache(async (slug: string) => {
  const [course] = await db
    .select()
    .from(courses)
    .where(and(eq(courses.slug, slug), eq(courses.published, true)));
  return course ?? null;
});

export const getCourseSessions = cache(async (courseId: string) => {
  return db
    .select()
    .from(courseSessions)
    .where(eq(courseSessions.courseId, courseId))
    .orderBy(asc(courseSessions.sortOrder), asc(courseSessions.createdAt));
});

// ---- Testimonials ----
export const getApprovedTestimonials = cache(async () => {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.approved, true))
    .orderBy(desc(testimonials.featured), asc(testimonials.sortOrder));
});

// ---- Templates ----
export const getPublishedTemplates = cache(async () => {
  return db
    .select()
    .from(templates)
    .where(eq(templates.published, true))
    .orderBy(desc(templates.featured), asc(templates.createdAt));
});

export const getTemplateBySlug = cache(async (slug: string) => {
  const [tpl] = await db
    .select()
    .from(templates)
    .where(and(eq(templates.slug, slug), eq(templates.published, true)));
  return tpl ?? null;
});

export const getTemplateCategories = cache(async () => {
  return db.select().from(templateCategories).orderBy(asc(templateCategories.sortOrder));
});

export async function getRelatedTemplates(templateId: string, categoryId: string | null) {
  if (!categoryId) {
    return db
      .select()
      .from(templates)
      .where(and(eq(templates.published, true), ne(templates.id, templateId)))
      .orderBy(desc(templates.featured), asc(templates.createdAt))
      .limit(3);
  }
  return db
    .select()
    .from(templates)
    .where(
      and(
        eq(templates.published, true),
        eq(templates.categoryId, categoryId),
        ne(templates.id, templateId),
      ),
    )
    .orderBy(desc(templates.featured), asc(templates.createdAt))
    .limit(3);
}

// ---- Access checks (used in account panel) ----
export async function getEnrolledCourseIds(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.status, "paid"),
      ),
    );
  const free = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.status, "free")));
  const set = new Set<string>();
  for (const r of [...rows, ...free]) set.add(r.courseId);
  return set;
}

export async function getOwnedTemplateIds(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ templateId: templateOrders.templateId })
    .from(templateOrders)
    .where(and(eq(templateOrders.userId, userId), eq(templateOrders.status, "paid")));
  return new Set(rows.map((r) => r.templateId));
}

export async function getEnrolledCourses(userId: string) {
  const rows = await db
    .select({ courseId: enrollments.courseId, status: enrollments.status })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        inArray(enrollments.status, ["paid", "free"]),
      ),
    );
  const ids = rows.map((r) => r.courseId);
  if (ids.length === 0) return [];
  return db.select().from(courses).where(inArray(courses.id, ids));
}

export const getTemplateTutorials = cache(async (templateId: string) => {
  return db
    .select()
    .from(templateTutorials)
    .where(eq(templateTutorials.templateId, templateId))
    .orderBy(asc(templateTutorials.sortOrder), asc(templateTutorials.createdAt));
});

export const getTemplateFaqs = cache(async (templateId: string) => {
  return db
    .select()
    .from(templateFaqs)
    .where(eq(templateFaqs.templateId, templateId))
    .orderBy(asc(templateFaqs.sortOrder));
});

export const getTemplateUpdates = cache(async (templateId: string) => {
  return db
    .select()
    .from(templateUpdates)
    .where(eq(templateUpdates.templateId, templateId))
    .orderBy(desc(templateUpdates.releasedAt));
});

export const getAnsweredQuestions = cache(async (templateId: string) => {
  return db
    .select()
    .from(templateQuestions)
    .where(eq(templateQuestions.templateId, templateId))
    .orderBy(desc(templateQuestions.updatedAt));
});

export async function getOwnedTemplates(userId: string) {
  const rows = await db
    .select({ templateId: templateOrders.templateId })
    .from(templateOrders)
    .where(and(eq(templateOrders.userId, userId), eq(templateOrders.status, "paid")));
  const ids = rows.map((r) => r.templateId);
  if (ids.length === 0) return [];
  return db.select().from(templates).where(inArray(templates.id, ids));
}
