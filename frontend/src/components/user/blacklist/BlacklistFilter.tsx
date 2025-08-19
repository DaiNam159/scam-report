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
  Search,
} from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
  selectedType: ReportType;
  onChange: (type: ReportType) => void;
  onSearch?: (query: string) => void;
  searchValue?: string;
}

const types = [
  {
    value: "email_address",
    label: "Email",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    value: "phone",
    label: "Số điện thoại",
    icon: <Phone className="w-5 h-5" />,
  },
  { value: "website", label: "Website", icon: <Globe2 className="w-5 h-5" /> },
  {
    value: "social",
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
    value: "person_org",
    label: "Cá nhân / tổ chức",
    icon: <User className="w-5 h-5" />,
  },
  { value: "other", label: "Khác", icon: <Link2 className="w-5 h-5" /> },
];

export default function BlacklistFilter({
  selectedType,
  onChange,
  onSearch,
  searchValue = "",
}: Props) {
  const [searchQuery, setSearchQuery] = useState(searchValue);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="w-full mb-6 text-xs md:text-sm">
      <label className="block mb-2 text-xs font-semibold text-left text-gray-700 md:text-sm">
        Lọc theo loại đối tượng
      </label>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm kiếm email, số điện thoại, website..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black text-xs md:text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute text-sm text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Nút filter chỉ hiện trên desktop/tablet */}
      <div className="flex-wrap hidden gap-2 mb-3 md:flex">
        {types.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value as ReportType)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition font-semibold text-xs md:text-sm
              ${
                selectedType === type.value
                  ? "bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white shadow"
                  : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-[#fbc02d]/20"
              }
              min-w-[120px] justify-center
            `}
          >
            {type.icon}
            {type.label}
          </button>
        ))}
      </div>
      {/* Dropdown chỉ hiển thị trên mobile */}
      <select
        value={selectedType}
        onChange={(e) => onChange(e.target.value as ReportType)}
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black shadow block md:hidden text-xs md:text-sm"
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
