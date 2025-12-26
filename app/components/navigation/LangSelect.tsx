"use client";
import * as React from "react";
import Select from "@/app/components/ui/Select";
import { useAppContext } from "@/context/AppContext";
import { Language } from "@/context/Reducer";

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LangSelect(props: Props) {
  const { setIsOpen } = props;

  const [isClient, setIsClient] = React.useState(false);
  const [dir, setDir] = React.useState("ltr");
  const [localLanguage, setLocalLanguage] = React.useState("");

  // Get context safely
  const context = useAppContext();
  const { state, dispatch } = context || {
    state: { language: "", isClient: false },
    dispatch: () => {},
  };
  const { language } = state;

  // Handle hydration
  React.useEffect(() => {
    setIsClient(true);
    // Set initial value from context once client-side
    if (language !== undefined) {
      setLocalLanguage(language);
    }
    // Update document direction based on language
    document.documentElement.setAttribute("dir", language === "en" ? "ltr" : "rtl");
    document.body.style.fontFamily =
      language === "en" ? "Noto Sans, sans-serif" : "Lateef, sans-serif";
    setDir(language === "en" ? "ltr" : "rtl");
  }, [language]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue: Language = event.target.value as Language;
    setLocalLanguage(newValue);
    setIsOpen(false);

    if (dispatch) {
      dispatch({ type: "LANGUAGE", payload: newValue });
    }
  };

  // Don't render the actual select until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full p-2" dir={dir}>
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
        value={localLanguage}
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
