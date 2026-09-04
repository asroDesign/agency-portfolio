"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  ShoppingCart,
  MessagesSquare,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
  Newspaper,
  GraduationCap,
  Puzzle,
  Star,
  CreditCard,
  LayoutTemplate,
  LifeBuoy,
  Search,
  MessageCircleQuestion,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/builder", label: "صفحه‌ساز", icon: LayoutTemplate },
  { href: "/admin/portfolio", label: "نمونه‌کارها", icon: FolderKanban },
  { href: "/admin/blog", label: "وبلاگ", icon: Newspaper },
  { href: "/admin/courses", label: "دوره‌ها", icon: GraduationCap },
  { href: "/admin/templates", label: "قالب‌ها", icon: Puzzle },
  { href: "/admin/support", label: "تیکت‌های پشتیبانی", icon: LifeBuoy },
  { href: "/admin/questions", label: "سوالات کاربران", icon: MessageCircleQuestion },
  { href: "/admin/testimonials", label: "نظرات مشتریان", icon: Star },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
  { href: "/admin/payments", label: "پرداخت‌ها", icon: CreditCard },
  { href: "/admin/messages", label: "پیام‌ها", icon: MessagesSquare },
  { href: "/admin/seo", label: "سئو", icon: Search },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export function AdminSidebar({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-base-300 px-5">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-ghost btn-sm btn-square text-base-content/60 lg:hidden"
          aria-label="بستن منو"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-content shadow-md shadow-primary/15"
                  : "text-base-content/65 hover:bg-base-200 hover:text-base-content",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-base-300 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-base-content/65 transition-colors hover:bg-base-200 hover:text-base-content"
        >
          <Globe className="h-5 w-5" />
          مشاهده سایت
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
        >
          <LogOut className="h-5 w-5" />
          خروج
        </button>
        {userName && (
          <div className="px-4 pt-2 text-xs text-base-content/45">{userName}</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-base-300 bg-base-100/80 px-4 shadow-sm backdrop-blur-xl lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-ghost btn-square border border-base-300 text-base-content/70"
          aria-label="باز کردن منو"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-72 max-w-[85%] border-l border-base-300 bg-base-100 shadow-2xl">
            {content}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-64 border-l border-base-300 bg-base-100/95 shadow-xl shadow-neutral/5 backdrop-blur-xl lg:block">
        {content}
      </aside>
    </>
  );
}
