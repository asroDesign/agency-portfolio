import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BlogEditorForm } from "@/components/blog-editor-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "ویرایش مقاله" };

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">ویرایش مقاله</h1>
      <p className="mt-1 text-sm text-slate-500">
        در حال ویرایش «{post.title}»
      </p>
      <div className="mt-6">
        <BlogEditorForm
          initial={{
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverUrl: post.coverUrl,
            category: post.category,
            author: post.author,
            tags: post.tags ?? [],
            metaTitle: post.metaTitle,
            metaDescription: post.metaDescription,
            keywords: post.keywords,
            published: post.published,
            featured: post.featured,
          }}
        />
      </div>
    </div>
  );
}
