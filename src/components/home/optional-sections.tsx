import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionArt } from "./section-art";
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
  return <section className="section-shell bg-base-200/55"><Container><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="مجله تیم آسرو" title={title ?? "از دنیای دیجیتال بیشتر بدانید"} subtitle={subtitle} /><Link href="/blog" className="btn btn-outline rounded-xl border-base-300 text-base-content hover:border-primary hover:bg-primary hover:text-primary-content">همه مقالات <ArrowLeft className="h-4 w-4" /></Link></div><div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div></Container></section>;
}

export function TestimonialFormSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return (
    <section className="section-shell relative overflow-hidden bg-base-200/55" aria-labelledby="feedback-heading">
      <Container>
        <SectionArt variant="feedback" className="absolute left-6 top-32 hidden w-40 opacity-75 xl:block 2xl:left-16 2xl:w-48" />
        <SectionArt variant="conversation" className="absolute bottom-24 right-6 hidden w-36 opacity-55 xl:block 2xl:right-16 2xl:w-44" />
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
