import { db } from "./firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Generate a session ID for tracking user sessions
const getSessionId = (): string => {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("analytics-session-id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics-session-id", sessionId);
  }
  return sessionId;
};

// Get user language preference
const getUserLanguage = (): string => {
  if (typeof window === "undefined") return "unknown";
  return localStorage.getItem("nuristani-language") || "prs";
};

// Track page visits
export const trackPageVisit = async (pageName: string) => {
  try {
    if (typeof window === "undefined") return;

    await addDoc(collection(db, "analytics-page-visits"), {
      timestamp: serverTimestamp(),
      page: pageName,
      referrer: document.referrer || "direct",
      userAgent: navigator.userAgent,
      userLanguage: getUserLanguage(),
      sessionId: getSessionId(),
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  } catch (error) {
    console.error("Error tracking page visit:", error);
  }
};

// Track dictionary searches
interface SearchTrackingData {
  searchQuery: string;
  dictionaryType: "dariToNuristani" | "nuristaniToPashtoDari";
  resultsFound: boolean;
  exactMatchCount: number;
  similarMatchCount: number;
}

export const trackDictionarySearch = async (data: SearchTrackingData) => {
  try {
    if (typeof window === "undefined") return;

    await addDoc(collection(db, "analytics-dictionary-searches"), {
      timestamp: serverTimestamp(),
      searchQuery: data.searchQuery,
      dictionaryType: data.dictionaryType,
      resultsFound: data.resultsFound,
      exactMatchCount: data.exactMatchCount,
      similarMatchCount: data.similarMatchCount,
      userLanguage: getUserLanguage(),
      sessionId: getSessionId(),
    });
  } catch (error) {
    console.error("Error tracking dictionary search:", error);
  }
};

// Track button clicks
interface ButtonClickData {
  buttonType:
    | "dictionary-tab-switch"
    | "search-button"
    | "suggestion-click"
    | "similar-word-click"
    | "clear-search"
    | "new-search";
  buttonLabel?: string;
  dictionaryType?: "dariToNuristani" | "nuristaniToPashtoDari";
  additionalData?: Record<string, any>;
}

export const trackButtonClick = async (data: ButtonClickData) => {
  try {
    if (typeof window === "undefined") return;

    await addDoc(collection(db, "analytics-button-clicks"), {
      timestamp: serverTimestamp(),
      buttonType: data.buttonType,
      buttonLabel: data.buttonLabel || "",
      dictionaryType: data.dictionaryType || null,
      additionalData: data.additionalData || {},
      userLanguage: getUserLanguage(),
      sessionId: getSessionId(),
      page: window.location.pathname,
    });
  } catch (error) {
    console.error("Error tracking button click:", error);
  }
};

// Track autocomplete interactions
interface AutocompleteTrackingData {
  searchQuery: string;
  suggestionSelected: string;
  suggestionPosition: number; // 0-4 (which suggestion was clicked)
  dictionaryType: "dariToNuristani" | "nuristaniToPashtoDari";
}

export const trackAutocompleteSelection = async (data: AutocompleteTrackingData) => {
  try {
    if (typeof window === "undefined") return;

    await addDoc(collection(db, "analytics-autocomplete"), {
      timestamp: serverTimestamp(),
      searchQuery: data.searchQuery,
      suggestionSelected: data.suggestionSelected,
      suggestionPosition: data.suggestionPosition,
      dictionaryType: data.dictionaryType,
      userLanguage: getUserLanguage(),
      sessionId: getSessionId(),
    });
  } catch (error) {
    console.error("Error tracking autocomplete selection:", error);
  }
};

// Track user sessions (call this on app mount)
export const trackSession = async () => {
  try {
    if (typeof window === "undefined") return;

    const sessionId = getSessionId();
    const existingSession = sessionStorage.getItem(`session-tracked-${sessionId}`);

    if (!existingSession) {
      await addDoc(collection(db, "analytics-sessions"), {
        timestamp: serverTimestamp(),
        sessionId: sessionId,
        userLanguage: getUserLanguage(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || "direct",
        landingPage: window.location.pathname,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });

      sessionStorage.setItem(`session-tracked-${sessionId}`, "true");
    }
  } catch (error) {
    console.error("Error tracking session:", error);
  }
};

// Track dictionary tab switches
interface TabSwitchData {
  fromDictionary: "dariToNuristani" | "nuristaniToPashtoDari";
  toDictionary: "dariToNuristani" | "nuristaniToPashtoDari";
}

export const trackDictionaryTabSwitch = async (data: TabSwitchData) => {
  try {
    if (typeof window === "undefined") return;

    await addDoc(collection(db, "analytics-dictionary-switches"), {
      timestamp: serverTimestamp(),
      fromDictionary: data.fromDictionary,
      toDictionary: data.toDictionary,
      userLanguage: getUserLanguage(),
      sessionId: getSessionId(),
    });
  } catch (error) {
    console.error("Error tracking dictionary tab switch:", error);
  }
};
