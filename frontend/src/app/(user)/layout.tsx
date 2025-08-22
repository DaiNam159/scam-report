"use client";
import UserHeader from "@/components/common/Header";
import UserFooter from "@/components/common/Footer";
import { useEffect } from "react";
import { StatsService } from "@/services/StatsService";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const trackVisit = async () => {
      await StatsService.trackVisit();
      console.log("Visit tracked successfully");
    };
    trackVisit();
  }, []);
  return (
    <div>
      <UserHeader />
      {children}
      <UserFooter />
    </div>
  );
}
