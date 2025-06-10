"use client";
import ReportForm from "@/components/user/report/ReportForm";
import type { ReportType } from "@/types/ReportType";
import { useState } from "react";

const REPORT_TYPES: ReportType[] = [
  "email_content",
  "email_address",
  "sms",
  "phone_number",
  "person",
  "website",
  "social_profile",
];

export default function UserHomePage() {
  const [typeReport, setTypeReport] = useState<ReportType>("email_content");

  const handleTypeChange = (type: ReportType) => {
    setTypeReport(type);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-10 bg-gray-100">
      <div className="flex flex-col items-center w-full max-w-2xl p-8 bg-white border border-gray-100 shadow-lg rounded-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#e53935] tracking-tight drop-shadow">
          Báo cáo hành vi lừa đảo
        </h1>
        <p className="mb-8 text-lg text-center text-gray-700">
          Vui lòng chọn loại báo cáo bạn muốn gửi:
        </p>
        <div className="w-full max-w-xs mb-10">
          <label className="block mb-2 text-base font-semibold text-left text-gray-700">
            Loại báo cáo
          </label>
          <select
            value={typeReport}
            onChange={(e) => handleTypeChange(e.target.value as ReportType)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black text-lg shadow"
          >
            {REPORT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <ReportForm type={typeReport} />
        </div>
      </div>
    </div>
  );
}
