import DOMPurify from "isomorphic-dompurify";

/**
 * Renders admin-authored rich HTML content (CKEditor output) safely.
 * The content is sanitized server-side to strip any dangerous markup.
 */
export function HtmlContent({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "rel"],
  });

  return (
    <div
      className="blog-content"
      dir="rtl"
      // The HTML is sanitized above with DOMPurify before being injected.
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
