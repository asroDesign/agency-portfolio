"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; radius: number };

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const createParticles = () => {
      const count = Math.min(72, Math.max(28, Math.floor((width * height) / 18000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.5 + 0.7,
      }));
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const maxDistance = Math.min(150, width * 0.2);

      if (!mediaQuery.matches) {
        for (const particle of particles) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -10) particle.x = width + 10;
          if (particle.x > width + 10) particle.x = -10;
          if (particle.y < -10) particle.y = height + 10;
          if (particle.y > height + 10) particle.y = -10;
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        context.beginPath();
        context.fillStyle = "rgba(103, 232, 249, 0.72)";
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();

        if (mediaQuery.matches) continue;
        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < maxDistance) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(45, 212, 191, ${0.15 * (1 - distance / maxDistance)})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }
      }

      if (!mediaQuery.matches) frame = window.requestAnimationFrame(draw);
    };

    const handleMotionChange = () => {
      window.cancelAnimationFrame(frame);
      resize();
      draw();
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    mediaQuery.addEventListener?.("change", handleMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      mediaQuery.removeEventListener?.("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />;
}
