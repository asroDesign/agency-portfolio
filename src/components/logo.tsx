"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/site-config";

export function Logo({ className = "" }: { className?: string }) {
  const { logoText, logoImageUrl } = useSiteConfig();

  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      {logoImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoImageUrl}
          alt={logoText}
          className="h-10 w-auto max-w-[10rem] object-contain"
        />
      ) : (
        <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </span>
      )}
      <span className="text-xl font-extrabold tracking-tight">
        <span className="text-slate-900 dark:text-white">{logoText}</span>
      </span>
    </Link>
  );
}
