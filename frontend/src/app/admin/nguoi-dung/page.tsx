import UserManagementComponent from "@/components/admin/user/Main";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Quản lý người dùng | Admin Dashboard",
    description:
      "Trang quản lý người dùng - Nơi xem xét và quản lý các người dùng trong hệ thống",
  };
}
export default function UserManagementPage() {
  return <UserManagementComponent />;
}
