import ReportComponent from "@/components/user/report/Main";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Báo cáo - Scam Report",
    description:
      "Trang báo cáo - Nơi báo cáo số điện thoại, email, website lừa đảo nhanh chóng và chính xác",
    keywords:
      "trang báo cáo, báo cáo lừa đảo, số điện thoại lừa đảo, email lừa đảo",
    openGraph: {
      title: "Trang báo cáo - Scam Report",
      description:
        "Trang báo cáo - Nơi báo cáo số điện thoại, email, website lừa đảo một cách nhanh chóng và chính xác",
    },
  };
}

export default function ReportPage() {
  return <ReportComponent />;
}
