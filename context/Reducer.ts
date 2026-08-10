
// Type definitions
export type Language = 'en' | 'prs' | 'ps' | 'nr';

export interface AppState {
  language: Language;
  isClient: boolean;
  showAlertModal: boolean;
  alertModalMessage: string;
  alertButton: string;
  isMenuOpen: boolean;
  currentPage: string;
}

export type AppAction = 
  | { type: 'LANGUAGE'; payload: Language }
  | { type: 'SET_CLIENT' }
  | { type: 'SHOWALERTMODAL'; payload: boolean }
  | { type: 'SET_ALERT_MESSAGE'; payload: string }
  | { type: 'SET_ALERT_BUTTON'; payload: string }
  | { type: 'TOGGLE_MENU' }
  | { type: 'SET_MENU'; payload: boolean }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'MULTIPLE_ASSIGNMENT'; payload: Partial<AppState> }
  | { type: 'RESET_STATE' };

// The language always mirrors the current [locale] URL segment — it is
// seeded here from the server (see ReducerWrapper's initialLocale prop),
// not read back from client storage, so the rendered UI never diverges
// from what the server already sent down.
export function createInitialState(language: Language): AppState {
  return {
    language,
    isClient: false,
    showAlertModal: false,
    alertModalMessage: "",
    alertButton: "",
    isMenuOpen: false,
    currentPage: "/",
  };
}

export const initialState: AppState = createInitialState('prs');

export const AppReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Language actions
    case "LANGUAGE": {
      // Persist as a cookie (not localStorage) so the server-side
      // middleware can read it to pick a locale for future unprefixed URLs.
      if (typeof window !== 'undefined') {
        document.cookie = `nuristani-language=${action.payload}; path=/; max-age=31536000`;
      }
      return {
        ...state,
        language: action.payload,
      };
    }

    case "SET_CLIENT": {
      return {
        ...state,
        isClient: true,
      };
    }

    // Modal actions
    case "SHOWALERTMODAL": {
      return {
        ...state,
        showAlertModal: action.payload,
      };
    }

    case "SET_ALERT_MESSAGE": {
      return {
        ...state,
        alertModalMessage: action.payload,
      };
    }

    case "SET_ALERT_BUTTON": {
      return {
        ...state,
        alertButton: action.payload,
      };
    }


    // UI actions
    case "TOGGLE_MENU": {
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };
    }

    case "SET_MENU": {
      return {
        ...state,
        isMenuOpen: action.payload,
      };
    }

    case "SET_CURRENT_PAGE": {
      return {
        ...state,
        currentPage: action.payload,
      };
    }

    // Multiple assignment action (used in contact form)
    case "MULTIPLE_ASSIGNMENT": {
      return {
        ...state,
        ...action.payload,
      };
    }

    // Reset all states
    case "RESET_STATE": {
      return {
        ...initialState,
        isClient: state.isClient, // Keep client state
        language: state.language, // Keep current language
      };
    }

    default:
      return state;
  }
};