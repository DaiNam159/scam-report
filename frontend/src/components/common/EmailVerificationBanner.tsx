"use client";

import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimes, FaEnvelope } from "react-icons/fa";
import { AuthService } from "@/services/AuthService";
import { toast } from "react-toastify";

export default function EmailVerificationBanner() {
  const [profile, setProfile] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const userProfile = await AuthService.getProfile();
      setProfile(userProfile.user);
      setShow(userProfile.user && !userProfile.user.emailVerified);
    } catch (error) {
      setShow(false);
    }
  };

  const handleResendEmail = async () => {
    setSending(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/email-verification/resend`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Email xác minh đã được gửi! Vui lòng kiểm tra hộp thư.");
      } else {
        toast.error("Không thể gửi email xác minh");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setSending(false);
    }
  };

  if (!show) return null;

  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-red-600">
      <div className="px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-1 gap-3">
            <FaEnvelope className="flex-shrink-0 text-xl text-white" />
            <p className="text-sm font-medium text-white">
              <span className="hidden sm:inline">
                Email của bạn chưa được xác minh.
              </span>
              <span className="sm:hidden">Chưa xác minh email.</span>
              <span className="ml-2">
                Vui lòng kiểm tra hộp thư để xác minh tài khoản.
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResendEmail}
              disabled={sending}
              className="px-4 py-2 text-sm font-semibold text-orange-600 transition-all duration-200 bg-white rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Đang gửi..." : "Gửi lại email"}
            </button>
            <button
              onClick={() => setShow(false)}
              className="text-white transition-opacity hover:opacity-80"
              aria-label="Đóng"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
