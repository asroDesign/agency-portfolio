import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
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
  return <section className="section-shell bg-base-100"><Container><div className="mx-auto max-w-3xl rounded-3xl border border-base-content/10 bg-base-200/45 p-6 sm:p-10"><div className="flex items-center justify-center gap-2 text-primary"><Newspaper className="h-5 w-5" /><span className="text-sm font-bold">بازخورد شما</span></div><SectionHeading title={title ?? "تجربه خود را با ما به اشتراک بگذارید"} subtitle={subtitle} align="center" /><div className="mt-8"><TestimonialForm /></div></div></Container></section>;
}
