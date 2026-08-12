import { base } from "@/utils/airTable";
import AlphabetClient, { AlphabetLetter } from "./AlphabetClient";

export const revalidate = 3600;

async function getAlphabet(): Promise<AlphabetLetter[]> {
  const data = await base("Alphabet")
    .select({ sort: [{ field: "No", direction: "asc" }] })
    .all();
  return data.map((item) => ({
    letter: (item.fields.Letter as string) || "",
    latin: (item.fields.Latin as string) || "",
    name: (item.fields.Name as string) || "",
    description: (item.fields.Description as string) || "",
  }));
}

export default async function NewAlphabetPage() {
  const letters = await getAlphabet();
  return <AlphabetClient letters={letters} />;
}
