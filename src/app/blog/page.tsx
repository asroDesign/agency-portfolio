import type { Metadata } from "next";
import Image from "next/image";
import blogIllustration from "@/app/uploads/blog-vec.png";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Container } from "@/components/ui";
import { IllustrationRings } from "@/components/ui/illustration-rings";
import { formatNumber } from "@/lib/utils";
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
    <div className="min-h-screen bg-base-100 text-base-content">
      <SiteHeader />
      <main>
        <section className="relative z-10 isolate overflow-visible bg-[radial-gradient(circle_at_20%_45%,#d7f2f8,transparent_38%),linear-gradient(135deg,#f8fdff,#eaf7fc)] pb-24 pt-24 sm:pt-28">
          <Container>
            <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div>
                <p className="badge border-0 bg-primary/10 px-4 py-4 text-xs font-bold text-primary">مجله نکسا</p>
          <h1 className="mt-5 text-3xl font-black leading-relaxed tracking-tight sm:text-4xl lg:text-5xl">وبلاگ <span className="text-primary">نکسا تک</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/65">
            مقالات، نکات و آموزش‌های کاربردی در دنیای طراحی و توسعه وب.
          </p>
                <a href="#blog-posts" className="btn btn-primary mt-7 rounded-xl border-0 px-6 shadow-none">مطالعه مقالات <ArrowLeft className="h-4 w-4" /></a>
              </div>
              <div className="relative isolate">
                <div className="pointer-events-none absolute inset-y-0 inset-x-[7%] -z-10">
                  <IllustrationRings />
                </div>
                <Image src={blogIllustration} alt="" priority sizes="(min-width: 1024px) 50vw, 100vw" className="mx-auto h-auto w-full max-w-[780px] object-contain" />
              </div>
            </div>
          </Container>
        </section>
        <section id="blog-posts" aria-labelledby="blog-posts-heading" className="section-shell scroll-mt-20 bg-[#edf7fd]">
          <Container>
            <div className="flex items-end justify-between gap-5">
              <div><p className="section-kicker">از وبلاگ ما</p><h2 id="blog-posts-heading" className="mt-2 text-2xl font-black sm:text-3xl">مقالات و آموزش‌ها</h2></div>
              <span className="shrink-0 text-xs text-base-content/55">{formatNumber(posts.length)} مقاله</span>
            </div>

        {posts.length === 0 ? (
          <div className="mt-9 rounded-3xl border border-base-content/8 bg-white/80 px-6 py-16 text-center">
            <BookOpen aria-hidden="true" className="mx-auto h-10 w-10 text-primary/60" />
            <p className="mt-4 font-semibold text-base-content/65">هنوز مقاله‌ای منتشر نشده است</p>
          </div>
        ) : (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        )}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
