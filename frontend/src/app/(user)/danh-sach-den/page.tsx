import BlacklistComponent from "@/components/user/blacklist/Main";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Danh sách đen - Scam Report",
    description:
      "Trang danh sách đen - Thông tin được tổng hợp từ cộng đồng và các nguồn tin cậy.",
    keywords:
      "trang danh sách đen, danh sách đen lừa đảo, số điện thoại lừa đảo, email lừa đảo",
    openGraph: {
      title: "Trang danh sách đen - Scam Report",
      description:
        "Trang danh sách đen - Nơi tra cứu số điện thoại, email, website lừa đảo một cách nhanh chóng và chính xác",
    },
  };
}

export default function BlacklistPage() {
  return <BlacklistComponent />;
}
