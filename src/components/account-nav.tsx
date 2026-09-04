"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, GraduationCap, Puzzle, LifeBuoy, LogOut, Globe } from "lucide-react";
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
      <div className="sticky top-20 z-30 -mx-1 mb-4 overflow-x-auto rounded-2xl border border-base-300 bg-base-100/80 p-1 shadow-sm backdrop-blur-xl lg:hidden">
        <nav className="flex min-w-max items-center gap-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium",
                  active ? "bg-primary text-primary-content shadow-sm" : "text-base-content/60 hover:bg-base-200 hover:text-base-content",
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
        <div className="soft-card rounded-3xl p-4">
          <div className="mb-3 flex items-center gap-3 border-b border-base-300 px-2 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{userName}</p>
              <p className="text-xs text-base-content/50">کاربر نکسا تک</p>
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
          <div className="mt-3 space-y-1 border-t border-base-300 pt-3">
            <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-base-content/65 hover:bg-base-200 hover:text-base-content">
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
