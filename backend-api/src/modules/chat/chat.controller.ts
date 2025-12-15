import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  SendMessageDto,
  GetMessagesDto,
  MarkAsReadDto,
  GetConversationsDto,
} from './dto/chat.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post('send')
  async sendMessage(@Req() req, @Body() dto: SendMessageDto) {
    const userId = req.user.id;
    const message = await this.chatService.sendMessage(userId, dto);

    // Emit WebSocket event cho realtime
    this.chatGateway.emitNewMessage(message);

    return message;
  }

  @Get('messages')
  async getMessages(@Req() req, @Query() dto: GetMessagesDto) {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    const result = await this.chatService.getMessages(userId, isAdmin, dto);
    return result;
  }

  @Get('conversations')
  async getConversations(@Req() req, @Query() dto: GetConversationsDto) {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return { conversations: [], total: 0 };
    }

    const page = dto.page || 1;
    const limit = dto.limit || 20;
    return this.chatService.getConversations(userId, page, limit);
  }

  @Put('mark-read/:messageId')
  async markAsRead(@Req() req, @Param('messageId') messageId: number) {
    const userId = req.user.id;
    await this.chatService.markAsRead(messageId, userId);
    return { success: true };
  }

  @Put('mark-conversation-read/:userId')
  async markConversationAsRead(
    @Req() req,
    @Param('userId') otherUserId: number,
  ) {
    const userId = req.user.id;
    await this.chatService.markConversationAsRead(userId, otherUserId);
    return { success: true };
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req) {
    const userId = req.user.id;
    const count = await this.chatService.getUnreadCount(userId);
    return { count };
  }
}
