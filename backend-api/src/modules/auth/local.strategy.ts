import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('🔍 LocalStrategy validate:', {
      email,
      passwordLength: password?.length,
    });

    const user = await this.authService.validateUser(email, password);

    console.log('📝 Validate result:', user ? 'User found' : 'User not found');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
