"use client";
import UserHeader from "@/components/common/Header";
import UserFooter from "@/components/common/Footer";

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
