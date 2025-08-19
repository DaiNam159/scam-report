import AdminReportComponent from "@/components/admin/report/Main";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Quản lý báo cáo | Admin Dashboard",
    description:
      "Trang quản lý báo cáo - Nơi xem xét và quản lý các báo cáo lừa đảo từ người dùng",
  };
}
export default function ReportPage() {
  return <AdminReportComponent />;
}
