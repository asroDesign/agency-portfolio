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
  BookOpen,
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
  { href: "/admin/template-content", label: "محتوای قالب‌ها", icon: BookOpen },
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
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-white/10">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-slate-500 lg:hidden dark:text-slate-400"
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
                  ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-200 p-3 dark:border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
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
          <div className="px-4 pt-2 text-xs text-slate-400">{userName}</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-white/10 dark:bg-[#0b0d1a]/90 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"
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
          <div className="absolute inset-y-0 right-0 w-72 max-w-[85%] border-l border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0b0d1a]">
            {content}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-64 border-l border-slate-200 bg-white dark:border-white/10 dark:bg-[#0a0c18] lg:block">
        {content}
      </aside>
    </>
  );
}
