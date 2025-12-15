"use client";
import UserHeader from "@/components/common/Header";
import UserFooter from "@/components/common/Footer";
import UserChatButton from "@/components/chat/UserChatButton";
import { useEffect, useState } from "react";
import { StatsService } from "@/services/StatsService";
import { AuthService } from "@/services/AuthService";
import { User } from "@/types/UserType";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const trackVisit = async () => {
      await StatsService.trackVisit();
      console.log("Visit tracked successfully");
    };
    trackVisit();

    // Get user profile
    const fetchProfile = async () => {
      try {
        const userProfile = await AuthService.getProfile();
        setProfile(userProfile.user);
      } catch (error) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <UserHeader />
      {children}
      <UserFooter />

      {/* Chat button - only show when logged in */}
      {profile && !profile.isAdmin && (
        <UserChatButton
          userId={profile.id}
          userName={profile.fullName || profile.email}
          adminId={1}
        />
      )}
    </div>
  );
}
