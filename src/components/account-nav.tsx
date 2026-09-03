"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, GraduationCap, Puzzle, LifeBuoy, LogOut, Globe, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/account", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/account/courses", label: "دوره‌های من", icon: GraduationCap },
  { href: "/account/templates", label: "قالب‌های من", icon: Puzzle },
  { href: "/account/tickets", label: "تیکت‌های من", icon: LifeBuoy },
];

export function AccountNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Mobile */}
      <div className="sticky top-0 z-40 mb-4 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-white/10 dark:bg-[#0b0d1a]/90 lg:hidden">
        <Logo />
        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium",
                  active ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300" : "text-slate-500 dark:text-slate-400",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-20 hidden w-64 shrink-0 self-start lg:block">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-3 flex items-center gap-3 border-b border-slate-100 px-2 pb-4 dark:border-white/5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{userName}</p>
              <p className="text-xs text-slate-400">کاربر نکسا تک</p>
            </div>
          </div>
          <nav className="space-y-1">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 dark:border-white/5">
            <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">
              <Globe className="h-5 w-5" />
              مشاهده سایت
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10"
            >
              <LogOut className="h-5 w-5" />
              خروج از حساب
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
