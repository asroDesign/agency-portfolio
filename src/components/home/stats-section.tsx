import { BarChart3, BriefcaseBusiness, Clock3, UsersRound } from "lucide-react";
import { getSiteStats } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Container } from "@/components/ui";

export async function StatsSection() {
  const stats = await getSiteStats();
  const items = [
    { value: `${formatNumber(stats.projects)}+`, label: "پروژه موفق", icon: BriefcaseBusiness },
    { value: `${formatNumber(stats.clients)}+`, label: "مشتری راضی", icon: UsersRound },
    { value: `${formatNumber(stats.years)}+`, label: "سال تجربه", icon: Clock3 },
    { value: `${formatNumber(stats.team)}+`, label: "عضو تیم", icon: BarChart3 },
  ];

  return <section className="bg-base-200/55 pt-24"><Container><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{items.map(({ value, label, icon: Icon }) => <div key={label} className="soft-card rounded-2xl p-4 sm:p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-4 text-2xl font-black text-base-content sm:text-3xl">{value}</p><p className="mt-1 text-sm text-base-content/55">{label}</p></div>)}</div></Container></section>;
}
