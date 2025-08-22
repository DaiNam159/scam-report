import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats() {
    return this.statsService.getStats();
  }
  @Get('total-visits')
  async getTotalVisits() {
    return this.statsService.getTotalVisits();
  }

  @Get('online-users')
  async getOnlineUsers() {
    return this.statsService.getOnlineUsers();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('track-visit')
  async trackVisit(@Req() req: Request) {
    // Lấy IP client
    const ip = ((req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown') as string;

    const userId = (req.user as any)?.id || (req.user as any)?.userId;

    return this.statsService.addVisitor(ip, userId);
  }
}
