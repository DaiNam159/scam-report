import ProfileComponent from "@/components/profile/ProfileComponent";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Thông tin cá nhân - Scam Report",
    description: "Xem và cập nhật thông tin cá nhân của bạn trên Scam Report",
    keywords: "thông tin cá nhân, cập nhật thông tin, Scam Report",
    openGraph: {
      title: "Thông tin cá nhân - Scam Report",
      description: "Xem và cập nhật thông tin cá nhân của bạn trên Scam Report",
    },
  };
}
export default function ProfilePage() {
  return <ProfileComponent />;
}
