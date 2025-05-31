"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.isAdmin) {
      router.push("/user"); // Không phải admin → chuyển về user
      return;
    }

    axios
      .get("http://localhost:3000/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  return (
    <div>
      <div className="p-10 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Trang quản trị</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
