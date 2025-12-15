import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailVerificationService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate JWT access token for verification and auto-login
    const payload = { sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

    user.verificationToken = access_token;
    user.verificationTokenExpires = expires;
    await this.userRepo.save(user);

    // Send email with access_token in URL
    const verificationUrl = `${process.env.FRONTEND_URL}/xac-minh-email?token=${access_token}`;

    try {
      await this.transporter.sendMail({
        from: `"Scam Report" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Xác minh địa chỉ email của bạn',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Xác minh địa chỉ email</h2>
            <p>Xin chào <strong>${user.fullName || user.email}</strong>,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại Scam Report. Vui lòng nhấp vào nút bên dưới để xác minh địa chỉ email của bạn:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(to right, #dc2626, #b91c1c); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Xác minh email
              </a>
            </div>
            <p>Hoặc copy link sau vào trình duyệt:</p>
            <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all;">
              ${verificationUrl}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Link này sẽ hết hạn sau 24 giờ. Nếu bạn không yêu cầu xác minh email này, vui lòng bỏ qua email này.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Scam Report. All rights reserved.
            </p>
          </div>
        `,
      });

      return { message: 'Verification email sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new BadRequestException('Failed to send verification email');
    }
  }

  async verifyEmail(token: string) {
    // First, try to verify the JWT token
    let userId: number;
    try {
      const decoded = this.jwtService.verify(token);
      userId = decoded.sub;
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Verify the token matches the one we sent
    if (user.verificationToken !== token) {
      throw new BadRequestException('Invalid verification token');
    }

    if (
      !user.verificationTokenExpires ||
      user.verificationTokenExpires < new Date()
    ) {
      throw new BadRequestException('Verification token has expired');
    }

    user.emailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await this.userRepo.save(user);

    // Return the same access_token for auto-login
    return {
      message: 'Email verified successfully',
      access_token: token, // Use the same token from URL
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sendVerificationEmail(user.id);
  }
}
