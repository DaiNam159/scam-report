import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';
import { Request } from 'express';
@Controller('report')
export class ReportController {
  constructor(private readonly reportsService: ReportService) {}

  @Post()
  async create(@Body() dto: CreateReportDto, @Req() req: Request) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return this.reportsService.createReport(dto, String(ip));
  }
}
