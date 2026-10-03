import React, { useMemo } from "react";

// Tags CKEditor Classic (this project's toolbar) can emit. Everything else
// is removed. NOTE: `style` elements and svg/media/iframe stay blocked.
const BLOCKED_SELECTORS =
  "script, style, iframe, object, embed, form, button, input, textarea, select, option, link, meta, base, svg, math, audio, video, source, track, marquee, details, dialog";

const UNSAFE_URL = /^(javascript|data|vbscript):/i;
const URL_ATTRS = new Set(["href", "src", "poster", "background"]);

// The ONLY inline style we preserve. CKEditor alignment arrives as
// style="text-align: center|right|justify" (or equivalent classes, which we
// keep as-is). Everything else in `style` is dropped.
function sanitizeStyleAttr(value: string): string | null {
  const match = /(?:^|;)\s*text-align\s*:\s*(left|center|right|justify)\s*(?:;|$)/i.exec(value || "");
  return match ? `text-align: ${match[1].toLowerCase()};` : null;
}

function sanitizeHtml(unsafeHtml: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(unsafeHtml || "", "text/html");

    // Remove dangerous elements entirely
    doc.querySelectorAll(BLOCKED_SELECTORS).forEach((el) => el.remove());

    // Scrub attributes element by element
    doc.querySelectorAll("*").forEach((el: Element) => {
      const htmlEl = el as HTMLElement;
      [...htmlEl.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = (attr.value || "").trim();
        if (name.startsWith("on")) {
          htmlEl.removeAttribute(attr.name);
        } else if (name === "style") {
          const safe = sanitizeStyleAttr(value);
          if (safe) htmlEl.setAttribute("style", safe);
          else htmlEl.removeAttribute(attr.name);
        } else if (name === "srcdoc" || name === "formaction" || name === "xlink:href") {
          htmlEl.removeAttribute(attr.name);
        } else if (URL_ATTRS.has(name) && UNSAFE_URL.test(value.toLowerCase())) {
          htmlEl.removeAttribute(attr.name);
        }
      });
    });

    // Harden links: absolute http(s) links get relnoopener (no target forcing —
    // authors control navigation; CKEditor here has no target UI).
    doc.querySelectorAll('a[href]').forEach((el) => {
      const href = (el.getAttribute("href") || "").trim();
      if (/^https?:\/\//i.test(href)) {
        const rel = new Set(
          (el.getAttribute("rel") || "").split(/\s+/).filter(Boolean)
        );
        rel.add("noopener");
        rel.add("noreferrer");
        el.setAttribute("rel", [...rel].join(" "));
      }
    });

    // Responsive tables: wrap bare <table> (not already in CKEditor's
    // <figure class="table">) so wide tables scroll instead of breaking layout.
    doc.querySelectorAll("table").forEach((table) => {
      const parent = table.parentElement;
      if (parent && parent.tagName.toLowerCase() === "figure") return;
      const wrapper = doc.createElement("div");
      wrapper.setAttribute("class", "blog-table-wrapper");
      parent?.replaceChild(wrapper, table);
      wrapper.appendChild(table);
    });

    // Images: responsive + lazy by default (alt text preserved from authoring).
    doc.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    });

    return doc.body.innerHTML;
  } catch {
    return "";
  }
}

interface BlogRichContentProps {
  html: string;
  className?: string;
  label?: string;
}

/**
 * Single safe renderer for all stored CKEditor HTML (post body + sections).
 * Sanitizes once per input, scopes styling via `.blog-content`.
 */
const BlogRichContent: React.FC<BlogRichContentProps> = ({
  html,
  className = "",
  label = "Blog content",
}) => {
  const safeHtml = useMemo(() => sanitizeHtml(html), [html]);
  if (!safeHtml) return null;
  return (
    <div
      className={`blog-content ${className}`.trim()}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

export default BlogRichContent;
