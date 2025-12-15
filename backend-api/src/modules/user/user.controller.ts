import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @Get()
  // async getAllUsers(
  //   @Body() query: GetAllUsersDto
  // ) {
  //   return this.userService.getAllUsers(
  //     query.page,
  //     query.limit,
  //     query.sortBy,
  //     query.sortOrder,
  //     query.filters,
  //   );
  // }
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query?: any,
  ) {
    // Loại bỏ các param không phải filter

    const {
      page: _p,
      limit: _l,
      sortBy: _s,
      sortOrder: _o,
      ...filters
    } = query;

    return this.userService.getAllUsers(
      page,
      limit,
      sortBy,
      sortOrder,
      filters,
    );
  }
  @Get('count')
  async countUsers() {
    return this.userService.countUsers();
  }

  @Get('register-today')
  async getRegisterToday() {
    return this.userService.getRegisterToday();
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
  @Put('ban')
  async banUsers(@Body() dto: BanUserDto) {
    return this.userService.BanUsers(dto);
  }
  @Delete()
  async deleteUser(@Body() body: { id: number }) {
    return this.userService.deleteUser(body.id);
  }
}
