import React from "react";
import SupportHeader from "@/components/support/SupportHeader";
import SupportCategories from "@/components/support/SupportCategories";
import FAQ from "@/components/support/FAQ";
import ContactForm from "@/components/support/ContactForm";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hỗ trợ - Scam Report",
    description:
      "Trang hỗ trợ Scam Report - Nơi tiếp nhận các kiến nghị, yêu cầu cần trao đổi của người dùng",
    keywords:
      "trang hỗ trợ, giải quyết thắc mắc, tra cứu lừa đảo, số điện thoại lừa đảo, email lừa đảo",
    openGraph: {
      title: "Trang hỗ trợ - Scam Report",
      description:
        "Trang hỗ trợ Scam Report - Nơi tiếp nhận các kiến nghị, yêu cầu cần trao đổi của người dùng",
    },
  };
}
export default function HoTroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] via-[#fbe9e7] to-[#e3f2fd]">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <SupportHeader />
        <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SupportCategories />
            <FAQ />
          </div>
          <div className="lg:col-span-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
