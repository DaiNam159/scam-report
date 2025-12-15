import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { EditStatusDto } from './dto/edit-status.dto';
import { GetReportsDto } from './dto/get-reports.dto';
import { CheckSpamReportsDto } from './dto/check-spam.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateReportDto, @Req() req: Request) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userId = (req.user as any)?.id || (req.user as any)?.userId;

    return this.reportService.createReport(dto, String(ip), userId);
  }
  @Post('related-reports')
  async createRelatedReports(@Body() body: { input_text: string }) {
    return this.reportService.searchRelatedReports(body.input_text);
  }

  @Post('check-spam-user-min')
  async checkSpamByUserMin(@Body() dto: CheckSpamReportsDto) {
    return this.reportService.checkSpamByUserMinute(dto);
  }

  @Get('update-date')
  async updateReportDate() {
    return this.reportService.getLastReportUpdate();
  }
  @Get('count-all')
  async getCountAllReports() {
    return this.reportService.getTotalReport();
  }

  @Get('count-approved')
  async getCountApprovedReports() {
    return this.reportService.getTotalReportApproved();
  }
  @Get('count-pending')
  async getCountPendingReports() {
    return this.reportService.getTotalReportPending();
  }

  @Get('count-rejected')
  async getCountRejectedReports() {
    return this.reportService.getTotalReportRejected();
  }
  @Get('count-today')
  async getCountTodayReports() {
    return this.reportService.getTotalReportToday();
  }
  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  async getReports(@Query() query: GetReportsDto) {
    return this.reportService.getReports(query);
  }

  @Get('check-spam')
  async checkSpam() {
    return this.reportService.checkSpam();
  }
  // @Get('search-related')
  // async searchRelated(@Query('q') keyword: string) {
  //   if (!keyword || keyword.trim() === '') {
  //     throw new BadRequestException('Missing search keyword');
  //   }
  //   return this.reportService.searchRelatedReports(keyword.trim());
  // }
  @Get('check-spam-minutes')
  async checkSpamMinutes(
    @Query() dto: CheckSpamReportsDto,
    @Req() req: Request,
  ) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userId = (req.user as any)?.id || (req.user as any)?.userId;

    dto.userIp = String(ip);
    dto.userId = userId;

    return this.reportService.checkSpamByUserMinute(dto);
  }

  //@UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get('weekly-stats')
  async getWeeklyReportStats() {
    return this.reportService.getWeeklyReportStats();
  }

  // Get reports for the current authenticated user
  @UseGuards(AuthGuard('jwt'))
  @Get('my-reports')
  async getMyReports(@Query() query: GetReportsDto, @Req() req: Request) {
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    return this.reportService.getMyReports(userId, query);
  }

  @Get(':id')
  async getReportById(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.getReportById(id);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put('approve')
  async approveReport(@Body() dto: EditStatusDto) {
    return this.reportService.approveReport(dto.id);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put('reject')
  async rejectReport(@Body() dto: EditStatusDto) {
    return this.reportService.rejectReport(dto.id);
  }
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  async deleteReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.deleteReport(id);
  }
}
