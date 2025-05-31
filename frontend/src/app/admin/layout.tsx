"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.isAdmin) {
      router.push("/user/homepage");
    }
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      {children}
    </div>
  );
}
