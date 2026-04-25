"use client";

import { useEffect, ComponentType, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLoadingSpinner, AuthRedirecting } from "./utils";

/**
 * HOC to protect routes that should NOT be accessible when authenticated
 * Redirects authenticated users to admin page or saved redirect path
 * 
 * Features:
 * - Prevents authenticated users from accessing login/register pages
 * - Redirects to previous page after login (if saved)
 * - Handles password change requirements
 * - Supports App Router (Next.js 13+)
 * 
 * Usage:
 * export default withoutAuthentication(LoginPage);
 */
export function withoutAuthentication<P extends object>(
  Component: ComponentType<P>
) {
  return function UnauthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    const handleRedirect = useCallback(() => {
      if (!isLoading && isAuthenticated) {
        // Check if user must change password
        if (user?.must_change_password) {
          router.push("/admin/auth/change-password");
          return;
        }

        // Try to restore previous path from session storage
        if (typeof window !== "undefined") {
          const redirectPath = sessionStorage.getItem("redirect_after_login");
          
          if (redirectPath && !redirectPath.includes("/admin/auth/")) {
            sessionStorage.removeItem("redirect_after_login");
            router.push(redirectPath);
            return;
          }
        }

        // Default redirect to admin home
        router.push("/admin/category");
      }
    }, [isLoading, isAuthenticated, user, router]);

    useEffect(() => {
      handleRedirect();
    }, [handleRedirect]);

    // Show loading spinner while checking authentication
    if (isLoading) {
      return <AuthLoadingSpinner />;
    }

    // Don't render anything while redirecting
    if (isAuthenticated) {
      return <AuthRedirecting />;
    }

    // Render public component if not authenticated
    return <Component {...props} />;
  };
}

/**
 * Display name for debugging
 */
withoutAuthentication.displayName = "withoutAuthentication";
