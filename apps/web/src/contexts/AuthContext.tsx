"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  must_change_password: boolean;
  last_login_at?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ redirectTo: string; mustChangePassword: boolean }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_GO_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

// In-memory token storage (more secure than localStorage)
let accessToken: string | null = null;

function setAccessToken(token: string) {
  accessToken = token;
  // Use sessionStorage as backup (cleared on tab close)
  if (typeof window !== 'undefined') {
    sessionStorage.setItem("access_token", token);
  }
}

function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  // Restore from sessionStorage if memory is cleared
  if (typeof window !== 'undefined') {
    accessToken = sessionStorage.getItem("access_token");
    return accessToken;
  }
  return null;
}

function clearAccessToken() {
  accessToken = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem("access_token");
    // Also clear old localStorage tokens
    localStorage.removeItem("access_token");
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Refresh authentication state
  const refreshAuth = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.user) {
          setUser(data.data.user);
        } else {
          clearAccessToken();
          setUser(null);
        }
      } else {
        // Try to refresh token
        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include", // Send httpOnly refresh cookie
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data.access_token) {
            setAccessToken(refreshData.data.access_token);
            setUser(refreshData.data.user);
          } else {
            clearAccessToken();
            setUser(null);
          }
        } else {
          clearAccessToken();
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Auth refresh error:", error);
      clearAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Login failed");
      }

      if (data.success && data.data.access_token) {
        setAccessToken(data.data.access_token);
        setUser(data.data.user);

        // Return redirect path instead of navigating here
        const mustChangePassword = !!data.data.must_change_password;
        let redirectTo = "/admin/category";

        if (mustChangePassword) {
          redirectTo = "/admin/auth/change-password";
        } else {
          // Check for saved redirect path
          const savedPath = typeof window !== 'undefined' 
            ? sessionStorage.getItem('redirect_after_login') 
            : null;
          
          if (savedPath) {
            redirectTo = savedPath;
            sessionStorage.removeItem('redirect_after_login');
          }
        }

        return { redirectTo, mustChangePassword };
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = getAccessToken();
      
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // Send httpOnly cookie
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAccessToken();
      setUser(null);
      router.push("/admin/auth/login");
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Password change failed");
      }

      // Password changed successfully, logout and redirect to login
      await logout();
    } catch (error) {
      console.error("Password change error:", error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
