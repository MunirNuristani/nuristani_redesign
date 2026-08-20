import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getDocs(query(collection(db, "alphabet"), orderBy("order", "asc")));

    // Preserves the legacy Airtable field-name shape so existing consumers of this route don't need changes.
    const alphabet = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        Letter: data.letter || "",
        Latin: data.latin || "",
        Name: data.name || "",
        Description: data.description || "",
        recording1: data.recordingOggUrl ? [{ url: data.recordingOggUrl, filename: "", type: "", size: 0 }] : [],
        recording2: data.recordingMp3Url ? [{ url: data.recordingMp3Url, filename: "", type: "", size: 0 }] : [],
      };
    });

    return new Response(JSON.stringify(alphabet), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Error fetching alphabet:", err);
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
