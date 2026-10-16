"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// Editor is a client-only library; load it lazily so it never
// runs during server rendering or blocks the initial page load.
const Editor = dynamic(
  () =>
    import("@/components/rich-editor-inner").then((mod) => mod.RichEditorInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-400">
        در حال بارگذاری ویرایشگر...
      </div>
    ),
  },
);

export function RichEditor(props: ComponentProps<typeof Editor>) {
  return <Editor {...props} />;
}
