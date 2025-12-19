import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EmailVerificationService } from './email-verification.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Get('verify')
  async verifyEmail(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.emailVerificationService.verifyEmail(token);

    // Set JWT cookie for auto-login
    if (result.access_token) {
      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: isProduction, // Only HTTPS in production
        sameSite: isProduction ? 'none' : 'lax', // 'lax' for localhost
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
      });
    }

    return { message: result.message };
  }

  @Post('resend')
  @UseGuards(JwtAuthGuard)
  async resendVerificationEmail(@Req() req: any) {
    return this.emailVerificationService.sendVerificationEmail(req.user.id);
  }

  @Post('send')
  async sendVerificationByEmail(@Body('email') email: string) {
    return this.emailVerificationService.resendVerificationEmail(email);
  }
}
