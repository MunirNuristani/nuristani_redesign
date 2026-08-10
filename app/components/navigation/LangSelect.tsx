"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Select from "@/app/components/ui/Select";
import { useAppContext } from "@/context/AppContext";
import { Language } from "@/context/Reducer";
import { isLocale } from "@/utils/locales";

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LangSelect(props: Props) {
  const { setIsOpen } = props;
  const router = useRouter();
  const pathname = usePathname();

  const [isClient, setIsClient] = React.useState(false);

  // Get context safely
  const context = useAppContext();
  const { state } = context || {
    state: { language: "", isClient: false },
  };
  const { language } = state;

  // Handle hydration
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale: Language = event.target.value as Language;
    setIsOpen(false);

    // Swap the locale segment of the current path and navigate there —
    // the server then re-renders with the correct lang/dir/content.
    const segments = pathname.split("/");
    if (isLocale(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/") || "/");
  };

  // Don't render the actual select until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full p-2" dir={language === "en" ? "ltr" : "rtl"}>
        <Select
          label="الا / لسان / ژبه / Language"
          value=""
          onChange={() => {}}
          fullWidth
          disabled
          options={[{ value: "", label: "Select One/ یکی را انتخاب کنید" }]}
        />
      </div>
    );
  }

  return (
    <div className="w-full p-2" dir={language === "en" ? "ltr" : "rtl"}>
      <Select
        id="LanguageSelect"
        label="الا / لسان / ژبه / Language"
        value={language}
        onChange={handleChange}
        fullWidth
        options={[
          { value: "nr", label: "نورستانی (کلښه الا)" },
          { value: "prs", label: "دری" },
          { value: "ps", label: "پښتو" },
          { value: "en", label: "English" },
        ]}
      />
    </div>
  );
}
