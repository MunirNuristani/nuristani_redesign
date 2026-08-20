import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { NextRequest } from 'next/server';
import { isArticleBlocks, blocksToHtml } from "@/utils/articleBlocks";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  try {
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const snap = await getDoc(doc(db, "articles", id));
    if (!snap.exists()) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const data = snap.data();
    const isBlocks = isArticleBlocks(data.body);
    // Block-mode articles already embed their images inline within the flattened HTML body (via
    // blocksToHtml below), so Pictures stays empty to avoid the old page showing a duplicate cover image.
    const pictures = isBlocks ? [] : ((data.pictures as string[] | undefined) || []);

    // Preserves the legacy Airtable field-name shape so ArticleDetailClient.tsx (main) doesn't need changes.
    // When body is stored as content blocks (the new editor format), flatten it to HTML here so the old
    // site keeps rendering correctly without any changes on its side.
    const article = {
      Article_Name: data.name || "",
      Article_Name_en: data.nameEn || "",
      Author_Name: data.author || "",
      Author_Name_en: data.authorEn || "",
      language: data.language || "prs",
      Article_body: isBlocks ? blocksToHtml(data.body) : (data.body || ""),
      Pictures: pictures.map((url, i) => ({ id: String(i), url })),
    };

    return new Response(JSON.stringify(article), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Error fetching article:", err);
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
