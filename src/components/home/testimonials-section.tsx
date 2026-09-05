import { SectionArt } from "./section-art";
import { getApprovedTestimonials } from "@/lib/catalog";
import { Container } from "@/components/ui";
import { TestimonialSlider } from "./testimonial-slider";

export async function TestimonialsSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const testimonials = await getApprovedTestimonials();
  if (testimonials.length === 0) return null;
  return (
    <section className="section-shell relative overflow-hidden bg-base-200/55" aria-labelledby="testimonials-heading">
      <Container>
        <SectionArt variant="conversation" className="absolute right-5 top-12 hidden w-36 opacity-75 xl:block 2xl:right-12 2xl:w-44" />
        <SectionArt variant="workspace" className="absolute bottom-10 left-5 hidden w-32 opacity-50 xl:block 2xl:left-12 2xl:w-40" />
        <h2 id="testimonials-heading" className="text-center text-sm font-bold text-primary">{title ?? "نظرات مشتریان"}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-base-content/60">{subtitle}</p>}
        <TestimonialSlider testimonials={testimonials.map(({ id, name, role, content, rating, avatarUrl }) => ({ id, name, role, content, rating, avatarUrl }))} />
      </Container>
    </section>
  );
}
