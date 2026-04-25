"use client";

import { useEffect, ComponentType, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLoadingSpinner, AuthRedirecting } from "./utils";

/**
 * HOC to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 * 
 * Features:
 * - Checks authentication status via AuthContext
 * - Shows loading spinner during auth check
 * - Saves current path for post-login redirect
 * - Supports App Router (Next.js 13+)
 * 
 * Usage:
 * export default withAuthentication(MyProtectedPage);
 */
export function withAuthentication<P extends object>(
  Component: ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const handleRedirect = useCallback(() => {
      if (!isLoading && !isAuthenticated) {
        // Save current path for redirect after successful login
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname + window.location.search;
          sessionStorage.setItem("redirect_after_login", currentPath);
        }
        
        // Redirect to login with reason
        router.push("/admin/auth/login?reason=unauthorized");
      }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
      handleRedirect();
    }, [handleRedirect]);

    // Show loading spinner while checking authentication
    if (isLoading) {
      return <AuthLoadingSpinner />;
    }

    // Don't render anything while redirecting
    if (!isAuthenticated) {
      return <AuthRedirecting />;
    }

    // Render protected component if authenticated
    return <Component {...props} />;
  };
}

/**
 * Display name for debugging
 */
withAuthentication.displayName = "withAuthentication";
