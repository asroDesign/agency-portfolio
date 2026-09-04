import { Quote } from "lucide-react";
import { getApprovedTestimonials } from "@/lib/catalog";
import { Container } from "@/components/ui";
import { TestimonialSlider } from "./testimonial-slider";

export async function TestimonialsSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const testimonials = await getApprovedTestimonials();
  if (testimonials.length === 0) return null;
  return (
    <section className="section-shell relative overflow-hidden bg-base-200/55" aria-labelledby="testimonials-heading">
      <Container>
        <Quote aria-hidden="true" className="pointer-events-none absolute right-5 top-8 h-16 w-16 fill-primary/5 text-primary/5 sm:right-12 sm:h-20 sm:w-20" />
        <h2 id="testimonials-heading" className="text-center text-sm font-bold text-primary">{title ?? "نظرات مشتریان"}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-base-content/60">{subtitle}</p>}
        <TestimonialSlider testimonials={testimonials.map(({ id, name, role, content, rating, avatarUrl }) => ({ id, name, role, content, rating, avatarUrl }))} />
      </Container>
    </section>
  );
}
