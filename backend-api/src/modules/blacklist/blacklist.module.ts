import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';
import { Report } from '../../entities/reports.entity';
import { ReportEmailAddress } from '../../entities/report_email_address.entity';
import { ReportPersonOrg } from '../../entities/report_person_org.entity';
import { ReportPhone } from '../../entities/report_phone.entity';
import { ReportWebsite } from '../../entities/report_website.entity';
import { ReportSocial } from '../../entities/report_social.entity';
import { ReportBankAccount } from '../../entities/report_bank_account.entity';
import { ReportEWallet } from '../../entities/report_e_wallet.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      ReportEmailAddress,
      ReportPersonOrg,
      ReportPhone,
      ReportWebsite,
      ReportSocial,
      ReportBankAccount,
      ReportEWallet,
      User,
    ]),
  ],
  controllers: [BlacklistController],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}
