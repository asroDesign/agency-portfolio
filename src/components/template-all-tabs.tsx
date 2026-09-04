"use client";

import { useState } from "react";
import {
  PlayCircle,
  FileText,
  ChevronDown,
  LifeBuoy,
  History,
  HelpCircle,
  ListChecks,
  AlignLeft,
  MonitorPlay,
  MessageCircleQuestion,
} from "lucide-react";
import type { TemplateTutorial, TemplateFaq, TemplateUpdate, TemplateQuestion } from "@/db/schema";
import { TemplateSupportForm } from "@/components/template-support";
import { AskQuestionForm } from "@/components/ask-question-form";
import { formatDate, cn } from "@/lib/utils";

type TabKey = "desc" | "features" | "demo" | "tutorial" | "faq" | "support" | "updates";

export function TemplateAllTabs({
  templateId,
  description,
  features,
  liveUrl,
  tutorials,
  faqs,
  updates,
  userQuestions,
  canSubmitSupport,
  owned,
}: {
  templateId: string;
  description: string;
  features: string[];
  liveUrl: string | null;
  tutorials: TemplateTutorial[];
  faqs: TemplateFaq[];
  updates: TemplateUpdate[];
  userQuestions: TemplateQuestion[];
  canSubmitSupport: boolean;
  owned: boolean;
}) {
  const [tab, setTab] = useState<TabKey>("desc");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const tabs: { key: TabKey; label: string; icon: typeof AlignLeft }[] = [
    { key: "desc", label: "توضیحات", icon: AlignLeft },
    { key: "features", label: "امکانات قالب", icon: ListChecks },
    { key: "demo", label: "پیش‌نمایش زنده", icon: MonitorPlay },
    { key: "tutorial", label: "آموزش", icon: PlayCircle },
    { key: "faq", label: "پرسش و پاسخ", icon: HelpCircle },
    { key: "support", label: "پشتیبانی", icon: LifeBuoy },
    { key: "updates", label: "تاریخچه بروزرسانی", icon: History },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex items-center gap-1.5 -mb-px border-b-2 px-3.5 py-3 text-sm font-semibold transition-colors",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="pt-5">
        {/* توضیحات */}
        {tab === "desc" && (
          <p className="whitespace-pre-line leading-8 text-slate-600">{description}</p>
        )}

        {/* امکانات قالب */}
        {tab === "features" && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {features.length === 0 ? (
              <p className="col-span-2 py-8 text-center text-slate-400">امکاناتی ثبت نشده است.</p>
            ) : (
              features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">✓</span>
                  {f}
                </li>
              ))
            )}
          </ul>
        )}

        {/* پیش‌نمایش زنده */}
        {tab === "demo" && (
          <div>
            {liveUrl ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <iframe src={liveUrl} title="پیش‌نمایش زنده" className="h-[480px] w-full border-0 bg-white" />
              </div>
            ) : (
              <p className="py-8 text-center text-slate-400">پیش‌نمایشی برای این قالب ثبت نشده است.</p>
            )}
          </div>
        )}

        {/* آموزش */}
        {tab === "tutorial" && (
          <div className="space-y-3">
            {tutorials.length === 0 ? (
              <p className="py-8 text-center text-slate-400">آموزشی برای این قالب ثبت نشده است.</p>
            ) : (
              tutorials.map((t) => (
                <div key={t.id} className="overflow-hidden rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === t.id ? null : t.id)}
                    className="flex w-full items-center justify-between gap-3 bg-white p-4 text-right"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {t.type === "video" ? <PlayCircle className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </span>
                      <span className="font-semibold">{t.title}</span>
                    </span>
                    <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", openAccordion === t.id && "rotate-180")} />
                  </button>
                  {openAccordion === t.id && (
                    <div className="border-t border-slate-100 p-4">
                      {t.type === "video" && t.videoUrl ? (
                        <div className="overflow-hidden rounded-xl">
                          <iframe src={toEmbedUrl(t.videoUrl)} title={t.title} className="aspect-video w-full" allowFullScreen />
                        </div>
                      ) : (
                        <div className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                          {t.content}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* پرسش و پاسخ */}
        {tab === "faq" && (
          <div className="space-y-5">
            {/* Ask question form */}
            <div className="rounded-2xl border border-primary/25/60 bg-primary/10/40 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <MessageCircleQuestion className="h-4 w-4 text-primary" />
                سوال خود را بپرسید
              </h4>
              <AskQuestionForm templateId={templateId} />
            </div>

            {/* FAQ items */}
            <div className="space-y-3">
              {faqs.length === 0 && userQuestions.filter((q) => q.answered).length === 0 ? (
                <p className="py-8 text-center text-slate-400">هنوز سوالی ثبت نشده است. اولین سوال را شما بپرسید!</p>
              ) : (
                <>
                  {faqs.map((f) => (
                    <div key={f.id} className="overflow-hidden rounded-2xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(openAccordion === f.id ? null : f.id)}
                        className="flex w-full items-center justify-between gap-3 bg-white p-4 text-right"
                      >
                        <span className="font-semibold">{f.question}</span>
                        <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform", openAccordion === f.id && "rotate-180")} />
                      </button>
                      {openAccordion === f.id && (
                        <div className="border-t border-slate-100 p-4 text-sm leading-7 text-slate-600">
                          {f.answer}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* User-submitted questions (answered) */}
                  {userQuestions.filter((q) => q.answered && q.answer).map((q) => (
                    <div key={q.id} className="overflow-hidden rounded-2xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(openAccordion === q.id ? null : q.id)}
                        className="flex w-full items-center justify-between gap-3 bg-white p-4 text-right"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{q.question}</p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {q.name} · {formatDate(q.createdAt)}
                          </p>
                        </div>
                        <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform", openAccordion === q.id && "rotate-180")} />
                      </button>
                      {openAccordion === q.id && (
                        <div className="border-t border-slate-100 p-4">
                          <div className="flex items-start gap-2">
                            <span className="mt-1 shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                              پاسخ پشتیبانی
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* پشتیبانی */}
        {tab === "support" && (
          <TemplateSupportForm templateId={templateId} canSubmit={canSubmitSupport} owned={owned} />
        )}

        {/* تاریخچه بروزرسانی */}
        {tab === "updates" && (
          <div className="space-y-4">
            {updates.length === 0 ? (
              <p className="py-8 text-center text-slate-400">بروزرسانی ثبت نشده است.</p>
            ) : (
              <div className="relative border-r-2 border-slate-200 pr-6">
                {updates.map((u) => (
                  <div key={u.id} className="relative pb-6 last:pb-0">
                    <span className="absolute -right-[31px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        نسخه {u.version}
                      </span>
                      <h4 className="font-bold">{u.title}</h4>
                      <span className="text-xs text-slate-400">{formatDate(u.releasedAt)}</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {u.changes.split("\n").filter(Boolean).map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                          {c.replace(/^- /, "")}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function toEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  const aparat = url.match(/aparat\.com\/v\/([\w-]+)/);
  if (aparat) return `https://www.aparat.com/video/video/embed/videohash/${aparat[1]}/vt/frame`;
  return url;
}
