import UserBanner from "@/components/common/Banner";
import UserHome from "@/components/common/Home";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trang chủ - Scam Report",
    description:
      "Trang chủ Scam Report - Nơi tra cứu số điện thoại, email, website lừa đảo nhanh chóng và chính xác",
    keywords:
      "trang chủ, tra cứu lừa đảo, số điện thoại lừa đảo, email lừa đảo",
    openGraph: {
      title: "Trang chủ - Scam Report",
      description:
        "Trang chủ Scam Report - Nơi tra cứu số điện thoại, email, website lừa đảo một cách nhanh chóng và chính xác",
    },
  };
}
export default function UserHomePage() {
  return (
    <>
      <UserBanner />
      <UserHome />
    </>
  );
}
