"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminAuthMiddleware from "@/components/admin/AdminAuthMiddleware";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/admin/auth");

  return (
    <AuthProvider>
      {isAuthPage ? (
        // Auth pages don't need middleware or sidebar
        children
      ) : (
        // Protected admin pages
        <AdminAuthMiddleware>
          <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-4 sm:p-6 md:p-8 bg-background">
              {children}
            </main>
          </div>
        </AdminAuthMiddleware>
      )}
    </AuthProvider>
  );
}
