export type ArticleBlock =
  | { type: "paragraph"; content: string }
  | { type: "heading"; content: string }
  | { type: "quote"; content: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "image"; url: string; caption?: string };

export function isArticleBlocks(body: unknown): body is ArticleBlock[] {
  return Array.isArray(body);
}

/** Flattens content blocks into a single HTML string, for consumers that only render `body` as HTML (the old site). */
export function blocksToHtml(blocks: ArticleBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p>${block.content}</p>`;
        case "heading":
          return `<h2>${block.content}</h2>`;
        case "quote":
          return `<blockquote>${block.content}</blockquote>`;
        case "list": {
          const tag = block.ordered ? "ol" : "ul";
          return `<${tag}>${block.items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
        }
        case "image":
          return `<img src="${block.url}" alt="${block.caption || ""}" />${block.caption ? `<p>${block.caption}</p>` : ""}`;
        default:
          return "";
      }
    })
    .join("\n");
}

/** First image block's URL, if any — used as a fallback OG/cover image when there's no separate `pictures` array. */
export function firstBlockImageUrl(blocks: ArticleBlock[]): string | undefined {
  return blocks.find((b): b is Extract<ArticleBlock, { type: "image" }> => b.type === "image")?.url;
}
