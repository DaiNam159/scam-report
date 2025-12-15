"use client";

import { useState } from "react";
import { FaComment } from "react-icons/fa";
import ChatBox from "./ChatBox";

interface UserChatButtonProps {
  userId: number;
  userName: string;
  adminId?: number; // ID của admin để chat
}

export default function UserChatButton({
  userId,
  userName,
  adminId = 1, // Default admin ID
}: UserChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button với animation đẹp hơn */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 z-50 hover:scale-110 active:scale-95 group"
        title="Chat với Admin"
        aria-label="Mở chat"
      >
        <FaComment className="text-2xl transition-transform duration-300 group-hover:rotate-12" />

        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20"></span>

        {/* Badge notification (có thể thêm số tin nhắn chưa đọc sau) */}
        {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          3
        </span> */}
      </button>

      {/* Chat box */}
      {isOpen && (
        <ChatBox
          currentUserId={userId}
          otherUserId={adminId}
          otherUserName="Admin Hỗ Trợ"
          isAdmin={false}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
