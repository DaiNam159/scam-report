import { Controller, Get, Query } from '@nestjs/common';
import { SafetyService } from './safety.service';

@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Get('check-url')
  async checkUrl(@Query('url') url: string) {
    if (!url) return { message: 'Missing url query param' };
    return this.safetyService.checkUrl(url);
  }
}
