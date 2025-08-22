import DashboardAdminComponent from "@/components/admin/dashboard/Main";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Dashboard",
    description: "Trang  cáo lừa đảo từ người dùng",
  };
}
export default function DashboardPage() {
  return <DashboardAdminComponent />;
}
