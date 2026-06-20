import { useEffect } from "react";

const SITE = "Tixwav";
const BASE = "https://tixwav.vercel.app";

function upsertMeta(attr, key, content) {
  if (content == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Per-page SEO. Sets the document title, meta description, canonical URL and the
 * Open Graph / Twitter tags for the current route. Plain DOM (no dependency) —
 * Google renders the SPA, so these client-set tags are picked up by crawlers.
 *
 * Props: title, description, path (e.g. "/discover"), image (absolute or /path).
 */
export default function Seo({ title, description, path = "", image }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} · ${SITE}`
      : `${SITE} — Discover & Book Tickets for Events in Nigeria`;
    const url = `${BASE}${path}`;
    const img = image
      ? image.startsWith("http")
        ? image
        : `${BASE}${image}`
      : `${BASE}/Card.png`;

    document.title = fullTitle;
    if (description) upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", fullTitle);
    if (description) upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("name", "twitter:title", fullTitle);
    if (description) upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);
    upsertCanonical(url);
  }, [title, description, path, image]);

  return null;
}
