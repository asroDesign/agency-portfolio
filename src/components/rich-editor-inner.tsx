"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Undo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  Code,
  Heading,
  BlockQuote,
  Link,
  AutoLink,
  List,
  TodoList,
  Alignment,
  Indent,
  IndentBlock,
  Highlight,
  Font,
  RemoveFormat,
  Image,
  ImageToolbar,
  ImageUpload,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageInsert,
  SimpleUploadAdapter,
  Table,
  TableToolbar,
  CodeBlock,
  HorizontalLine,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Autoformat,
  MediaEmbed,
  GeneralHtmlSupport,
  SourceEditing,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

// CKEditor config typing is notoriously strict; we keep a pragmatic cast here.
const editorConfig = {
  // Use a self-hosted license key, or GPL only for a GPL-compliant project.
  licenseKey: process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY,
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "fontfamily",
      "fontsize",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "superscript",
      "subscript",
      "code",
      "highlight",
      "|",
      "alignment",
      "|",
      "bulletedList",
      "numberedList",
      "todoList",
      "outdent",
      "indent",
      "|",
      "blockQuote",
      "insertTable",
      "codeBlock",
      "horizontalLine",
      "specialCharacters",
      "mediaEmbed",
      "|",
      "imageUpload",
      "insertImage",
      "link",
      "|",
      "removeFormat",
      "sourceEditing",
    ],
    shouldNotGroupWhenFull: false,
  },
  image: {
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "imageStyle:inline",
      "imageStyle:block",
      "imageStyle:side",
      "linkImage",
    ],
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableCellProperties",
      "tableProperties",
    ],
  },
  link: {
    addTargetToExternalLinks: true,
  },
  simpleUpload: {
    uploadUrl: "/api/upload",
  },
  heading: {
    options: [
      { model: "paragraph" as const, title: "متن", class: "ck-heading_paragraph" },
      { model: "heading1" as const, view: "h1" as const, title: "عنوان ۱", class: "ck-heading_heading1" },
      { model: "heading2" as const, view: "h2" as const, title: "عنوان ۲", class: "ck-heading_heading2" },
      { model: "heading3" as const, view: "h3" as const, title: "عنوان ۳", class: "ck-heading_heading3" },
      { model: "heading4" as const, view: "h4" as const, title: "عنوان ۴", class: "ck-heading_heading4" },
    ],
  },
  htmlSupport: {
    allow: [{ name: /.*/, attributes: true, classes: true, styles: true }],
  },
  language: "fa",
} as any;

export function RichEditorInner({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <div dir="rtl" className="overflow-hidden rounded-xl border border-slate-200 [&_.ck-editor__editable]:min-h-[320px]">
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={value}
        onChange={(_event, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}

export default RichEditorInner;
