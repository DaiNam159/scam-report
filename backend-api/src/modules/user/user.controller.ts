import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.getAllUsers(page, limit);
  }
  @Get('count')
  async countUsers() {
    return this.userService.countUsers();
  }
  @Put('active')
  async activeUsers(@Body() body: { id: number }) {
    return this.userService.enableUser(body.id);
  }
  @Put('disable')
  async disableUsers(@Body() body: { id: number }) {
    return this.userService.disableUser(body.id);
  }
  @Put('update')
  async updateUser(@Body() body: { id: number; userData: UpdateUserDto }) {
    return this.userService.updateUser(body.id, body.userData);
  }
  @Delete()
  async deleteUser(@Body() body: { id: number }) {
    return this.userService.deleteUser(body.id);
  }
}
