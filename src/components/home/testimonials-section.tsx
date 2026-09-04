import { Quote, Star } from "lucide-react";
import { getApprovedTestimonials } from "@/lib/catalog";
import { Container, SectionHeading } from "@/components/ui";

export async function TestimonialsSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const testimonials = await getApprovedTestimonials();
  if (testimonials.length === 0) return null;
  return (
    <section className="reference-surface section-shell">
      <Container>
        <SectionHeading eyebrow="نظرات مشتریان" title={title ?? "مشتریان ما چه می‌گویند"} subtitle={subtitle} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial) => (
            <article key={testimonial.id} className="soft-card flex flex-col rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <Quote className="h-6 w-6 text-primary/40" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-3.5 w-3.5 ${index < testimonial.rating ? "fill-warning text-warning" : "text-base-300"}`} />)}
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-7 text-base-content/75">«{testimonial.content}»</p>
              <div className="mt-5 flex items-center gap-3">
                {testimonial.avatarUrl ? <img src={testimonial.avatarUrl} alt={testimonial.name} className="h-10 w-10 rounded-full object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">{testimonial.name.charAt(0)}</div>}
                <div><p className="text-sm font-bold">{testimonial.name}</p>{testimonial.role && <p className="text-xs text-base-content/50">{testimonial.role}</p>}</div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
