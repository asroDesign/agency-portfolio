import { SettingsForm } from "@/components/settings-form";
import { getSettingsMap } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const map = await getSettingsMap();
  const initial: Record<string, string> = {};
  for (const [k, v] of map) initial[k] = v;

  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">تنظیمات</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          مدیریت محتوای سایت، اطلاعات تماس و اعضای تیم
        </p>
      </div>
      <div className="mt-6">
        <SettingsForm initial={initial} />
      </div>
    </div>
  );
}
