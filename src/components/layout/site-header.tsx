"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn, Menu, User as UserIcon, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "خانه" }, { href: "/portfolio", label: "نمونه‌کارها" },
  { href: "/blog", label: "وبلاگ" }, { href: "/courses", label: "دوره‌ها" },
  { href: "/templates", label: "فروشگاه قالب" }, { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { fetch("/api/auth/me").then((response) => response.json()).then((data) => setUser(data.user)).finally(() => setLoaded(true)); }, []);

  return <header className="sticky top-0 z-50 border-b border-base-content/10 bg-base-100/85 backdrop-blur-xl"><Container><div className="navbar min-h-20 px-0"><div className="navbar-start"><Logo /></div><nav className="navbar-center hidden lg:flex">{links.map((link) => <Link key={link.href} href={link.href} className={cn("rounded-xl px-3 py-2 text-sm font-semibold transition-colors", pathname === link.href ? "bg-primary/10 text-primary" : "text-base-content/65 hover:bg-base-200 hover:text-base-content")}>{link.label}</Link>)}</nav><div className="navbar-end gap-2"><ThemeToggle />{loaded && (user ? <Link href="/account" className="btn btn-ghost hidden rounded-xl text-primary sm:inline-flex"><UserIcon className="h-4 w-4" />پنل کاربری</Link> : <Link href="/login" className="btn btn-ghost hidden rounded-xl text-base-content/70 sm:inline-flex"><LogIn className="h-4 w-4" />ورود</Link>)}<Link href="/order" className="btn btn-primary hidden rounded-xl px-5 sm:inline-flex">سفارش پروژه</Link><button type="button" onClick={() => setOpen((value) => !value)} className="btn btn-square btn-ghost lg:hidden" aria-label="منو">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div></div>{open && <nav className="border-t border-base-content/10 py-3 lg:hidden">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn("block rounded-xl px-4 py-3 text-sm font-semibold", pathname === link.href ? "bg-primary/10 text-primary" : "text-base-content/70 hover:bg-base-200")}>{link.label}</Link>)}<Link href="/order" onClick={() => setOpen(false)} className="btn btn-primary mt-2 w-full rounded-xl">سفارش پروژه</Link></nav>}</Container></header>;
}
