import { Globe, Smartphone, TrendingUp, ShoppingCart, Palette, LifeBuoy, Check } from "lucide-react";
import type { Service } from "@/db/schema";

const ICONS: Record<string, typeof Globe> = {
  globe: Globe,
  smartphone: Smartphone,
  trending: TrendingUp,
  cart: ShoppingCart,
  palette: Palette,
  lifebuoy: LifeBuoy,
};

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon] ?? Globe;
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between">
        <span
          className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-lg`}
        >
          <Icon className="h-7 w-7" />
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{service.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {service.description}
      </p>
      {service.features && service.features.length > 0 && (
        <ul className="mt-4 space-y-2">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Check className="h-4 w-4 text-emerald-500" />
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
