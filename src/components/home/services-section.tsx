import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceCard } from "@/components/portfolio/service-card";
import { getServices } from "@/lib/data";
import { Container, SectionHeading } from "@/components/ui";

export async function ServicesSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const services = await getServices();
  return (
    <section id="services" className="section-shell">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="چه کار می‌کنیم"
              title={title ?? "راهکارهای دیجیتال برای کسب‌وکارهای مدرن"}
              subtitle={subtitle ?? "از هویت برند تا توسعه کامل محصول، راهکارهایی یکپارچه برای حضور متمایز و موفق شما در دنیای دیجیتال ارائه می‌دهیم."}
              compact
            />
          </div>
          <Link href="/contact" className="btn btn-outline md:w-fit shrink-0 rounded-xl border-base-300 px-5 hover:border-primary hover:bg-primary hover:text-primary-content">
            همه خدمات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} wide={index >= 4} />
          ))}
        </div>
      </Container>
    </section>
  );
}
