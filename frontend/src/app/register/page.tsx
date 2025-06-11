"use client";

import { useState } from "react";
import { ShieldAlert, Sparkles, Info } from "lucide-react";
import Link from "next/link";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Mật khẩu không khớp");
      return;
    }
    setLoading(true);
    try {
      await AuthService.register(form.email, form.password);
      alert("Đăng ký thành công, vui lòng đăng nhập");
      router.push("/login");
    } catch (err: any) {
      alert(err.message || "Đăng ký thất bại");
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
          Đăng ký tài khoản
        </h1>
        <p className="mb-6 text-sm text-center text-gray-700">
          Tham gia cộng đồng để đóng góp, nhận cảnh báo và bảo vệ bản thân khỏi
          lừa đảo công nghệ.
        </p>
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Họ tên
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
              placeholder="Nhập họ tên"
            />
          </div>
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
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-lg rounded-xl bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <div className="w-full mt-6 text-sm text-center text-gray-500">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-[#e53935] underline font-semibold">
            Đăng nhập
          </a>
        </div>
        <div className="w-full mt-2 text-sm text-center">
          <a
            href="/"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-gray-100 text-[#e53935] font-semibold shadow hover:bg-gray-200 transition"
          >
            Quay về trang chủ
          </a>
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
