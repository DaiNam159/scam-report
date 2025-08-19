import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { SafetyService } from './safety.service';
import { Response } from 'express';

@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Get('check-url')
  async checkUrl(@Query('url') url: string) {
    if (!url) return { message: 'Missing url query param' };
    return this.safetyService.checkUrlWithSafeBrowsing(url);
  }
  @Get('check-url-ipqs')
  async checkUrlIpqs(@Query('url') url: string) {
    if (!url) return { message: 'Missing url query param' };
    return this.safetyService.checkUrlWithIPQS(url);
  }
  @Get('screenshot-website')
  async getScreenshot(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    const pngBuffer = await this.safetyService.screenshotWebsite(url);
    res.setHeader('Content-Type', 'image/png');
    res.send(pngBuffer); // gửi ảnh trực tiếp
  }
  @Post('screenshot-url')
  async screenshotUrl(@Body('url') url: string) {
    return await this.safetyService.screenshotUrl(url);
  }
}
