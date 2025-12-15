import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    console.log(
      '✅ Login successful for user:',
      req.user?.email || req.user?.id,
    );

    const token = await this.authService.login(req.user);

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: isProduction, // Only HTTPS in production
      sameSite: isProduction ? 'none' : 'lax', // 'lax' for localhost
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    console.log('🍪 Cookie set with sameSite:', isProduction ? 'none' : 'lax');

    return { message: 'Login successful' };
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.isAdmin);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin-only')
  @Roles('admin')
  getAdminData(@Request() req) {
    return req.user;
  }
  @Get('me')
  @UseGuards(OptionalJwtAuthGuard)
  getProfile(@Req() req) {
    console.log('GET /auth/me - Cookies:', req.cookies);
    console.log('GET /auth/me - User:', req.user);

    if (!req.user) {
      console.log('No user found in request');
      return { isLoggedIn: false };
    }

    return {
      isLoggedIn: true,
      user: req.user,
    };
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    return { message: 'Logout successful' };
  }
}
