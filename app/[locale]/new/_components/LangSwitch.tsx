"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { isLocale, Locale, locales } from "@/utils/locales";

const LABELS: Record<Locale, string> = {
  nr: "نورستانی",
  prs: "دری",
  ps: "پښتو",
  en: "English",
};

export default function LangSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const current = params.locale as Locale;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    if (!isLocale(next)) return;
    const segments = pathname.split("/");
    if (isLocale(segments[1])) {
      segments[1] = next;
    }
    router.push(segments.join("/") || "/");
  };

  return (
    <select
      className="lang-switch mono"
      value={current}
      onChange={handleChange}
      aria-label="Language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {LABELS[loc]}
        </option>
      ))}
    </select>
  );
}
