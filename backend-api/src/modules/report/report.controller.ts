import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';
@Controller('report')
export class ReportController {
  constructor(private readonly reportsService: ReportService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateReportDto, @Req() req: Request) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userId = (req.user as any)?.id || (req.user as any)?.userId;

    return this.reportsService.createReport(dto, String(ip), userId);
  }

  @Get()
  async get() {
    return this.reportsService.getReport(19);
  }
}
