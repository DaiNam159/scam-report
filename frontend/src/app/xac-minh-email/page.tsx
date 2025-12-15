"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token xác minh không hợp lệ");
      return;
    }

    verifyEmail(token);
  }, [token]);

  // Countdown timer when verification is successful
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      window.location.href = "/";
    }
  }, [status, countdown]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/email-verification/verify?token=${token}`,
        {
          method: "GET",
          credentials: "include", // Important: Include cookies for auto-login
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Email đã được xác minh thành công!");
        setCountdown(3); // Start countdown
      } else {
        setStatus("error");
        setMessage(
          data.message ||
            "Không thể xác minh email. Vui lòng thử lại hoặc liên hệ hỗ trợ."
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-2xl">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center mb-6">
                <FaSpinner className="text-6xl text-red-600 animate-spin" />
              </div>
              <h1 className="mb-3 text-2xl font-bold text-gray-900">
                Đang xác minh email...
              </h1>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-50">
                  <FaCheckCircle className="text-6xl text-green-500" />
                </div>
              </div>
              <h1 className="mb-3 text-2xl font-bold text-gray-900">
                Xác minh thành công!
              </h1>
              <p className="mb-6 text-gray-600">{message}</p>
              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-xl">
                <p className="text-sm text-green-800">
                  Bạn sẽ được tự động đăng nhập và chuyển về trang chủ sau{" "}
                  <span className="text-lg font-bold text-green-900">
                    {countdown}
                  </span>{" "}
                  giây...
                </p>
              </div>
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
                className="inline-block px-6 py-3 mt-6 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:-translate-y-0.5"
              >
                Về trang chủ ngay
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-50">
                  <FaTimesCircle className="text-6xl text-red-500" />
                </div>
              </div>
              <h1 className="mb-3 text-2xl font-bold text-gray-900">
                Xác minh thất bại
              </h1>
              <p className="mb-6 text-gray-600">{message}</p>
              <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-xl">
                <h3 className="mb-2 font-semibold text-red-900">
                  Các nguyên nhân có thể:
                </h3>
                <ul className="space-y-1 text-sm text-left text-red-800">
                  <li>• Link xác minh đã hết hạn (24 giờ)</li>
                  <li>• Link đã được sử dụng trước đó</li>
                  <li>• Link không hợp lệ hoặc bị thay đổi</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="inline-block px-6 py-3 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Về trang chủ
                </Link>
                <Link
                  href="/lien-he"
                  className="inline-block px-6 py-3 font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50"
                >
                  Liên hệ hỗ trợ
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
