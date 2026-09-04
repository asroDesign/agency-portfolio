import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BlogCard } from "@/components/blog-card";
import { getPublishedPosts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/blog", {
    title: "وبلاگ آموزش طراحی وب و سئو | نکسا تک",
    description: "مقالات و آموزش‌های کاربردی در دنیای طراحی وب، برنامه‌نویسی و سئو.",
    keywords: ["آموزش طراحی وب", "مقالات سئو", "برنامه نویسی"],
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page-main">
        <div className="page-intro">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">وبلاگ نکسا تک</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            مقالات، نکات و آموزش‌های کاربردی در دنیای طراحی و توسعه وب.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-slate-300 py-20 text-center">
            <p className="text-5xl">📝</p>
            <p className="mt-4 font-semibold text-slate-600">هنوز مقاله‌ای منتشر نشده است</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
