"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

type ParticleBackgroundProps = {
  particleCount?: number;
  connectionDistance?: number;
  interactionRadius?: number;
  particleColor?: string;
  lineColor?: string;
  className?: string;
};

function hexToRgb(hex: string) {
  const normalized = hex
    .replace(/^#/, "")
    .replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, (_, red, green, blue) => `${red}${red}${green}${green}${blue}${blue}`);
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!match) return { red: 56, green: 189, blue: 248 };
  return {
    red: Number.parseInt(match[1], 16),
    green: Number.parseInt(match[2], 16),
    blue: Number.parseInt(match[3], 16),
  };
}

export function ParticleBackground({
  particleCount = 50,
  connectionDistance = 200,
  interactionRadius = 200,
  particleColor = "#35c7eb",
  lineColor = "#189ec7",
  className = "",
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lineRgb = hexToRgb(lineColor);
    const connectionDistanceSq = connectionDistance * connectionDistance;
    const interactionRadiusSq = interactionRadius * interactionRadius;
    let particles: Particle[] = [];
    let frameId = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let mousePosition = { x: -10_000, y: -10_000 };

    const generateParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        size: Math.random() * 3.2 + 0.4,
      }));
    };

    const resizeCanvas = () => {
      const bounds = container.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      generateParticles();
    };

    const updateParticles = () => {
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        const dx = particle.x - mousePosition.x;
        const dy = particle.y - mousePosition.y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < interactionRadiusSq && distanceSq > 0) {
          const distance = Math.sqrt(distanceSq);
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          particle.vx = (dx / distance) * speed;
          particle.vy = (dy / distance) * speed;
          particle.x += particle.vx * 10;
          particle.y += particle.vy * 10;
        }

        if (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height) {
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
        }
      }
    };

    const drawParticles = () => {
      context.clearRect(0, 0, width, height);
      const grid = new Map<string, Particle[]>();

      for (const particle of particles) {
        const key = `${Math.floor(particle.x / connectionDistance)}_${Math.floor(particle.y / connectionDistance)}`;
        const bucket = grid.get(key);
        if (bucket) bucket.push(particle);
        else grid.set(key, [particle]);
      }

      for (const particle of particles) {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = particleColor;
        context.shadowColor = particleColor;
        context.shadowBlur = particle.size > 2 ? 9 : 4;
        context.fill();
        context.shadowBlur = 0;

        const gridX = Math.floor(particle.x / connectionDistance);
        const gridY = Math.floor(particle.y / connectionDistance);

        for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
          for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
            const neighbors = grid.get(`${gridX + xOffset}_${gridY + yOffset}`) ?? [];
            for (const other of neighbors) {
              if (particle === other) continue;
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distanceSq = dx * dx + dy * dy;
              if (distanceSq >= connectionDistanceSq) continue;

              const distance = Math.sqrt(distanceSq);
              const alpha = (1 - distance / connectionDistance) * 0.52;
              context.beginPath();
              context.moveTo(particle.x, particle.y);
              context.lineTo(other.x, other.y);
              context.strokeStyle = `rgba(${lineRgb.red}, ${lineRgb.green}, ${lineRgb.blue}, ${alpha})`;
              context.lineWidth = 0.35;
              context.stroke();
            }
          }
        }
      }
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      mousePosition = inside
        ? { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
        : { x: -10_000, y: -10_000 };
    };

    const start = () => {
      window.cancelAnimationFrame(frameId);
      if (reducedMotion.matches) drawParticles();
      else animate();
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    resizeCanvas();
    start();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    reducedMotion.addEventListener?.("change", start);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      reducedMotion.removeEventListener?.("change", start);
    };
  }, [connectionDistance, interactionRadius, lineColor, particleColor, particleCount]);

  return (
    <div ref={containerRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
