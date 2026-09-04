import { Globe, Smartphone, TrendingUp, ShoppingCart, Palette, LifeBuoy, Check } from "lucide-react";
import type { Service } from "@/db/schema";

const ICONS: Record<string, typeof Globe> = { globe: Globe, smartphone: Smartphone, trending: TrendingUp, cart: ShoppingCart, palette: Palette, lifebuoy: LifeBuoy };

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon] ?? Globe;
  return <article className="card soft-card group rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"><div className="card-body p-6"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20"><Icon className="h-7 w-7" /></span><h3 className="card-title mt-4 text-lg">{service.title}</h3><p className="text-sm leading-7 text-base-content/65">{service.description}</p>{service.features && service.features.length > 0 && <ul className="mt-2 space-y-2">{service.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-base-content/70"><Check className="h-4 w-4 text-success" />{feature}</li>)}</ul>}</div></article>;
}
