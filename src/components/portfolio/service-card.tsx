import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/db/schema";
import brandingImage from "@/app/uploads/branding-vec.png";
import chartImage from "@/app/uploads/chart-vec.png";
import phoneImage from "@/app/uploads/phone-vec.png";
import secureImage from "@/app/uploads/secure-vec.png";
import shopImage from "@/app/uploads/shop-vec.png";
import webImage from "@/app/uploads/web-vec.png";

const SERVICE_IMAGES = {
  "web-design": webImage,
  "app-development": phoneImage,
  seo: chartImage,
  ecommerce: shopImage,
  branding: brandingImage,
  support: secureImage,
};

export function ServiceCard({ service, wide = false }: { service: Service; wide?: boolean }) {
  const image = SERVICE_IMAGES[service.slug as keyof typeof SERVICE_IMAGES];
  return (
    <article className={`group flex flex-col overflow-hidden rounded-3xl border border-base-content/8 bg-white/80 transition-colors duration-300 hover:border-primary/25 ${wide ? "xl:col-span-2 xl:flex-row xl:items-center" : ""}`}>
      <div className={`relative w-full shrink-0 overflow-hidden ${wide ? "h-48 xl:min-h-[260px] xl:w-1/2" : "h-44 sm:h-48"}`}>
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes={wide ? "(min-width: 1280px) 420px, 100vw" : "(min-width: 1280px) 320px, 50vw"}
            unoptimized
            className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className={`flex flex-1 flex-col items-center p-5 text-center sm:p-6 ${wide ? "xl:p-8" : ""}`}>
        <h3 className="text-lg font-extrabold tracking-tight text-base-content sm:text-xl">{service.title}</h3>
        <p className="mt-3 text-sm leading-7 text-base-content/65">{service.description}</p>
        <Link href="/order" className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-secondary">
          اطلاعات بیشتر
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
