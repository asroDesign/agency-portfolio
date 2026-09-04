"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn, Menu, User as UserIcon, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "خانه" },
  { href: "/portfolio", label: "نمونه‌کارها" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/courses", label: "دوره‌ها" },
  { href: "/templates", label: "فروشگاه قالب" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const overHero = isHome && !pastHero;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => setUser(data.user))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!isHome) return;
    let frameId = 0;

    const updateHeaderSurface = () => {
      frameId = 0;
      const hero = document.querySelector<HTMLElement>("[data-header-surface='light']");
      const headerHeight = 80;
      setPastHero(!hero || hero.getBoundingClientRect().bottom <= headerHeight);
    };

    const scheduleUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateHeaderSurface);
    };

    frameId = window.requestAnimationFrame(updateHeaderSurface);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [isHome]);

  return (
    <header className={cn(
      "z-50 border-b transition-[background-color,border-color,color,box-shadow] duration-300",
      isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
      overHero
        ? "border-transparent bg-transparent text-base-content"
        : "border-base-content/10 bg-base-100/80 text-base-content backdrop-blur-lg supports-[backdrop-filter]:bg-base-100/70",
    )}>
      <Container>
        <div className="navbar min-h-18 px-0 sm:min-h-20">
          <div className="navbar-start">
            <Logo />
          </div>

          <nav className="navbar-center hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-semibold transition-colors",
                  overHero
                    ? pathname === link.href
                    ? "text-primary after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:bg-primary"
                      : "text-base-content/65 hover:text-base-content"
                    : pathname === link.href
                      ? "rounded-lg bg-primary/10 text-primary"
                      : "text-base-content/65 hover:text-base-content",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="navbar-end gap-2">
            {loaded && (user ? (
              <Link href="/account" className={cn("btn btn-ghost hidden rounded-xl sm:inline-flex", overHero ? "text-primary hover:bg-primary/10" : "text-primary")}>
                <UserIcon className="h-4 w-4" />
                پنل کاربری
              </Link>
            ) : (
              <Link href="/login" className={cn("btn btn-ghost hidden rounded-xl sm:inline-flex", overHero ? "text-base-content/65 hover:bg-primary/10 hover:text-primary" : "text-base-content/70")}>
                <LogIn className="h-4 w-4" />
                ورود
              </Link>
            ))}
            <Link href="/order" className="btn btn-primary hidden rounded-xl px-5 shadow-md shadow-primary/15 sm:inline-flex">
              شروع همکاری
            </Link>
            <button type="button" onClick={() => setOpen((value) => !value)} className={cn("btn btn-square btn-ghost lg:hidden", overHero && "text-base-content hover:bg-primary/10")} aria-label="منو">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className={cn("rounded-b-2xl border-t px-2 py-3 backdrop-blur-2xl lg:hidden", overHero ? "border-base-content/10 bg-base-100/85" : "border-base-content/10 bg-base-100/85")}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn("block rounded-xl px-4 py-3 text-sm font-semibold", pathname === link.href ? "bg-primary/10 text-primary" : "text-base-content/70 hover:bg-base-200")}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/order" onClick={() => setOpen(false)} className="btn btn-primary mt-2 w-full rounded-xl">
              شروع همکاری
            </Link>
          </nav>
        )}
      </Container>
    </header>
  );
}
