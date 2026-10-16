"use client";

import { useEffect, useRef } from "react";
import { Jodit } from "jodit";
import "jodit/esm/plugins/all.js";
import "jodit/es2021/jodit.fat.min.css";

/** Keep the HTML contract shared by the blog, courses and templates. */
export function RichEditorInner({ value, onChange }: {
  value: string;
  onChange: (html: string) => void;
}) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const instance = useRef<Jodit | null>(null);
  const change = useRef(onChange);
  const initial = useRef(value);

  useEffect(() => { change.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!textarea.current) return;
    const editor = Jodit.make(textarea.current, {
      language: "fa",
      direction: "rtl",
      minHeight: 360,
      toolbarAdaptive: false,
      toolbarSticky: false,
      sourceEditor: "area",
      beautifyHTML: false,
      placeholder: "متن مقاله را اینجا بنویسید…",
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      buttons: [
        "undo", "redo", "|", "paragraph", "font", "fontsize", "brush", "|",
        "bold", "italic", "underline", "strikethrough", "superscript", "subscript", "|",
        "align", "ul", "ol", "checklist", "outdent", "indent", "|",
        "table", "inlineCode", "codeBlock", "hr", "symbols", "video", "|",
        "image", "imageCaption", "link", "eraser", "source", "fullsize",
      ],
      controls: {
        inlineCode: {
          text: "کد", tooltip: "کد درون متن",
          exec: (j: Jodit) => {
            const node = j.createInside.element("code");
            node.textContent = j.s.sel?.toString() || "code";
            j.s.insertNode(node);
          },
        },
        codeBlock: {
          text: "</>", tooltip: "بلوک کد",
          exec: (j: Jodit) => {
            const pre = j.createInside.element("pre");
            pre.dir = "ltr";
            const code = j.createInside.element("code");
            code.textContent = j.s.sel?.toString() || "// code";
            pre.append(code);
            j.s.insertNode(pre);
          },
        },
        checklist: {
          text: "☑", tooltip: "فهرست کارها",
          exec: (j: Jodit) => {
            j.s.insertHTML('<ul class="todo-list"><li><label><input type="checkbox"> <span>کار جدید</span></label></li></ul><p><br></p>');
          },
        },
        imageCaption: {
          text: "زیرنویس", tooltip: "افزودن زیرنویس تصویر انتخاب‌شده",
          exec: (j: Jodit) => {
            const current = j.s.current();
            const element = current instanceof Element ? current : current?.parentElement;
            const img = element?.closest("img") || element?.closest("figure")?.querySelector("img");
            if (!img) { j.message.info("ابتدا تصویر را انتخاب کنید"); return; }
            let figure = img.closest("figure");
            if (!figure) {
              figure = j.createInside.element("figure");
              img.replaceWith(figure);
              figure.append(img);
            }
            if (!figure.querySelector("figcaption")) {
              const caption = j.createInside.element("figcaption");
              caption.textContent = "زیرنویس تصویر";
              figure.append(caption);
              j.s.setCursorIn(caption);
            }
            j.synchronizeValues();
          },
        },
      },
      uploader: {
        url: "/api/upload",
        format: "json",
        method: "POST",
        withCredentials: true,
        insertImageAsBase64URI: false,
        imagesExtensions: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
        filesVariableName: () => "file",
        prepareData: (data: FormData) => {
          // The existing API accepts one file per request. Never silently drop extras.
          if (data.getAll("file").length !== 1) throw new Error("هر بار یک تصویر بارگذاری کنید");
          const file = data.get("file");
          if (file instanceof File && file.size > 5 * 1024 * 1024) throw new Error("حداکثر حجم تصویر ۵ مگابایت است");
          return data;
        },
        isSuccess: (response: { url?: string; error?: string }) => typeof response.url === "string",
        getMessage: (response: { url?: string; error?: string }) => typeof response.error === "string" ? response.error : "خطا در بارگذاری تصویر",
        process: (response: { url?: string; error?: string }) => ({
          files: response.url ? [response.url] : [], baseurl: "", path: "", error: 0,
          msg: "", isImages: [true],
        }),
      },
    });
    instance.current = editor;
    editor.value = initial.current;
    const emit = () => change.current(editor.value);
    editor.events.on("change", emit);
    // Persist checkbox state in serialized HTML, not only the live DOM property.
    const checkboxChange = (event: Event) => {
      const input = event.target;
      if (input instanceof HTMLInputElement && input.type === "checkbox") {
        input.toggleAttribute("checked", input.checked);
        editor.synchronizeValues();
        emit();
      }
    };
    editor.editor.addEventListener("change", checkboxChange);
    return () => {
      editor.editor.removeEventListener("change", checkboxChange);
      editor.events.off("change", emit);
      editor.destruct();
      instance.current = null;
    };
  }, []);

  useEffect(() => {
    const editor = instance.current;
    if (editor && editor.value !== value) editor.value = value;
  }, [value]);

  return <div dir="rtl" className="rounded-xl border border-slate-200 bg-white text-slate-900"><textarea ref={textarea} aria-label="متن مقاله" /></div>;
}

export default RichEditorInner;
