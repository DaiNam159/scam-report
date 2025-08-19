import LoginComponent from "@/components/common/Login";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Đăng nhập - Scam Report",
    description:
      "Đăng nhập để tra cứu số điện thoại, email, website lừa đảo một cách nhanh chóng và chính xác",
    keywords:
      "đăng nhập, tra cứu lừa đảo, số điện thoại lừa đảo, email lừa đảo",
    openGraph: {
      title: "Đăng nhập - Scam Report",
      description:
        "Đăng nhập để tra cứu số điện thoại, email, website lừa đảo một cách nhanh chóng và chính xác",
    },
  };
}
export default function LoginPage() {
  return <LoginComponent />;
}
