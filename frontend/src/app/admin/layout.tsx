"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/me", {
        withCredentials: true, // Gửi cookie
      })
      .then((res) => {
        const user = res.data;
        if (!user.isAdmin) {
          router.push("/");
        } else {
          setLoading(false); // Cho phép render
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  return (
    <div className="p-5">
      <h2 className="mb-4 text-xl font-bold">Admin Dashboard</h2>
      {children}
    </div>
  );
}
