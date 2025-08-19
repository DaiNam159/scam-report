import { Controller, Get, Query } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { GetBlacklistDto, BlacklistResponseDto } from './dto/get-blacklist.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đen lừa đảo' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đen được lấy thành công',
    type: 'object',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: [
      'email_address',
      'phone',
      'website',
      'social',
      'bank_account',
      'e_wallet',
      'person_org',
      'other',
    ],
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['reportCount', 'latestReport', 'value'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getBlacklist(
    @Query() query: GetBlacklistDto,
  ): Promise<BlacklistResponseDto> {
    return await this.blacklistService.getBlacklist(query);
  }
  @Get('stats')
  async getStats(): Promise<any> {
    return await this.blacklistService.getBlacklistStats();
  }
}
