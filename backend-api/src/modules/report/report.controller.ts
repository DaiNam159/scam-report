import {
  Body,
  Controller,
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

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  getReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reportService.getReports(page, limit);
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
}
