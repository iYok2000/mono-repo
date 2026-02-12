"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { withAuthentication } from "@/hoc";
import { useUnauthorizedHandler } from "@/hooks/useUnauthorizedHandler";

function ChangePasswordPage() {
  const { showModal, errorMessage, handleModalClose } = useUnauthorizedHandler();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword, user } = useAuth();
  const router = useRouter();

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
    }
    if (!/[A-Z]/.test(password)) {
      return "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว";
    }
    if (!/[a-z]/.test(password)) {
      return "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว";
    }
    if (!/[0-9]/.test(password)) {
      return "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      // Will be redirected to login page after successful change
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-4">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            เปลี่ยนรหัสผ่าน
          </h2>
          {user?.must_change_password && (
            <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium">คุณจำเป็นต้องเปลี่ยนรหัสผ่านก่อนใช้งานระบบ</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Current Password */}
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                รหัสผ่านปัจจุบัน
              </label>
              <input
                id="current-password"
                name="current-password"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700"
                disabled={isLoading}
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                รหัสผ่านใหม่
              </label>
              <input
                id="new-password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700"
                disabled={isLoading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                ยืนยันรหัสผ่านใหม่
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700"
                disabled={isLoading}
              />
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                ข้อกำหนดรหัสผ่าน:
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <li>• ความยาวอย่างน้อย 8 ตัวอักษร</li>
                <li>• มีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว (A-Z)</li>
                <li>• มีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว (a-z)</li>
                <li>• มีตัวเลขอย่างน้อย 1 ตัว (0-9)</li>
                <li>• มีอักขระพิเศษอย่างน้อย 1 ตัว (!@#$%^&*)</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  กำลังเปลี่ยนรหัสผ่าน...
                </div>
              ) : (
                "เปลี่ยนรหัสผ่าน"
              )}
            </button>
          </form>
        </div>
        
        {/* Unauthorized Modal */}
        <UnauthorizedModal />
      </div>
    </div>
  );
}

export default withAuthentication(ChangePasswordPage);
