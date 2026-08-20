import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { NextRequest } from 'next/server';

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
    const snap = await getDoc(doc(db, "books", id));
    if (!snap.exists()) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ id: snap.id, ...snap.data() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Error fetching book:", err);
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
