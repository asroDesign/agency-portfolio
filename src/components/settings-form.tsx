"use client";

import { useState } from "react";
import { Loader2, Save, Plus, Trash2, CheckCircle2, ImagePlus } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [form, setForm] = useState({
    logo_text: initial.logo_text ?? "",
    logo_image_url: initial.logo_image_url ?? "",
    footer_about: initial.footer_about ?? "",
    footer_copyright: initial.footer_copyright ?? "",
    about_title: initial.about_title ?? "",
    about_description: initial.about_description ?? "",
    about_mission: initial.about_mission ?? "",
    about_vision: initial.about_vision ?? "",
    contact_phone: initial.contact_phone ?? "",
    contact_mobile: initial.contact_mobile ?? "",
    contact_email: initial.contact_email ?? "",
    contact_address: initial.contact_address ?? "",
    social_instagram: initial.social_instagram ?? "",
    social_telegram: initial.social_telegram ?? "",
    social_linkedin: initial.social_linkedin ?? "",
    social_github: initial.social_github ?? "",
    stats_clients: initial.stats_clients ?? "",
    stats_years: initial.stats_years ?? "",
    stats_team: initial.stats_team ?? "",
  });
  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      return JSON.parse(initial.team ?? "[]");
    } catch {
      return [];
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function uploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setForm((f) => ({ ...f, logo_image_url: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  }

  function updateMember(i: number, k: keyof TeamMember, v: string) {
    setTeam((t) => t.map((m, idx) => (idx === i ? { ...m, [k]: v } : m)));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, team: JSON.stringify(team) }),
      });
      if (!res.ok) throw new Error("خطا در ذخیره");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white";

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="mt-4 space-y-4">{children}</div>
      </div>
    );
  }

  function Field({ label, value, onChange, dir, type = "text" }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; dir?: "ltr"; type?: string }) {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <input type={type} dir={dir} value={value} onChange={onChange} className={inputClass} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Section title="لوگو و هویت">
        <div>
          <Field label="متن لوگو" value={form.logo_text} onChange={set("logo_text")} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">تصویر لوگو</label>
          {form.logo_image_url ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logo_image_url} alt="لوگو" className="h-14 w-auto max-w-[10rem] rounded-lg border border-slate-200 object-contain p-1 dark:border-white/10" />
              <button type="button" onClick={() => setForm((f) => ({ ...f, logo_image_url: "" }))} className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10 dark:border-rose-500/20">حذف تصویر</button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-4 text-sm text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/15">
              {uploadingLogo ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
              {uploadingLogo ? "در حال بارگذاری..." : "بارگذاری تصویر لوگو"}
              <input type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
            </label>
          )}
          <input dir="ltr" value={form.logo_image_url} onChange={set("logo_image_url")} placeholder="یا آدرس تصویر را وارد کنید" className={`${inputClass} mt-2`} />
          <p className="mt-1 text-xs text-slate-400">در صورت وجود تصویر، به جای آیکون پیش‌فرض استفاده می‌شود.</p>
        </div>
      </Section>

      <Section title="فوتر">
        <Field label="توضیح کوتاه فوتر" value={form.footer_about} onChange={set("footer_about")} />
        <Field label="متن کپی‌رایت" value={form.footer_copyright} onChange={set("footer_copyright")} />
      </Section>

      <Section title="درباره ما">
        <Field label="عنوان اصلی" value={form.about_title} onChange={set("about_title")} />
        <Field label="توضیحات" value={form.about_description} onChange={set("about_description")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ماموریت" value={form.about_mission} onChange={set("about_mission")} />
          <Field label="چشم‌انداز" value={form.about_vision} onChange={set("about_vision")} />
        </div>
      </Section>

      <Section title="اطلاعات تماس">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="تلفن" value={form.contact_phone} onChange={set("contact_phone")} dir="ltr" />
          <Field label="موبایل" value={form.contact_mobile} onChange={set("contact_mobile")} dir="ltr" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ایمیل" value={form.contact_email} onChange={set("contact_email")} dir="ltr" />
          <Field label="آدرس" value={form.contact_address} onChange={set("contact_address")} />
        </div>
      </Section>

      <Section title="شبکه‌های اجتماعی">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اینستاگرام" value={form.social_instagram} onChange={set("social_instagram")} dir="ltr" />
          <Field label="تلگرام" value={form.social_telegram} onChange={set("social_telegram")} dir="ltr" />
          <Field label="لینکدین" value={form.social_linkedin} onChange={set("social_linkedin")} dir="ltr" />
          <Field label="گیت‌هاب" value={form.social_github} onChange={set("social_github")} dir="ltr" />
        </div>
      </Section>

      <Section title="آمار و ارقام">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="تعداد مشتری" value={form.stats_clients} onChange={set("stats_clients")} type="number" />
          <Field label="سال تجربه" value={form.stats_years} onChange={set("stats_years")} type="number" />
          <Field label="تعداد اعضا" value={form.stats_team} onChange={set("stats_team")} type="number" />
        </div>
      </Section>

      <Section title="اعضای تیم">
        <div className="space-y-3">
          {team.map((m, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-2xl border border-slate-100 p-3 dark:border-white/5 sm:flex-row sm:items-center">
              <input
                value={m.name}
                onChange={(e) => updateMember(i, "name", e.target.value)}
                placeholder="نام"
                className={inputClass}
              />
              <input
                value={m.role}
                onChange={(e) => updateMember(i, "role", e.target.value)}
                placeholder="نقش"
                className={inputClass}
              />
              <input
                value={m.initials}
                onChange={(e) => updateMember(i, "initials", e.target.value)}
                placeholder="حروف اختصاری"
                className={`${inputClass} sm:max-w-[7rem]`}
              />
              <button
                type="button"
                onClick={() => setTeam((t) => t.filter((_, idx) => idx !== i))}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-rose-200 p-2.5 text-rose-500 hover:bg-rose-500/10 dark:border-rose-500/20"
                aria-label="حذف عضو"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTeam((t) => [...t, { name: "", role: "", initials: "" }])}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-white/15 dark:text-slate-300"
          >
            <Plus className="h-4 w-4" />
            افزودن عضو
          </button>
        </div>
      </Section>

      {error && (
        <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>
      )}

      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 backdrop-blur dark:border-white/10 dark:bg-[#0b0d1a]/90">
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            ذخیره شد
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          ذخیره تغییرات
        </button>
      </div>
    </form>
  );
}
