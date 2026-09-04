import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-base-200/60 text-base-content">
      <AdminSidebar userName={session.name} />
      <div className="lg:pr-64">
        <main className="mx-auto w-full max-w-[1664px] px-4 py-8 sm:px-6 lg:px-8 xl:px-12">{children}</main>
      </div>
    </div>
  );
}
