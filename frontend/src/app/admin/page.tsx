"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminPage() {
  const router = useRouter();

  return (
    <div>
      <div className="max-w-md p-10 mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Trang quản trị</h1>
        <button
          onClick={async () => {
            await axios.post("http://localhost:5000/auth/logout", null, {
              withCredentials: true,
            });
            router.push("/login");
          }}
          className="px-4 py-2 text-white bg-red-500 rounded"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
