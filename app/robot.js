export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/*",
    },
    sitemap: "https://nuristani.info/sitemap.xml",
  };
}
