import { ServiceCard } from "@/components/portfolio/service-card";
import { getServices } from "@/lib/data";
import { Container, SectionHeading } from "@/components/ui";

export async function ServicesSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const services = await getServices();
  return <section id="services" className="section-shell bg-base-200/55"><Container><SectionHeading eyebrow="توانمندی‌های ما" title={title ?? "همه‌چیز برای رشد دیجیتال شما"} subtitle={subtitle ?? "از ایده‌پردازی تا اجرا و بهینه‌سازی؛ یک تیم متخصص در تمام مسیر کنار شماست."} align="center" /><div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</div></Container></section>;
}
