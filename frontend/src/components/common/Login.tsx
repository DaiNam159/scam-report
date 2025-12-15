"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Info } from "lucide-react";
import Link from "next/link";
import { AuthService } from "@/services/AuthService";
import { toast } from "sonner";

export default function LoginComponent() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("mmb1: ", form);
      await AuthService.login(form.email, form.password);
      const profile = await AuthService.getProfile(); // lấy thông tin người dùng
      const userProfie = profile.user;
      if (userProfie.isBanned) {
        toast.error("Tài khoản của bạn đã bị khóa.");
        setLoading(false);
        return;
      } else if (userProfie.isAdmin) {
        router.push("/admin/dashboard");
        toast.success("Đăng nhập thành công");
      } else {
        router.push("/");
        toast.success("Đăng nhập thành công");
      }
    } catch (err) {
      toast.error("Sai email hoặc mật khẩu");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-10 bg-gradient-to-br from-[#fff8e1] via-[#fbe9e7] to-[#e3f2fd]">
      <div className="relative flex flex-col items-center w-full max-w-md p-8 mx-auto overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-3xl">
        <div className="absolute pointer-events-none -top-8 -right-8 opacity-10">
          <ShieldAlert className="w-32 h-32 text-[#e53935]" />
        </div>
        <div className="w-20 h-20 text-[#fbc02d] mb-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.webp" alt="Logo" className="w-20" />
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-[#e53935] tracking-tight drop-shadow">
          Đăng nhập
        </h1>
        <p className="mb-6 text-sm text-center text-gray-700">
          Đăng nhập để sử dụng các tính năng nâng cao và đóng góp cho cộng đồng
          Scam Report.
        </p>
        <form className="w-full space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-lg rounded-xl bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <div className="w-full mt-6 text-sm text-center text-gray-500">
          Chưa có tài khoản?{" "}
          <a href="/dang-ky" className="text-[#e53935] underline font-semibold">
            Đăng ký ngay
          </a>
        </div>
        <div className="w-full mt-2 text-sm text-center">
          <Link
            href="/"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-gray-100 text-[#e53935] font-semibold shadow hover:bg-gray-200 transition"
          >
            Quay về trang chủ
          </Link>
        </div>
        <div className="flex items-center justify-center w-full gap-2 mt-4 text-xs text-center text-gray-400">
          <Info className="w-4 h-4" />
          Mọi thông tin được bảo mật theo chính sách của Scam Report.
        </div>
        <div className="w-full mt-2 text-xs text-center text-gray-400">
          Cần hỗ trợ? Liên hệ:{" "}
          <a
            href="mailto:support@scamreport.vn"
            className="text-[#e53935] underline"
          >
            support@scamreport.vn
          </a>
        </div>
      </div>
    </div>
  );
}
