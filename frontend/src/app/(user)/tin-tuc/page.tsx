import NewsListComponent from "@/components/user/news/Main";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tin tức & Cảnh báo - Scam Report",
    description:
      "Cập nhật tin tức và cảnh báo lừa đảo mới nhất, thủ đoạn lừa đảo phổ biến và cách phòng tránh",
    keywords:
      "tin tức lừa đảo, cảnh báo lừa đảo, thủ đoạn lừa đảo, an toàn trực tuyến",
    openGraph: {
      title: "Tin tức & Cảnh báo - Scam Report",
      description: "Cập nhật tin tức và cảnh báo lừa đảo mới nhất",
    },
  };
}

export default function NewsPage() {
  return <NewsListComponent />;
}
