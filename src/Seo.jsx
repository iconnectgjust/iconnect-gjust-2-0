import { useEffect } from "react";

const SITE_URL = "https://www.iconnectgjust.in";

// Updates the metadata tags that ship in index.html in place, so every route
// gets its own title/description/canonical without duplicating tags.
function setTag(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

function Seo({ title, description, path = "/", noindex = false }) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;
    setTag('meta[name="description"]', "content", description);
    setTag('link[rel="canonical"]', "href", url);
    setTag('meta[property="og:title"]', "content", title);
    setTag('meta[property="og:description"]', "content", description);
    setTag('meta[property="og:url"]', "content", url);
    setTag('meta[name="twitter:title"]', "content", title);
    setTag('meta[name="twitter:description"]', "content", description);
    setTag('meta[name="robots"]', "content", noindex ? "noindex" : "index, follow");
  }, [title, description, path, noindex]);

  return null;
}

export default Seo;
