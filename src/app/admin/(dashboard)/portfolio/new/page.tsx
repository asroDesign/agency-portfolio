import type { Metadata } from "next";
import { PortfolioForm } from "@/components/portfolio-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "نمونه‌کار جدید" };

export default function NewPortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">نمونه‌کار جدید</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">مشخصات نمونه‌کار را وارد کنید.</p>
      <div className="mt-6">
        <PortfolioForm />
      </div>
    </div>
  );
}
