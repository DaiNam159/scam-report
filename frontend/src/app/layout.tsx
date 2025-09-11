import React from "react";
import "./globals.css";
export const metadata = {
  title: "Scam Report Guard - Báo cáo & Tra cứu lừa đảo",
  description:
    "Công cụ báo cáo, tra cứu số điện thoại, tài khoản ngân hàng và website lừa đảo nhanh chóng, chính xác.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Scam Report Guard",
    description: "Báo cáo và tra cứu lừa đảo hiệu quả.",
    url: "https://scamreportguard.vercel.app",
    siteName: "Scam Report Guard",
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
        <div>{children}</div>
      </body>
    </html>
  );
}
