import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getDocs(query(collection(db, "books"), orderBy("order", "asc")));
    const books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(books), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
