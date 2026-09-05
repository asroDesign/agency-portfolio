"use client";

import { useEffect } from "react";

/** Progressive enhancement: content remains visible without JavaScript. */
export function HomepageMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".home-content .section-shell article"));
    let observer: IntersectionObserver | undefined;
    const reset = () => {
      observer?.disconnect();
      elements.forEach((element) => element.removeAttribute("data-reveal"));
    };
    const setup = () => {
      reset();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.setAttribute("data-reveal", "visible");
          observer?.unobserve(target);
        });
      }, { threshold: 0.08 });
      elements.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.setAttribute("data-reveal", "pending");
        observer?.observe(element);
      });
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { reset(); preference.removeEventListener("change", setup); };
  }, []);
  return null;
}
