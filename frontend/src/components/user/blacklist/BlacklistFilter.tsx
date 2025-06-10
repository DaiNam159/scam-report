"use client";

import { ReportType } from "@/types/ReportType";
import {
  Mail,
  Phone,
  Globe2,
  User,
  CreditCard,
  Wallet,
  Users,
  Link2,
} from "lucide-react";

interface Props {
  selectedType: ReportType;
  onChange: (type: ReportType) => void;
}

const types = [
  {
    value: "email_address",
    label: "Email",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    value: "phone_number",
    label: "Số điện thoại",
    icon: <Phone className="w-5 h-5" />,
  },
  { value: "website", label: "Website", icon: <Globe2 className="w-5 h-5" /> },
  {
    value: "social_profile",
    label: "Mạng xã hội",
    icon: <Users className="w-5 h-5" />,
  },
  {
    value: "bank_account",
    label: "Tài khoản ngân hàng",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    value: "e_wallet",
    label: "Ví điện tử",
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    value: "person",
    label: "Cá nhân / tổ chức",
    icon: <User className="w-5 h-5" />,
  },
  { value: "other", label: "Khác", icon: <Link2 className="w-5 h-5" /> },
];

export default function BlacklistFilter({ selectedType, onChange }: Props) {
  return (
    <div className="w-full mb-6">
      <label className="block mb-2 text-base font-semibold text-left text-gray-700">
        Lọc theo loại đối tượng
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {types.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value as ReportType)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition text-sm font-semibold
              ${
                selectedType === type.value
                  ? "bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white shadow"
                  : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-[#fbc02d]/20"
              }
            `}
          >
            {type.icon}
            {type.label}
          </button>
        ))}
      </div>
      <select
        value={selectedType}
        onChange={(e) => onChange(e.target.value as ReportType)}
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black text-lg shadow"
      >
        {types.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}
