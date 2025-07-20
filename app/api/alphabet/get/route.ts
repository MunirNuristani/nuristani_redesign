import { base } from "@/utils/airTable";


export async function GET() {
  // For example, fetch data from your DB here
  try {

    const data = await base("Alphabet").select({
      sort: [{ field: "No", direction: "asc" }]
    }).all();

    const alphabet = data.map(item => item.fields);
    return new Response(JSON.stringify(alphabet), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
