// src/admin/admin.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  @Get()
  getAdminContent(@Req() req) {
    return { message: 'Welcome Admin!', user: req.user };
  }
}
