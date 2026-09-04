"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Testimonial } from "@/db/schema";

type Slide = Pick<Testimonial, "id" | "name" | "role" | "content" | "rating" | "avatarUrl">;

export function TestimonialSlider({ testimonials }: { testimonials: Slide[] }) {
  const [active, setActive] = useState(0);
  const change = (offset: number) => setActive((current) => (current + offset + testimonials.length) % testimonials.length);

  return (
    <div className="mx-auto mt-9 max-w-4xl" role="region" aria-roledescription="اسلایدر" aria-label="نظرات مشتریان">
      <div className="grid" aria-live="polite" aria-atomic="true">
        {testimonials.map((testimonial, index) => (
          <figure
            key={testimonial.id}
            aria-hidden={index !== active}
            className={`col-start-1 row-start-1 flex min-w-0 flex-col items-center text-center transition-opacity duration-300 motion-reduce:transition-none ${index === active ? "opacity-100" : "pointer-events-none invisible opacity-0"}`}
          >
            <blockquote className="mb-9 w-full flex-1 text-lg font-medium leading-9 text-base-content/85 sm:text-xl sm:leading-10">
              <p>{testimonial.content}</p>
            </blockquote>
            <div className="flex gap-1" aria-label={`امتیاز ${testimonial.rating} از ۵`}>
              {Array.from({ length: 5 }, (_, star) => (
                <Star key={star} aria-hidden="true" className={`h-5 w-5 ${star < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-base-300"}`} />
              ))}
            </div>
            <figcaption className="mt-7 flex items-center justify-center gap-3">
              {testimonial.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={testimonial.avatarUrl} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content">
                  {testimonial.name.charAt(0)}
                </span>
              )}
              <div className="text-start">
                <p className="text-sm font-bold">{testimonial.name}</p>
                {testimonial.role && <p className="mt-1 text-xs leading-6 text-base-content/55">{testimonial.role}</p>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      {testimonials.length > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button type="button" onClick={() => change(-1)} className="btn btn-ghost h-9 min-h-9 w-9 rounded-xl border border-base-content/10 p-0" aria-label="نظر قبلی">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="flex max-w-64 flex-wrap justify-center">
            {testimonials.map((testimonial, index) => (
              <button key={testimonial.id} type="button" onClick={() => setActive(index)} aria-label={`نمایش نظر ${index + 1}`} aria-current={index === active ? "true" : undefined} className="flex h-9 min-w-6 items-center justify-center rounded-lg px-1 focus-visible:outline-2 focus-visible:outline-primary">
                <span className={`h-2 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${index === active ? "w-6 bg-primary" : "w-2 bg-base-content/15"}`} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => change(1)} className="btn btn-ghost h-9 min-h-9 w-9 rounded-xl border border-base-content/10 p-0" aria-label="نظر بعدی">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
