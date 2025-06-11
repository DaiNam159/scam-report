"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface LookupFormProps {
  onSearch: (query: string, checkContent?: boolean) => void;
}

const LookupForm = ({ onSearch }: LookupFormProps) => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"info" | "content">("info");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim(), mode === "content");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
      <label className="mb-1 text-base font-semibold text-gray-700">
        Nhập thông tin cần tra cứu
      </label>
      <div className="flex gap-6 mb-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
          <input
            type="radio"
            name="lookupMode"
            value="info"
            checked={mode === "info"}
            onChange={() => setMode("info")}
            className="w-4 h-4"
          />
          Tra cứu thông tin (số điện thoại, email, website, STK...)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
          <input
            type="radio"
            name="lookupMode"
            value="content"
            checked={mode === "content"}
            onChange={() => setMode("content")}
            className="w-4 h-4"
          />
          Kiểm tra nội dung email hoặc tin nhắn SMS
        </label>
      </div>
      <div className="flex flex-col items-center w-full gap-3 sm:flex-row">
        <div className="relative flex-1 w-full">
          {mode === "info" && (
            <>
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Số điện thoại, email, website, STK ngân hàng..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black text-lg shadow"
              />
            </>
          )}
          {mode === "content" && (
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập nội dung email hoặc tin nhắn SMS cần kiểm tra..."
              rows={5}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black text-lg shadow resize-y"
            />
          )}
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
