import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HtmlContent } from "@/components/html-content";
import { BlogCard } from "@/components/blog-card";
import { getPostBySlug, getPublishedPosts } from "@/lib/catalog";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "مقاله" };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const keywords = post.keywords ? post.keywords.split(",").map((k) => k.trim()).filter(Boolean) : post.tags;

  return {
    // absolute: true prevents the root layout template from appending "| نکسا تک" again
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords } : {}),
    openGraph: {
      title,
      description,
      type: "article",
      ...(post.coverUrl ? { images: [{ url: post.coverUrl }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getPublishedPosts();
  const related = all.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-container py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
        <article>
          <div className="text-center">
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              <ArrowRight className="h-4 w-4" />
              بازگشت به وبلاگ
            </Link>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">{post.title}</h1>
          </div>

          {post.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverUrl}
              alt={post.title}
              className="mt-8 aspect-[21/9] w-full rounded-3xl object-cover"
            />
          )}

          <div className="mt-8 soft-card rounded-3xl p-6 sm:p-8">
            <HtmlContent html={post.content} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </article>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">مقالات مرتبط</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
