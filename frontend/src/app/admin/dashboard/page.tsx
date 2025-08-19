import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Dashboard",
    description:
      "Dashboard - Nơi quản lý và theo dõi các hoạt động của người dùng",
  };
}
export default function DashboardAdminPage() {
  return (
    <>
      <h1>Trang dashboard admin</h1>
    </>
  );
}
