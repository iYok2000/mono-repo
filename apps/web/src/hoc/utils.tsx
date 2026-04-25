"use client";

import { ComponentType } from "react";

/**
 * Loading spinner component for authentication checks
 * Used by HOCs while verifying auth state
 */
export function AuthLoadingSpinner({ message = "กำลังตรวจสอบสิทธิ์..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        {/* Animated spinner with pulse effect */}
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="absolute top-0 left-0 animate-ping rounded-full h-12 w-12 border border-primary opacity-20"></div>
        </div>
        
        {/* Loading text */}
        <div>
          <p className="text-muted-foreground font-medium">{message}</p>
          <p className="text-sm text-muted-foreground/70 mt-1">โปรดรอสักครู่</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Redirecting component shown during navigation
 * Used by HOCs when redirecting to another page
 */
export function AuthRedirecting({ message = "กำลังเปลี่ยนหน้า..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/**
 * Type for HOC configuration
 */
export interface AuthHOCConfig {
  /**
   * Redirect path after successful login
   * @default "/admin/category"
   */
  defaultRedirectPath?: string;
  
  /**
   * Custom loading component
   */
  loadingComponent?: ComponentType;
  
  /**
   * Custom redirecting component
   */
  redirectingComponent?: ComponentType;
  
  /**
   * Whether to show loading spinner
   * @default true
   */
  showLoading?: boolean;
}

/**
 * Helper to save redirect path
 */
export function saveRedirectPath(path?: string) {
  if (typeof window === "undefined") return;
  
  const pathToSave = path || window.location.pathname + window.location.search;
  sessionStorage.setItem("redirect_after_login", pathToSave);
}

/**
 * Helper to get and clear redirect path
 */
export function getAndClearRedirectPath(): string | null {
  if (typeof window === "undefined") return null;
  
  const path = sessionStorage.getItem("redirect_after_login");
  if (path) {
    sessionStorage.removeItem("redirect_after_login");
  }
  return path;
}

/**
 * Helper to check if path is auth-related
 */
export function isAuthPath(path: string): boolean {
  return path.includes("/admin/auth/") || path.includes("/login") || path.includes("/register");
}
