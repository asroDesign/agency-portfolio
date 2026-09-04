import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PortfolioForm } from "@/components/portfolio-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ویرایش نمونه‌کار" };

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold sm:text-3xl">ویرایش نمونه‌کار</h1>
      <p className="mt-1 text-sm text-slate-500">در حال ویرایش «{item.title}»</p>
      <div className="mt-6">
        <PortfolioForm initial={item} />
      </div>
    </div>
  );
}
