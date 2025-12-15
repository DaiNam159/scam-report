import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SendMessageDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  receiverId: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class GetMessagesDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

export class MarkAsReadDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  messageId: number;
}

export class GetConversationsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

export class ConversationsDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  userEmail: string;

  @IsOptional()
  @IsString()
  userFullName: string;

  @IsOptional()
  @IsString()
  lastMessage: string;

  @IsOptional()
  @IsString()
  lastMessageAt: string | null;

  @IsNumber()
  unreadCount: number;
}
