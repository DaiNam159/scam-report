import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from 'src/entities/chat_message.entity';
import { ChatConversation } from 'src/entities/chat_conversation.entity';
import { User } from 'src/entities/user.entity';
import {
  SendMessageDto,
  GetMessagesDto,
  ConversationsDto,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepo: Repository<ChatMessage>,
    @InjectRepository(ChatConversation)
    private conversationRepo: Repository<ChatConversation>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async sendMessage(
    senderId: number,
    dto: SendMessageDto,
  ): Promise<ChatMessage> {
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const receiver = await this.userRepo.findOne({
      where: { id: dto.receiverId },
    });

    if (!sender || !receiver) {
      throw new NotFoundException('User not found');
    }

    const message = this.chatMessageRepo.create({
      senderId,
      receiverId: dto.receiverId,
      message: dto.message,
      isAdminMessage: sender.isAdmin,
    });

    const savedMessage = await this.chatMessageRepo.save(message);

    // Update or create conversation
    await this.updateConversation(senderId, dto.receiverId, dto.message);

    return savedMessage;
  }

  async getMessages(
    userId: number,
    isAdmin: boolean,
    dto: GetMessagesDto,
  ): Promise<{ messages: ChatMessage[]; total: number }> {
    const page = dto.page || 1;
    const limit = dto.limit || 50;
    const skip = (page - 1) * limit;

    let query = this.chatMessageRepo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver');

    if (isAdmin && dto.userId) {
      // Admin xem TẤT CẢ tin nhắn của user (không phân biệt với admin nào)
      query = query.where(
        'message.senderId = :userId OR message.receiverId = :userId',
        { userId: dto.userId },
      );
    } else if (!isAdmin) {
      // User chỉ xem tin nhắn của mình với admin
      query = query.where(
        'message.senderId = :userId OR message.receiverId = :userId',
        { userId },
      );
    } else {
      return { messages: [], total: 0 };
    }

    const [messages, total] = await query
      .orderBy('message.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { messages, total };
  }

  async getConversations(
    adminId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ conversations: any[]; total: number }> {
    const skip = (page - 1) * limit;

    // Lấy tất cả user có tin nhắn với admin
    const query = this.chatMessageRepo
      .createQueryBuilder('message')
      .select('DISTINCT message.senderId', 'userId')
      .where('message.receiverId = :adminId', { adminId })
      .orWhere('message.senderId != :adminId', { adminId });

    const userIds = await query.getRawMany();

    const conversations: ConversationsDto[] = [];

    for (const { userId } of userIds) {
      if (userId === adminId) continue;

      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) continue;

      // Lấy tin nhắn cuối cùng của user này (với BẤT KỲ admin nào)
      const lastMessage = await this.chatMessageRepo.findOne({
        where: [{ senderId: userId }, { receiverId: userId }],
        order: { createdAt: 'DESC' },
      });

      // Đếm tin nhắn chưa đọc mà user gửi cho BẤT KỲ admin nào
      const unreadCount = await this.chatMessageRepo.count({
        where: {
          senderId: userId,
          isRead: false,
          isAdminMessage: false,
        },
      });

      conversations.push({
        userId: user.id,
        userEmail: user.email,
        userFullName: user.fullName,
        lastMessage: lastMessage?.message || '',
        lastMessageAt: lastMessage ? lastMessage.createdAt.toISOString() : null,
        unreadCount,
      });
    }

    // Sort by last message time
    conversations.sort(
      (a, b) =>
        new Date(b.lastMessageAt ?? '').getTime() -
        new Date(a.lastMessageAt ?? '').getTime(),
    );

    const total = conversations.length;
    const paginatedConversations = conversations.slice(skip, skip + limit);

    return { conversations: paginatedConversations, total };
  }

  async markAsRead(messageId: number, userId: number): Promise<void> {
    const message = await this.chatMessageRepo.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.receiverId === userId) {
      message.isRead = true;
      await this.chatMessageRepo.save(message);
    }
  }

  async markConversationAsRead(
    userId: number,
    otherUserId: number,
  ): Promise<void> {
    // Nếu userId là admin, cần đánh dấu TẤT CẢ tin nhắn từ otherUserId (không quan tâm gửi cho admin nào)
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (user?.isAdmin) {
      // Admin đánh dấu tất cả tin nhắn từ user này là đã đọc
      await this.chatMessageRepo
        .createQueryBuilder()
        .update(ChatMessage)
        .set({ isRead: true })
        .where('senderId = :otherUserId AND isRead = false', {
          otherUserId,
        })
        .execute();
    } else {
      // User chỉ đánh dấu tin nhắn từ admin gửi cho mình
      await this.chatMessageRepo
        .createQueryBuilder()
        .update(ChatMessage)
        .set({ isRead: true })
        .where(
          'senderId = :otherUserId AND receiverId = :userId AND isRead = false',
          {
            userId,
            otherUserId,
          },
        )
        .execute();
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.chatMessageRepo.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  private async updateConversation(
    senderId: number,
    receiverId: number,
    message: string,
  ): Promise<void> {
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const receiver = await this.userRepo.findOne({
      where: { id: receiverId },
    });

    // Update conversation cho sender
    let senderConv = await this.conversationRepo.findOne({
      where: { userId: senderId },
    });
    if (!senderConv) {
      senderConv = this.conversationRepo.create({ userId: senderId });
    }
    senderConv.lastMessage = message;
    senderConv.lastMessageAt = new Date();
    await this.conversationRepo.save(senderConv);

    // Update conversation cho receiver
    let receiverConv = await this.conversationRepo.findOne({
      where: { userId: receiverId },
    });
    if (!receiverConv) {
      receiverConv = this.conversationRepo.create({
        userId: receiverId,
        unreadCount: 0,
      });
    }
    receiverConv.lastMessage = message;
    receiverConv.lastMessageAt = new Date();
    if (!sender?.isAdmin) {
      receiverConv.unreadCount = (receiverConv.unreadCount || 0) + 1;
    }
    await this.conversationRepo.save(receiverConv);
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }
}
