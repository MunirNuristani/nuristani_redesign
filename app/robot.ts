export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/_next/"],
    },
    sitemap: "https://nuristani.info/sitemap.xml",
  };
}
