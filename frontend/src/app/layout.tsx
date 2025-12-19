import React from "react";
import "./globals.css";
import { Toaster } from "sonner";
import TopLoadingBar from "@/components/common/TopLoadingBar";
export const metadata = {
  metadataBase: new URL(process.env.SITE_URL!),
  title: "Scam Report - Báo cáo & Tra cứu lừa đảo",
  description:
    "Công cụ báo cáo, tra cứu số điện thoại, tài khoản ngân hàng và website lừa đảo nhanh chóng, chính xác.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Scam Report",
    description: "Báo cáo và tra cứu lừa đảo hiệu quả.",
    url: "/",
    siteName: "Scam Report",
    images: [
      {
        url: "/share-img.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <TopLoadingBar />
        <Toaster position="top-right" richColors closeButton />
        <div>{children}</div>
      </body>
    </html>
  );
}
