import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getDocs(query(collection(db, "articles"), orderBy("order", "asc")));
    const articles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
