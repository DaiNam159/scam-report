import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEmailAddress } from 'src/entities/report_email_address.entity';
import { ReportPersonOrg } from 'src/entities/report_person_org.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report, ReportStatus, ReportType } from 'src/entities/reports.entity';
import { ReportWebsite } from 'src/entities/report_website.entity';
import { ReportEWallet } from 'src/entities/report_e_wallet.entity';
import { ReportEmailContent } from 'src/entities/report_email_content.entity';
import { ReportSocial } from 'src/entities/report_social.entity';
import { ReportBankAccount } from 'src/entities/report_bank_account.entity';
import { ReportSms } from 'src/entities/report_sms.entity';
import { ReportPhone } from 'src/entities/report_phone.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,

    @InjectRepository(ReportEmailAddress)
    private readonly emailAddressRepo: Repository<ReportEmailAddress>,

    @InjectRepository(ReportPersonOrg)
    private readonly personOrgRepo: Repository<ReportPersonOrg>,

    @InjectRepository(ReportWebsite)
    private readonly websiteRepo: Repository<ReportWebsite>,

    @InjectRepository(ReportEWallet)
    private readonly eWalletRepo: Repository<ReportEWallet>,

    @InjectRepository(ReportEmailContent)
    private readonly emailContentRepo: Repository<ReportEmailContent>,

    @InjectRepository(ReportSocial)
    private readonly socialRepo: Repository<ReportSocial>,

    @InjectRepository(ReportBankAccount)
    private readonly bankAccountRepo: Repository<ReportBankAccount>,

    @InjectRepository(ReportSms)
    private readonly smsRepo: Repository<ReportSms>,

    @InjectRepository(ReportPhone)
    private readonly phoneRepo: Repository<ReportPhone>,

    // inject các bảng khác tương tự
  ) {}
  async createReport(dto: CreateReportDto, ip: string, userId: number) {
    // 1. Lưu vào bảng chính
    const report = this.reportRepo.create({
      report_type: dto.reportType as ReportType,
      title: dto.title,
      description: dto.description,
      evidence: dto.evidence,
      user_ip: ip,
      ...(userId ? { user: { id: userId } } : {}),
      status: (dto.status as ReportStatus) || ReportStatus.PENDING,
      contact: dto.contact,
    } as Partial<Report>);

    const saved = await this.reportRepo.save(report);
    console.log('Report saved:', saved);
    // 2. Tùy theo reportType -> lưu vào bảng phụ tương ứng
    const reportHandlers = {
      email_address: (dto) => ({
        repo: this.emailAddressRepo,
        data: {
          report_id: saved.id,
          email_address: dto.emailAddress,
        },
      }),
      person_org: (dto) => ({
        repo: this.personOrgRepo,
        data: {
          reportId: saved.id,
          name: dto.name,
          role: dto.role,
          identification: dto.identification,
          address: dto.address,
          socialLinks: dto.socialLinks,
        },
      }),
      email_content: (dto) => ({
        repo: this.emailContentRepo,
        data: {
          report_id: saved.id,
          email_subject: dto.emailSubject,
          email_body: dto.emailBody,
          sender_address: dto.senderAddress,
          attachments: dto.attachments,
          suspicious_links: dto.suspiciousLinks,
        },
      }),
      phone: (dto) => ({
        repo: this.phoneRepo,
        data: {
          report_id: saved.id,
          phone_number: dto.phoneNumber,
        },
      }),
      sms: (dto) => ({
        repo: this.smsRepo,
        data: {
          report_id: saved.id,
          phone_number: dto.phoneNumber,
          sms_content: dto.smsContent,
        },
      }),
      website: (dto) => ({
        repo: this.websiteRepo,
        data: {
          report_id: saved.id,
          website_url: dto.websiteUrl,
        },
      }),
      social: (dto) => ({
        repo: this.socialRepo,
        data: {
          report_id: saved.id,
          platform: dto.platform,
          profile_url: dto.profileUrl,
          username: dto.username,
          social_links: dto.socialLinks,
        },
      }),
      bank_account: (dto) => ({
        repo: this.bankAccountRepo,
        data: {
          report_id: saved.id,
          bank_name: dto.bankName,
          account_number: dto.accountNumber,
          account_holder_name: dto.accountHolderName,
        },
      }),
      e_wallet: (dto) => ({
        repo: this.eWalletRepo,
        data: {
          report_id: saved.id,
          wallet_type: dto.walletType,
          wallet_id: dto.walletId,
          account_holder_name: dto.accountHolderName,
        },
      }),
    };

    const handler = reportHandlers[dto.reportType];
    if (!handler) {
      throw new Error(`Unknown report type: ${dto.reportType}`);
    }
    const { repo, data } = handler(dto);
    await repo.save(data);
    return {
      id: saved.id,
      message: 'Report created successfully',
    };
  }

  async getReport(reportId: number) {
    try {
      const report = await this.reportRepo
        .createQueryBuilder('report')
        .select(['report.report_type'])
        .where('report.id = :id', { id: reportId })
        .getOne();

      if (!report) {
        throw new Error('Report not found');
      }

      const reportData = await this.reportRepo.findOne({
        where: { id: reportId },
        relations: [report.report_type, 'user'],
      });
      if (reportData && reportData.user) {
        const { id, email, fullName } = reportData.user;

        reportData.user = {
          id,
          email,
          fullName,
        } as any;
      }

      return reportData;
    } catch (err) {
      throw err;
    }
  }
}
