import LookupComponent from "@/components/user/lookup/Main";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tra cứu - Scam Report",
    description:
      "Trang tra cứu - Nơi tra cứu số điện thoại, email, website lừa đảo nhanh chóng và chính xác",
    keywords:
      "trang tra cứu, tra cứu lừa đảo, số điện thoại lừa đảo, email lừa đảo",
    openGraph: {
      title: "Trang tra cứu - Scam Report",
      description:
        "Trang tra cứu - Nơi tra cứu số điện thoại, email, website lừa đảo một cách nhanh chóng và chính xác",
    },
  };
}

export default function LookupPage() {
  return <LookupComponent />;
}
