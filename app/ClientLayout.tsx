"use client";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { setupGlobalErrorTracking } from "@/utils/errorTracking";
import ErrorBoundary from "./components/ErrorBoundary";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { state } = useAppContext();
  const { language } = state;

  useEffect(() => {
    // Setup global error tracking (only runs once on mount)
    setupGlobalErrorTracking();
  }, []);

  useEffect(() => {
    // Update document language attribute based on global state
    const htmlElement = document.documentElement;
    
    // Map language codes to proper HTML lang attributes
    const langMap: Record<string, string> = {
      'en': 'en',
      'prs': 'fa-AF', // Persian/Dari in Afghanistan
      'ps': 'ps',     // Pashto
      'nr': 'nur'     // Nuristani (custom code)
    };

    const htmlLang = langMap[language] || 'en';
    htmlElement.setAttribute('lang', htmlLang);

    // Set dir attribute for RTL languages
    const rtlLanguages = ['prs', 'ps', 'nr'];
    const dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
    htmlElement.setAttribute('dir', dir);

    // Add structured data dynamically
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Mirza Taza Gul Khan Cultural Foundation",
      alternateName: "Nuristani Cultural Foundation",
      url: "https://nuristani.info",
      logo: "https://nuristani.info/logo_original.png",
      description: "Cultural foundation dedicated to preserving Nuristani language, heritage, and traditions of Nuristan, Afghanistan",
      foundingDate: "2020",
      inLanguage: htmlLang,
      sameAs: [
        "https://facebook.com/nuristani.info",
        "https://twitter.com/nuristani_info"
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "AF",
        addressRegion: "Nuristan"
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "General Inquiry",
        url: "https://nuristani.info/Contact"
      }
    };

    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Update meta description based on language
    const descriptionMap: Record<string, string> = {
      'en': 'Preserving Nuristani language, culture, and heritage. Learn about Nuristan, Afghanistan through our comprehensive resources.',
      'prs': 'حفظ زبان، فرهنگ و میراث نورستانی. در مورد نورستان، افغانستان از طریق منابع جامع ما بیاموزید.',
      'ps': 'د نورستانی ژبې، کلتور او میراث ساتل. زموږ د جامع سرچینو له لارې د افغانستان د نورستان په اړه زده کړه.',
      'nr': 'نورستانی کلشه الا، کلتور او میراث ساتل'
    };

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionMap[language] || descriptionMap['en']);
    }

  }, [language]);

  return <ErrorBoundary>{children}</ErrorBoundary>;
}