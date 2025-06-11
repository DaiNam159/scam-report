// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
    if (existing) throw new BadRequestException('Email already used');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      email,
      password: hashed,
      isAdmin,
    });

    return { message: 'User created', userId: user.id };
  }
}
