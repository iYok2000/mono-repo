"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to handle 401 unauthorized errors globally
 * Shows modal before redirecting to login
 */
export function useUnauthorizedHandler() {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      const message = customEvent.detail?.message || "Session หมดอายุ กรุณาเข้าสู่ระบบใหม่";
      
      setErrorMessage(message);
      setShowModal(true);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const handleModalClose = async () => {
    setShowModal(false);
    
    // Save redirect path before clearing
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      if (!currentPath.includes("/admin/auth/")) {
        sessionStorage.setItem("redirect_after_login", currentPath);
      }
    }
    
    // Use AuthContext logout to properly clear everything
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear tokens even if logout API fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("access_token");
      }
    }
    
    // Redirect to login
    router.push("/admin/auth/login?reason=session_expired");
  };

  return {
    showModal,
    errorMessage: errorMessage,
    handleModalClose,
  };
}
