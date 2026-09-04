"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// CKEditor is a heavy client-only library; load it lazily so it never
// runs during server rendering or blocks the initial page load.
const CKEditor = dynamic(
  () =>
    import("@/components/rich-editor-inner").then((mod) => mod.RichEditorInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-400 dark:border-white/10 dark:bg-white/5">
        در حال بارگذاری ویرایشگر...
      </div>
    ),
  },
);

export function RichEditor(props: ComponentProps<typeof CKEditor>) {
  return <CKEditor {...props} />;
}
