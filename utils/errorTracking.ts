import { db } from "./firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Generate a session ID for tracking errors in context
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

// Get environment info
const getEnvironmentInfo = () => {
  if (typeof window === "undefined") {
    return {
      url: "",
      userAgent: "",
      viewport: { width: 0, height: 0 },
      platform: "server",
    };
  }

  return {
    url: window.location.href,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    platform: navigator.platform,
    language: navigator.language,
  };
};

// Base error tracking function
interface BaseErrorData {
  errorType: "javascript" | "react" | "api" | "network" | "custom";
  errorMessage: string;
  errorStack?: string;
  errorName?: string;
  componentStack?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  severity: "low" | "medium" | "high" | "critical";
  additionalData?: Record<string, any>;
}

export const trackError = async (data: BaseErrorData) => {
  try {
    if (typeof window === "undefined") return;

    const environmentInfo = getEnvironmentInfo();

    await addDoc(collection(db, "analytics-errors"), {
      timestamp: serverTimestamp(),
      errorType: data.errorType,
      errorMessage: data.errorMessage,
      errorStack: data.errorStack || null,
      errorName: data.errorName || "Error",
      componentStack: data.componentStack || null,
      url: data.url || environmentInfo.url,
      pathname: environmentInfo.pathname,
      method: data.method || null,
      statusCode: data.statusCode || null,
      severity: data.severity,
      additionalData: data.additionalData || {},
      userLanguage: getUserLanguage(),
      sessionId: getSessionId(),
      userAgent: environmentInfo.userAgent,
      viewport: environmentInfo.viewport,
      platform: environmentInfo.platform,
      browserLanguage: environmentInfo.language,
    });

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("🔴 Error Tracked:", {
        type: data.errorType,
        message: data.errorMessage,
        severity: data.severity,
      });
    }
  } catch (error) {
    // Fallback: log to console if error tracking fails
    console.error("Failed to track error:", error);
    console.error("Original error:", data);
  }
};

// Track JavaScript runtime errors
export const trackJavaScriptError = async (
  error: Error,
  severity: BaseErrorData["severity"] = "high",
  additionalData?: Record<string, any>
) => {
  await trackError({
    errorType: "javascript",
    errorMessage: error.message,
    errorStack: error.stack,
    errorName: error.name,
    severity,
    additionalData,
  });
};

// Track React component errors
export const trackReactError = async (
  error: Error,
  errorInfo: { componentStack?: string },
  severity: BaseErrorData["severity"] = "high"
) => {
  await trackError({
    errorType: "react",
    errorMessage: error.message,
    errorStack: error.stack,
    errorName: error.name,
    componentStack: errorInfo.componentStack,
    severity,
  });
};

// Track API/Network errors
interface ApiErrorData {
  url: string;
  method: string;
  statusCode?: number;
  errorMessage: string;
  responseData?: any;
  requestData?: any;
}

export const trackApiError = async (data: ApiErrorData) => {
  await trackError({
    errorType: "api",
    errorMessage: data.errorMessage,
    url: data.url,
    method: data.method,
    statusCode: data.statusCode,
    severity: data.statusCode && data.statusCode >= 500 ? "critical" : "medium",
    additionalData: {
      responseData: data.responseData,
      requestData: data.requestData,
    },
  });
};

// Track network errors (fetch failures, timeouts)
export const trackNetworkError = async (
  url: string,
  errorMessage: string,
  additionalData?: Record<string, any>
) => {
  await trackError({
    errorType: "network",
    errorMessage,
    url,
    severity: "high",
    additionalData,
  });
};

// Track custom application errors
export const trackCustomError = async (
  message: string,
  severity: BaseErrorData["severity"] = "medium",
  additionalData?: Record<string, any>
) => {
  await trackError({
    errorType: "custom",
    errorMessage: message,
    severity,
    additionalData,
  });
};

// Setup global error handlers
export const setupGlobalErrorTracking = () => {
  if (typeof window === "undefined") return;

  // Handle uncaught JavaScript errors
  window.addEventListener("error", (event) => {
    trackJavaScriptError(
      new Error(event.message),
      "critical",
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    );
  });

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    trackError({
      errorType: "javascript",
      errorMessage: event.reason?.message || String(event.reason),
      errorStack: event.reason?.stack,
      errorName: "UnhandledPromiseRejection",
      severity: "high",
      additionalData: {
        reason: String(event.reason),
      },
    });
  });

  // Log that error tracking is active
  if (process.env.NODE_ENV === "development") {
    console.log("✅ Global error tracking initialized");
  }
};
