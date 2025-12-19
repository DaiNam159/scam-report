"use client";

import { useState, useEffect, useRef } from "react";
import { chatService, ChatMessage } from "@/services/chat/chatService";
import { chatSocket } from "@/services/chat/chatSocket";
import { FaPaperPlane, FaTimes, FaUser } from "react-icons/fa";

interface ChatBoxProps {
  currentUserId: number;
  otherUserId: number;
  otherUserName: string;
  isAdmin: boolean;
  onClose: () => void;
  onMessageRead?: () => void;
}

export default function ChatBox({
  currentUserId,
  otherUserId,
  otherUserName,
  isAdmin,
  onClose,
  onMessageRead,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Store user IDs in refs to avoid re-creating handlers
  const currentUserIdRef = useRef(currentUserId);
  const otherUserIdRef = useRef(otherUserId);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
    otherUserIdRef.current = otherUserId;
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    // Load initial messages using REST API (more reliable on first load)
    loadMessages();

    // Connect socket for realtime updates
    chatSocket.connect(currentUserId);

    // Listen for new messages - using refs to get latest values
    const handleNewMessage = async (message: ChatMessage) => {
      const currUserId = currentUserIdRef.current;
      const othUserId = otherUserIdRef.current;

      // Nếu là admin: nhận TẤT CẢ tin nhắn liên quan đến user đang chat (không quan tâm receiverId là admin nào)
      // Nếu là user: chỉ nhận tin từ admin gửi cho mình
      const shouldAdd = isAdmin
        ? message.senderId === othUserId || message.receiverId === othUserId
        : message.receiverId === currUserId; // User nhận từ bất kỳ admin nào

      if (shouldAdd) {
        setMessages((prev) => {
          // Tránh duplicate
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });

        // Nếu là admin và nhận tin nhắn từ user đang chat, đánh dấu đã đọc ngay
        if (isAdmin && message.senderId === othUserId && !message.isRead) {
          try {
            await chatService.markConversationAsRead(othUserId);
            // Notify parent to refresh conversations
            onMessageRead?.();
          } catch (error) {
            console.error("Failed to mark message as read:", error);
          }
        }
      }
    };

    chatSocket.on("newMessage", handleNewMessage);
    // Không dùng messageSent event nữa vì React StrictMode double-invoke
    // Message sẽ được add trực tiếp sau khi sendMessage thành công

    return () => {
      chatSocket.off("newMessage", handleNewMessage);
    };
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await chatService.getMessages(
        isAdmin ? otherUserId : undefined
      );
      setMessages(data.messages.reverse());

      // Mark as read
      if (data.messages.length > 0) {
        await chatService.markConversationAsRead(otherUserId);
        // Notify parent to refresh conversations
        onMessageRead?.();
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    const messageToSend = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX

    try {
      let savedMessage: ChatMessage | null = null;

      // Try socket first, fallback to REST API if needed
      if (chatSocket.isConnected()) {
        savedMessage = (await chatSocket.sendMessage(
          otherUserId,
          messageToSend,
          currentUserId
        )) as ChatMessage;
      } else {
        savedMessage = await chatService.sendMessage({
          receiverId: otherUserId,
          message: messageToSend,
        });
      }

      // Add message to state directly (no need to wait for socket event)
      if (savedMessage) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === savedMessage!.id)) {
            return prev;
          }
          return [...prev, savedMessage!];
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Fallback to REST API
      try {
        const savedMessage = await chatService.sendMessage({
          receiverId: otherUserId,
          message: messageToSend,
        });
        setMessages((prev) => {
          if (prev.some((m) => m.id === savedMessage.id)) {
            return prev;
          }
          return [...prev, savedMessage];
        });
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        // Restore message if failed
        setNewMessage(messageToSend);
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed flex flex-col overflow-hidden bg-white border border-gray-200 shadow-2xl bottom-4 right-4 w-90 h-120 rounded-2xl z-9998">
      {/* Header */}
      <div
        className={`relative flex items-center justify-between px-4 py-3 text-white ${
          isAdmin
            ? "bg-linear-to-r from-blue-600 via-blue-700 to-purple-700"
            : "bg-linear-to-r from-red-600 to-orange-600"
        }`}
      >
        {" "}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center text-white rounded-full shadow-lg w-9 h-9 bg-white/20 backdrop-blur-sm">
            <FaUser className="text-sm" />
          </div>
          <div>
            <span className="block text-sm font-bold tracking-tight">
              {otherUserName}
            </span>
            <span
              className={`flex items-center gap-1 text-[10px] ${
                isAdmin ? "text-blue-100" : "text-red-100"
              }`}
            >
              {" "}
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              {isAdmin ? "Người dùng" : "Hỗ trợ viên"}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 transition-all duration-200 rounded-lg hover:bg-white/20 hover:rotate-90"
          aria-label="Đóng"
        >
          <FaTimes className="text-base" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto bg-linear-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full ${
                  isAdmin
                    ? "bg-linear-to-r from-blue-100 to-purple-100"
                    : "bg-linear-to-r from-red-100 to-orange-100"
                }`}
              >
                <FaUser
                  className={`text-2xl ${
                    isAdmin ? "text-blue-600" : "text-red-600"
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-gray-500">
                Chưa có tin nhắn nào
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Bắt đầu cuộc trò chuyện ngay
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2 rounded-2xl shadow-sm ${
                    isOwnMessage
                      ? `${
                          isAdmin
                            ? "bg-linear-to-r from-blue-600 to-purple-600"
                            : "bg-linear-to-r from-red-600 to-orange-600"
                        } text-white rounded-br-md`
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap">
                    {msg.message}
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      isOwnMessage
                        ? isAdmin
                          ? "text-blue-100"
                          : "text-red-100"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-gray-200"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className={`flex-1 px-3 py-2 text-sm text-black transition-all border border-gray-300 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 ${
              isAdmin ? "focus:ring-blue-500" : "focus:ring-red-500"
            } focus:border-transparent`}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className={`flex items-center justify-center w-10 h-10 text-white transition-all duration-200 shadow-lg rounded-xl ${
              isAdmin
                ? "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                : "bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            } disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:shadow-xl disabled:shadow-none hover:scale-105 active:scale-95`}
            aria-label="Gửi"
          >
            <FaPaperPlane
              className={`text-sm ${loading ? "animate-pulse" : ""}`}
            />
          </button>
        </div>
      </form>
    </div>
  );
}
