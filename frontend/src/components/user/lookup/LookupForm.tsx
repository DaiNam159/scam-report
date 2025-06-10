"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface LookupFormProps {
  onSearch: (query: string) => void;
}

const LookupForm = ({ onSearch }: LookupFormProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
      <label className="font-semibold text-gray-700 mb-1 text-base">
        Nhập thông tin cần tra cứu
      </label>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Số điện thoại, email, website, STK ngân hàng..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black text-lg shadow"
          />
        </div>
        <button
          type="submit"
          className="mt-2 sm:mt-0 px-8 py-3 font-bold text-lg rounded-xl bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
        >
          Tra cứu
        </button>
      </div>
    </form>
  );
};

export default LookupForm;
