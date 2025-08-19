import RegisterComponent from "@/components/common/Register";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Đăng ký - Scam Report",
    description:
      "Đăng ký để tra cứu số điện thoại, email, website lừa đảo một cách nhanh chóng và chính xác",
    keywords: "đăng ký, tra cứu lừa đảo, số điện thoại lừa đảo, email lừa đảo",
    openGraph: {
      title: "Đăng ký - Scam Report",
      description:
        "Đăng ký để tra cứu số điện thoại, email, website lừa đảo một cách nhanh chóng và chính xác",
    },
  };
}
export default function RegisterPage() {
  return <RegisterComponent />;
}
