"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { buttonCSS } from "@/app/components/CSS/TailwindCSS";
import { useAppContext } from "@/context/AppContext";
import { createMessage, validateMessageData, type MessageRecord } from "@/utils/airTable";
import AlertModal from "@/app/components/Modal/AlertModal";
import { LoadingSpinner } from "@/app/components/GlobalLoading";
import { phrases } from "@/utils/i18n";

// Types extending AirTable MessageRecord
interface FormData extends MessageRecord {
  Name: string;
  Email: string;
  Message: string;
}

interface ValidationState {
  name: boolean;
  email: boolean;
  msg: boolean;
}

type LanguageCode = "en" | "prs" | "ps" | "nr";

/**
 * Contact Page Component
 * Renders a contact form with multilingual support and RTL/LTR direction handling
 */
function Contacts() {
  // Extract localized phrases from i18n
  const {
    contactUs,
    name,
    email,
    message,
    contactMsgSalutation,
    contactMsgDetails,
    contactMsgClosing,
    send,
    cancel,
    letterCount,
    msgSentSuccess,
    msgSentFailure,
    nameValidation,
    emailValidation,
    messageValidation,
  } = phrases;

  // Hooks
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { language } = state;
  const [isPending, startTransition] = useTransition();

  // State management
  const [formData, setFormData] = useState<FormData>({
    Name: "",
    Email: "",
    Message: ""
  });
  
  const [validation, setValidation] = useState<ValidationState>({
    name: false,
    email: false,
    msg: false,
  });
  
  const [isClient, setIsClient] = useState(false);
  
  // Get current language (fallback to context if localStorage unavailable)
  const currentLanguage: LanguageCode = language || "prs";
  const direction = currentLanguage === "en" ? "ltr" : "rtl";

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Navigate to home page
   */
  const routeHome = () => {
    router.push("/");
  };

  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle form field changes with validation
   */
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    switch (field) {
      case "Name":
        setValidation(prev => ({ ...prev, name: value.trim().length > 0 }));
        break;
      case "Email":
        setValidation(prev => ({ ...prev, email: isValidEmail(value) }));
        break;
      case "Message":
        setValidation(prev => ({ ...prev, msg: value.length >= 100 }));
        break;
    }
  };

  /**
   * Handle form submission using useTransition with enhanced validation
   */
  const handleSubmit = () => {
    // Validate all fields before submission
    const isFormValid = validation.name && validation.email && validation.msg;
    
    if (!isFormValid) {
      console.warn("Form validation failed");
      return;
    }

    // Additional validation using AirTable utility
    if (!validateMessageData(formData)) {
      console.warn("AirTable validation failed");
      dispatch({
        type: "MULTIPLE_ASSIGNMENT",
        payload: {
          showAlertModal: true,
          alertModalMessage: "Please check your form data and try again.",
          alertButton: "OK",
        },
      });
      return;
    }

    startTransition(async () => {
      try {
        // Use the new createMessage utility
        await createMessage(formData);
        
        // Success: Show success message and reset form
        dispatch({
          type: "MULTIPLE_ASSIGNMENT",
          payload: {
            showAlertModal: true,
            alertModalMessage: msgSentSuccess[currentLanguage],
            alertButton: "OK",
          },
        });
        
        // Reset form data
        setFormData({ Name: "", Email: "", Message: "" });
        setValidation({ name: false, email: false, msg: false });
        
      } catch (error) {
        console.error("Error submitting contact form:", error);
        
        // Enhanced error handling with specific messages
        let errorMessage = msgSentFailure[currentLanguage];
        
        if (error instanceof Error) {
          if (error.message.includes('authentication')) {
            errorMessage = "Authentication error. Please try again later.";
          } else if (error.message.includes('Rate limited')) {
            errorMessage = "Too many requests. Please try again later.";
          } else if (error.message.includes('not found')) {
            errorMessage = "Service temporarily unavailable. Please try again later.";
          }
        }
        
        dispatch({
          type: "MULTIPLE_ASSIGNMENT",
          payload: {
            showAlertModal: true,
            alertModalMessage: errorMessage,
            alertButton: "OK",
          },
        });
      }
    });
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    startTransition(() => {
      router.push("/");
    });
  };

  // Don't render until client-side to prevent hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm rounded-xl">
          <LoadingSpinner size="lg" />
        </div>
      )}
      
      <div
          dir={direction}
          className="container mt-10 md:mt-[120px] sm:mt-[20px] flex flex-col justify-center mx-auto backdrop-blur-sm bg-white/90 drop-shadow-xl sm:px-8 px-16 py-5 mb-16 rounded-xl xl:max-w-[1200px] lg:max-w-[900px] md:max-w-[700px] sm:max-w-[360px] text-xl"
        >
          {/* Page Title */}
          <h2 className="text-3xl text-center mb-6">
            {contactUs[currentLanguage]}
          </h2>
          
          {/* Contact Information */}
          <div className="text-justify mb-6">
            <p className="mb-4">{contactMsgSalutation[currentLanguage]}</p>
            <p className="mb-4">{contactMsgDetails[currentLanguage]}</p>
            <p 
              dangerouslySetInnerHTML={{ __html: contactMsgClosing[currentLanguage] }}
              className="mb-4"
            />
          </div>

          {/* Contact Form */}
          <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            
            {/* Name Field */}
            <div className="flex flex-col my-4">
              <label htmlFor="name" className="mb-2 font-medium">
                {name[currentLanguage]}:
              </label>
              <input
                id="name"
                type="text"
                placeholder={name[currentLanguage]}
                name="name"
                required
                className={`rounded-lg px-4 py-2 border ${
                  !validation.name && formData.Name.length > 0 
                    ? "border-red-600 border-2" 
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.Name}
                onChange={(e) => handleFieldChange("Name", e.target.value)}
              />
              {!validation.name && formData.Name.length > 0 && (
                <p className="text-red-600 text-sm mt-1">
                  {nameValidation[currentLanguage]}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col my-4">
              <label htmlFor="email" className="mb-2 font-medium">
                {email[currentLanguage]}:
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                name="email"
                required
                className={`rounded-lg px-4 py-2 border ${
                  !validation.email && formData.Email.length > 0 
                    ? "border-red-600 border-2" 
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.Email}
                onChange={(e) => handleFieldChange("Email", e.target.value)}
              />
              {!validation.email && formData.Email.length > 0 && (
                <p className="text-red-600 text-sm mt-1">
                  {emailValidation[currentLanguage]}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="flex flex-col my-4">
              <label htmlFor="message" className="mb-2 font-medium">
                {message[currentLanguage]}:
              </label>
              <textarea
                id="message"
                placeholder={message[currentLanguage]}
                rows={5}
                name="message"
                required
                className={`rounded-lg px-4 py-2 border ${
                  !validation.msg && formData.Message.length > 0 
                    ? "border-red-600 border-2" 
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical`}
                value={formData.Message}
                onChange={(e) => handleFieldChange("Message", e.target.value)}
              />
              
              {/* Character count and validation */}
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-600">
                  {letterCount[currentLanguage]}: {formData.Message.length}
                </span>
                {!validation.msg && formData.Message.length > 0 && (
                  <span className="text-red-600">
                    {messageValidation[currentLanguage]}
                  </span>
                )}
              </div>
            </div>
          </form>

          {/* Form Actions */}
          <div className="flex flex-row justify-center gap-4 my-6">
            <button
              type="button"
              className={`${buttonCSS} disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed flex items-center gap-2`}
              disabled={!validation.name || !validation.email || !validation.msg || isPending}
              onClick={handleSubmit}
              aria-label={`${send[currentLanguage]} contact form`}
            >
              {isPending && <LoadingSpinner size="sm" />}
              {send[currentLanguage]}
            </button>
            
            <button
              type="button"
              className={`${buttonCSS} disabled:opacity-50`}
              disabled={isPending}
              onClick={handleCancel}
              aria-label={`${cancel[currentLanguage]} and return to home`}
            >
              {cancel[currentLanguage]}
            </button>
          </div>
          
          <AlertModal routeTo={routeHome} />
      </div>
    </div>
  );
}

export default Contacts;