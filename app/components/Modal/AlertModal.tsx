"use client";

import React, { useCallback, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useAppContext } from "@/context/AppContext";
import { buttonCSS } from "@/app/components/CSS/TailwindCSS";

// Types
interface AlertModalProps {
  routeTo?: (() => void) | null;
}

type LanguageCode = "en" | "prs" | "ps" | "nr";

/**
 * AlertModal Component
 * A reusable modal component for displaying alert messages with RTL/LTR support
 * 
 * @param {AlertModalProps} props - Component props
 * @param {() => void | null} props.routeTo - Optional callback function to execute when modal is closed
 */
function AlertModal({ routeTo = null }: AlertModalProps) {
  // Context and state
  const { state, dispatch } = useAppContext();
  const { showAlertModal, alertModalMessage, alertButton, language } = state;
  
  // Get current language for RTL/LTR direction
  const currentLanguage: LanguageCode = language || "prs";
  const direction = currentLanguage === "en" ? "ltr" : "rtl";

  /**
   * Hide the alert modal
   */
  const hideAlertModal = useCallback(() => {
    dispatch({ type: "SHOWALERTMODAL", payload: false });
  }, [dispatch]);

  /**
   * Handle modal action button click
   * Hides the modal and executes the optional routeTo callback
   */
  const handleActionClick = useCallback(() => {
    hideAlertModal();
    if (routeTo && typeof routeTo === "function") {
      routeTo();
    }
  }, [hideAlertModal, routeTo]);

  /**
   * Handle keyboard events (ESC key to close modal)
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape" && showAlertModal) {
      hideAlertModal();
    }
  }, [showAlertModal, hideAlertModal]);

  /**
   * Handle backdrop click to close modal
   */
  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      hideAlertModal();
    }
  }, [hideAlertModal]);

  // Add keyboard event listener
  useEffect(() => {
    if (showAlertModal) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [showAlertModal, handleKeyDown]);

  // Don't render if modal is not shown
  if (!showAlertModal) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-description"
    >
      <div
        className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-6 pt-12 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={hideAlertModal}
          aria-label="Close modal"
        >
          <AiOutlineCloseCircle className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center justify-center text-center">
          {/* Alert Message */}
          <div
            id="alert-modal-description"
            dir={direction}
            className="text-lg md:text-xl mb-6 text-gray-800 leading-relaxed"
          >
            {alertModalMessage}
          </div>

          {/* Action Button */}
          {alertButton && (
            <button
              type="button"
              className={`${buttonCSS} text-lg md:text-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={handleActionClick}
              autoFocus
            >
              {alertButton}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertModal;