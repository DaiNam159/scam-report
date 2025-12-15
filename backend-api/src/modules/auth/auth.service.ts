// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import * as bcrypt from 'bcrypt';
import { ResponseHelper } from 'src/common/helpers/response.helper';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id, // chỉ lưu ID
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, isAdmin = false) {
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new BadRequestException('Email đã được sử dụng');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      email,
      password: hashed,
      isAdmin,
    });

    // Send verification email
    try {
      await this.emailVerificationService.sendVerificationEmail(user.id);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't throw error, just log it - user can resend later
    }

    return {
      message:
        'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.',
      userId: user.id,
    };
  }
}
