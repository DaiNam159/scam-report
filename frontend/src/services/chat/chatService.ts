import api from "@/lib/axiosInstance";

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  isRead: boolean;
  isAdminMessage: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: number;
    email: string;
    fullName: string;
  };
  receiver?: {
    id: number;
    email: string;
    fullName: string;
  };
}

export interface Conversation {
  userId: number;
  userEmail: string;
  userFullName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface SendMessageDto {
  receiverId: number;
  message: string;
}

export const chatService = {
  async sendMessage(dto: SendMessageDto): Promise<ChatMessage> {
    const response = await api.post("/chat/send", dto);
    return response.data;
  },

  async getMessages(
    userId?: number,
    page: number = 1,
    limit: number = 50
  ): Promise<{ messages: ChatMessage[]; total: number }> {
    const params: any = { page, limit };
    if (userId) params.userId = userId;

    const response = await api.get("/chat/messages", { params });
    return response.data;
  },

  async getConversations(
    page: number = 1,
    limit: number = 20
  ): Promise<{ conversations: Conversation[]; total: number }> {
    const response = await api.get("/chat/conversations", {
      params: { page, limit },
    });
    return response.data;
  },

  async markAsRead(messageId: number): Promise<void> {
    await api.put(`/chat/mark-read/${messageId}`, {});
  },

  async markConversationAsRead(userId: number): Promise<void> {
    await api.put(`/chat/mark-conversation-read/${userId}`, {});
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get("/chat/unread-count");
    return response.data.count;
  },
};
