"use client";

import { useState, useEffect } from "react";
import { chatService, Conversation } from "@/services/chat/chatService";
import { FaComment, FaTimes } from "react-icons/fa";
import ChatBox from "./ChatBox";

interface AdminChatListProps {
  adminId: number;
}

export default function AdminChatList({ adminId }: AdminChatListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
    loadUnreadCount();

    const interval = setInterval(() => {
      if (isOpen) loadConversations();
      loadUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data.conversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await chatService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleSelectUser = (userId: number, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition z-50"
      >
        <FaComment className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Conversations list */}
      {isOpen && !selectedUser && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">Tin nhắn</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Chưa có tin nhắn nào
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() =>
                    handleSelectUser(
                      conv.userId,
                      conv.userFullName || conv.userEmail
                    )
                  }
                  className="w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 truncate">
                          {conv.userFullName || conv.userEmail}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.lastMessageAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat box */}
      {selectedUser && (
        <ChatBox
          currentUserId={adminId}
          otherUserId={selectedUser.id}
          otherUserName={selectedUser.name}
          isAdmin={true}
          onClose={() => {
            setSelectedUser(null);
            loadConversations();
            loadUnreadCount();
          }}
          onMessageRead={() => {
            loadConversations();
            loadUnreadCount();
          }}
        />
      )}
    </>
  );
}
