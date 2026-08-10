"use client";
import { useEffect } from "react";
import { setupGlobalErrorTracking } from "@/utils/errorTracking";
import ErrorBoundary from "@/app/components/ErrorBoundary";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    // Setup global error tracking (only runs once on mount)
    setupGlobalErrorTracking();
  }, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
