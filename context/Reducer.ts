
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

// Get initial language from localStorage or default to 'prs'
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('nuristani-language');
    if (saved && ['en', 'prs', 'ps', 'nr'].includes(saved)) {
      return saved as Language;
    }
  }
  return 'prs';
};

export const initialState: AppState = {
  // Language and localization
  language: getInitialLanguage(),
  isClient: false,
  
  // Modal states
  showAlertModal: false,
  alertModalMessage: "",
  alertButton: "",
  
  // UI states
  isMenuOpen: false,
  currentPage: "/",
};

export const AppReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Language actions
    case "LANGUAGE": {
      // Save to localStorage when language changes
      if (typeof window !== 'undefined') {
        localStorage.setItem('nuristani-language', action.payload);
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
        // Re-check localStorage on client initialization
        language: getInitialLanguage(),
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