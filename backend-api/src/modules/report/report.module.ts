import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEmailAddress } from 'src/entities/report_email_address.entity';
import { ReportPersonOrg } from 'src/entities/report_person_org.entity';
import { ReportWebsite } from 'src/entities/report_website.entity';
import { ReportEWallet } from 'src/entities/report_e_wallet.entity';
import { ReportEmailContent } from 'src/entities/report_email_content.entity';
import { ReportPhone } from 'src/entities/report_phone.entity';
import { ReportSocial } from 'src/entities/report_social.entity';
import { ReportBankAccount } from 'src/entities/report_bank_account.entity';
import { ReportSms } from 'src/entities/report_sms.entity';
import { Report } from 'src/entities/reports.entity';
import { Stats } from 'src/entities/stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      ReportEmailAddress,
      ReportPersonOrg,
      ReportWebsite,
      ReportEWallet,
      ReportEmailContent,
      ReportPhone,
      ReportSocial,
      ReportBankAccount,
      ReportSms,
      Stats,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
