"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserHeader from "@/components/user/Header";
import UserFooter from "@/components/user/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Đánh dấu đã mount trên client

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.isAdmin) {
      router.push("/admin/dashboard");
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!mounted || !authorized) return null;

  return (
    <div>
      <UserHeader />
      {children}
      <UserFooter />
    </div>
  );
}
