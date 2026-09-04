import Link from "next/link";
import { ArrowLeft, MessageSquareQuote } from "lucide-react";
import { getFeaturedPosts, getPublishedCourses } from "@/lib/catalog";
import { BlogCard } from "@/components/blog/blog-card";
import { CourseCard } from "@/components/courses/course-card";
import { TestimonialForm } from "@/components/testimonial-form";
import { Container, SectionHeading } from "@/components/ui";

export async function CoursesSection({ title, subtitle, count = 3 }: { title?: string | null; subtitle?: string | null; count?: number }) {
  const courses = (await getPublishedCourses()).slice(0, count);
  if (courses.length === 0) return null;
  return <section className="section-shell bg-base-100"><Container><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="یادگیری" title={title ?? "دانش را به مهارت تبدیل کنید"} subtitle={subtitle} /><Link href="/courses" className="btn btn-outline rounded-xl border-base-300 text-base-content hover:border-primary hover:bg-primary hover:text-primary-content">همه دوره‌ها <ArrowLeft className="h-4 w-4" /></Link></div><div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{courses.map((course) => <CourseCard key={course.id} course={course} />)}</div></Container></section>;
}

export async function BlogSection({ title, subtitle, count = 3 }: { title?: string | null; subtitle?: string | null; count?: number }) {
  const posts = (await getFeaturedPosts()).slice(0, count);
  if (posts.length === 0) return null;
  return <section className="section-shell bg-base-200/55"><Container><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="مجله نکسا" title={title ?? "از دنیای دیجیتال بیشتر بدانید"} subtitle={subtitle} /><Link href="/blog" className="btn btn-outline rounded-xl border-base-300 text-base-content hover:border-primary hover:bg-primary hover:text-primary-content">همه مقالات <ArrowLeft className="h-4 w-4" /></Link></div><div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div></Container></section>;
}

export function TestimonialFormSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return (
    <section className="section-shell relative overflow-hidden bg-base-200/55" aria-labelledby="feedback-heading">
      <Container>
        <MessageSquareQuote aria-hidden="true" className="pointer-events-none absolute left-5 top-8 h-16 w-16 text-primary/5 sm:left-12 sm:h-20 sm:w-20" />
        <div className="relative mx-auto max-w-3xl">
          <header className="text-center">
            <p className="text-sm font-bold text-primary">بازخورد شما</p>
            <h2 id="feedback-heading" className="mt-5 text-2xl font-extrabold leading-relaxed text-base-content sm:text-3xl">
              {title ?? "تجربه خود را با ما به اشتراک بگذارید"}
            </h2>
            {subtitle && <p className="mt-3 text-sm leading-7 text-base-content/60 sm:text-base">{subtitle}</p>}
          </header>
          <div className="mt-9 sm:mt-10"><TestimonialForm /></div>
        </div>
      </Container>
    </section>
  );
}
