"use client";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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

  const handleChange = (event: SelectChangeEvent) => {
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
      <FormControl dir={dir} sx={{ m: 1, minWidth: "100%" }} size="small">
        <InputLabel dir={dir} id="LanguageSelect">
          الا / لسان / ژبه / Language
        </InputLabel>
        <Select
          dir={dir}
          labelId="LanguageSelect"
          id="LanguageSelect"
          value=""
          label="الا / لسان / ژبه / Language"
          disabled
        >
          <MenuItem value="">Select One/ یکی را انتخاب کنید</MenuItem>
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl 
      dir={language === "en" ? "ltr" : "rtl"}
      sx={{ m: 1, minWidth: "100%" }} 
      size="small"
    >
      <InputLabel dir={language === "en" ? "ltr" : "rtl"} id="LanguageSelect">الا / لسان / ژبه / Language</InputLabel>
      <Select
        dir={language === "en" ? "ltr" : "rtl"}
        labelId="LanguageSelect"
        id="LanguageSelect"
        value={localLanguage}
        label="الا / لسان / ژبه / Language"
        onChange={handleChange}
      >
        <MenuItem value="nr">نورستانی (کلښه الا)</MenuItem>
        <MenuItem value="prs"> دری </MenuItem>
        <MenuItem value="ps"> پښتو </MenuItem>
        <MenuItem value="en" dir="ltr">
          English
        </MenuItem>
      </Select>
    </FormControl>
  );
}
