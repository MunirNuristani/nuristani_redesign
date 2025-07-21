import { storage } from "@/utils/firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export async function GET() {
  try {
    // Get all file references from the nuristanPics folder
    const listResult = await listAll(ref(storage, 'nuristanPics'));

    // Get download URLs for all files
    const imageUrls = await Promise.all(
      listResult.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          path: itemRef.fullPath,
          url: downloadURL
        };
      })
    );

    return new Response(JSON.stringify(imageUrls), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    console.error("Error fetching images:", err);

    return new Response(JSON.stringify({
      error: "Failed to fetch images from storage",
      details: err instanceof Error ? err.message : String(err)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}