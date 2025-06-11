"use client";
import UserHeader from "@/components/user/Header";
import UserFooter from "@/components/user/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <UserHeader />
      {children}
      <UserFooter />
    </div>
  );
}
