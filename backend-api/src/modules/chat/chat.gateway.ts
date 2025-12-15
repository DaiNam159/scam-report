import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<number, string>(); // userId -> socketId

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    // Client connected
  }

  handleDisconnect(client: Socket) {
    // Remove from userSockets
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number },
  ) {
    this.userSockets.set(data.userId, client.id);
    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { receiverId: number; message: string; senderId: number },
  ) {
    try {
      const message = await this.chatService.sendMessage(data.senderId, {
        receiverId: data.receiverId,
        message: data.message,
      });

      // Send to receiver if online
      const receiverSocketId = this.userSockets.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newMessage', message);
      }

      // Nếu không tìm thấy receiver và sender không phải admin
      // → emit cho TẤT CẢ admin đang online (để admin nào cũng nhận được)
      const sender = await this.chatService.getUserById(data.senderId);
      if (!receiverSocketId && sender && !sender.isAdmin) {
        const adminSockets: string[] = [];

        for (const [userId, socketId] of this.userSockets.entries()) {
          const user = await this.chatService.getUserById(userId);
          if (user && user.isAdmin) {
            adminSockets.push(socketId);
          }
        }

        adminSockets.forEach((socketId) => {
          this.server.to(socketId).emit('newMessage', message);
        });
      }

      // Send back to sender
      client.emit('messageSent', message);

      return { success: true, message };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { userId: number; isAdmin: boolean; otherUserId?: number },
  ) {
    try {
      const result = await this.chatService.getMessages(
        data.userId,
        data.isAdmin,
        { userId: data.otherUserId },
      );
      return { success: true, data: result };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; otherUserId: number },
  ) {
    try {
      await this.chatService.markConversationAsRead(
        data.userId,
        data.otherUserId,
      );
      return { success: true };
    } catch (error) {
      console.error('Error marking as read:', error);
      return { success: false, error: error.message };
    }
  }

  // Method to emit new message from REST API
  emitNewMessage(message: any) {
    // Send to receiver
    const receiverSocketId = this.userSockets.get(message.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', message);
    }

    // Send confirmation to sender
    const senderSocketId = this.userSockets.get(message.senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('messageSent', message);
    }
  }
}
