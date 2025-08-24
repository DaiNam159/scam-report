import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEmailAddress } from 'src/entities/report_email_address.entity';
import { ReportPersonOrg } from 'src/entities/report_person_org.entity';
import { Between, In, Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report, ReportStatus, ReportType } from 'src/entities/reports.entity';
import { ReportWebsite } from 'src/entities/report_website.entity';
import { ReportEWallet } from 'src/entities/report_e_wallet.entity';
import { ReportEmailContent } from 'src/entities/report_email_content.entity';
import { ReportSocial } from 'src/entities/report_social.entity';
import { ReportBankAccount } from 'src/entities/report_bank_account.entity';
import { ReportSms } from 'src/entities/report_sms.entity';
import { ReportPhone } from 'src/entities/report_phone.entity';
import axios from 'axios';
import { Stats } from 'src/entities/stats.entity';
import { GetReportsDto } from './dto/get-reports.dto';
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

    @InjectRepository(Stats)
    private readonly statsRepo: Repository<Stats>,

    // inject các bảng khác tương tự
  ) {}
  async createReport(dto: CreateReportDto, ip: string, userId: number) {
    // 1. Lưu vào bảng chính
    const report = this.reportRepo.create({
      report_type: dto.reportType as ReportType,
      title: dto.title,
      description: dto.description,
      evidence: dto.evidence,
      evidence_public_id: dto.evidencePublicId,
      user_ip: ip,
      ...(userId ? { user: { id: userId } } : {}),
      status: (dto.status as ReportStatus) || ReportStatus.PENDING,
      contact: dto.contact,
    } as Partial<Report>);

    const saved = await this.reportRepo.save(report);
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
          report_id: saved.id,
          name: dto.name,
          role: dto.role,
          identification: dto.identification,
          address: dto.address,
          phone_number: dto.phoneNumber,
          email_address: dto.emailAddress,
          social_links: dto.socialLinks,
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
          url: dto.websiteUrl,
        },
      }),
      social: (dto) => ({
        repo: this.socialRepo,
        data: {
          report_id: saved.id,
          platform: dto.platform,
          profile_url: dto.profileUrl,
          username: dto.username,
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

  async getReportById(reportId: number) {
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
  async getReports(query: GetReportsDto) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        status,
        search,
        dateFrom,
        dateTo,
        userEmail,
        sortBy,
        sortOrder,
      } = query;

      const qb = this.reportRepo
        .createQueryBuilder('report')
        .leftJoinAndSelect('report.user', 'user')
        .leftJoinAndSelect('report.email_address', 'email_address')
        .leftJoinAndSelect('report.person_org', 'person_org')
        .leftJoinAndSelect('report.email_content', 'email_content')
        .leftJoinAndSelect('report.phone', 'phone')
        .leftJoinAndSelect('report.sms', 'sms')
        .leftJoinAndSelect('report.website', 'website')
        .leftJoinAndSelect('report.social', 'social')
        .leftJoinAndSelect('report.bank_account', 'bank_account')
        .leftJoinAndSelect('report.e_wallet', 'e_wallet')
        .skip((page - 1) * limit)
        .take(limit);

      // lọc theo type
      if (type) {
        qb.andWhere('report.report_type = :type', { type });
      }

      // lọc theo status
      if (status) {
        qb.andWhere('report.status = :status', { status });
      }

      // lọc theo email user
      if (userEmail) {
        qb.andWhere('user.email LIKE :userEmail', {
          userEmail: `%${userEmail}%`,
        });
      }

      // lọc theo search (title hoặc description)
      if (search) {
        qb.andWhere(
          '(report.title LIKE :search OR report.description LIKE :search)',
          { search: `%${search}%` },
        );
      }

      // lọc theo khoảng thời gian
      if (dateFrom) {
        qb.andWhere('report.created_at >= :dateFrom', { dateFrom });
      }
      if (dateTo) {
        qb.andWhere('report.created_at <= :dateTo', { dateTo });
      }

      // Logic sort động
      let sortField = 'report.created_at';
      let sortDir: 'ASC' | 'DESC' = 'DESC';
      if (sortBy) {
        // Chỉ cho phép sort theo các trường hợp lệ
        const allowedSort: Record<string, string> = {
          id: 'report.id',
          title: 'report.title',
          report_type: 'report.report_type',
          status: 'report.status',
          created_at: 'report.created_at',
        };
        if (allowedSort[sortBy]) {
          sortField = allowedSort[sortBy];
        }
      }
      if (sortOrder && (sortOrder === 'ASC' || sortOrder === 'DESC')) {
        sortDir = sortOrder.toUpperCase() as 'ASC' | 'DESC';
      }
      qb.orderBy(sortField, sortDir);

      const [reports, total] = await qb.getManyAndCount();
      const cleaned = reports.map((report) => {
        const { report_type } = report;
        const allowed = [
          'email_address',
          'email_content',
          'website',
          'phone',
          'sms',
          'social',
          'person_org',
          'bank_account',
          'e_wallet',
        ];

        // remove các quan hệ null không liên quan
        const filtered = Object.fromEntries(
          Object.entries(report).filter(([key]) => {
            if (!allowed.includes(key)) return true; // giữ field gốc như id, title, description, ...
            return key === report_type; // chỉ giữ đúng type
          }),
        );

        return filtered;
      });

      return {
        data: cleaned,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw error;
    }
  }

  async approveReport(reportId: number) {
    try {
      const reportData = await this.reportRepo.findOne({
        where: { id: reportId },
      });
      if (!reportData) {
        throw new NotFoundException('Report not found');
      }
      reportData.status = ReportStatus.APPROVED;
      await this.reportRepo.save(reportData);
      return {
        message: `Approved report ${reportData.id}`,
        reportData,
      };
    } catch (error) {
      throw error;
    }
  }
  async rejectReport(reportId: number) {
    try {
      const reportData = await this.reportRepo.findOne({
        where: { id: reportId },
      });
      if (!reportData) {
        throw new NotFoundException('Report not found');
      }
      reportData.status = ReportStatus.REJECTED;
      await this.reportRepo.save(reportData);
      return {
        message: `Approved report ${reportData.id}`,
        reportData,
      };
    } catch (error) {
      throw error;
    }
  }
  async deleteReport(reportId: number) {
    try {
      const reportData = await this.reportRepo.findOne({
        where: { id: reportId },
      });
      if (!reportData) {
        throw new NotFoundException('Report not found');
      }
      await this.reportRepo.remove(reportData);
      return {
        message: `Deleted report ${reportId}`,
      };
    } catch (error) {
      throw error;
    }
  }
  async getTotalReportApproved() {
    try {
      const total = await this.reportRepo.count({
        where: { status: ReportStatus.APPROVED },
      });
      return total;
    } catch (error) {
      throw error;
    }
  }
  async getTotalReportPending() {
    try {
      const total = await this.reportRepo.count({
        where: { status: ReportStatus.PENDING },
      });
      return total;
    } catch (error) {
      throw error;
    }
  }
  async getTotalReportRejected() {
    try {
      const total = await this.reportRepo.count({
        where: { status: ReportStatus.REJECTED },
      });
      return total;
    } catch (error) {
      throw error;
    }
  }
  async getTotalReport() {
    try {
      const total = await this.reportRepo.count();
      return total;
    } catch (error) {
      throw error;
    }
  }

  async searchRelatedReports(inputText: string) {
    try {
      const baseUrl = process.env.FAST_API_URL;
      const stats = await this.statsRepo.findOne({
        where: { id: 1 },
      });
      if (!stats) {
        throw new Error('Stats not found');
      }
      stats.lookup_count++;
      await this.statsRepo.save(stats);

      if (!baseUrl) {
        throw new Error(
          'FAST_API_URL không được cấu hình trong environment variables',
        );
      }
      if (!inputText) {
        throw new Error('Cần nhập vào thông tin để tìm kiếm báo cáo liên quan');
      }
      if (inputText.length < 10) {
        throw new Error('Thông tin quá ngắn');
      }
      const response = await axios.post(`${baseUrl}/related-reports`, {
        text: inputText,
      });

      const related_data = response.data;
      const ids = related_data
        .map((item) => parseInt(item.matched_report_id, 10))
        .filter((id) => Number.isInteger(id));

      if (!ids.length) return [];

      const reports = await this.reportRepo.find({
        where: {
          id: In(ids),
          status: In([ReportStatus.APPROVED, ReportStatus.PENDING]),
        },
        relations: [
          'user',
          'email_address',
          'person_org',
          'email_content',
          'phone',
          'sms',
          'website',
          'social',
          'bank_account',
          'e_wallet',
        ],
        select: {
          id: true,
          report_type: true,
          title: true,
          description: true,
          evidence: true,
          user_ip: true,
          status: true,
          contact: true,
          created_at: true,
          user: {
            id: true,
            fullName: true,
            email: true,
          },
          email_address: {
            report_id: true,
            email_address: true,
          },
          person_org: {
            report_id: true,
            name: true,
            role: true,
            identification: true,
            address: true,
            phone_number: true,
            email_address: true,
            social_links: true,
          },
          email_content: {
            report_id: true,
            email_subject: true,
            email_body: true,
            sender_address: true,
            attachments: true,
            suspicious_links: true,
          },
          phone: {
            report_id: true,
            phone_number: true,
          },
          sms: {
            report_id: true,
            phone_number: true,
            sms_content: true,
          },
          website: {
            report_id: true,
            url: true,
          },
          social: {
            report_id: true,
            platform: true,
            profile_url: true,
            username: true,
          },
          bank_account: {
            report_id: true,
            bank_name: true,
            account_number: true,
            account_holder_name: true,
          },
          e_wallet: {
            report_id: true,
            wallet_type: true,
            wallet_id: true,
            account_holder_name: true,
          },
        },
      });
      for (const r of reports) {
        const type = r.report_type;
        for (const key of [
          'email_address',
          'person_org',
          'email_content',
          'phone',
          'sms',
          'website',
          'social',
          'bank_account',
          'e_wallet',
        ]) {
          if (key !== type) delete r[key];
        }
      }
      return reports;
    } catch (error) {
      console.error('Lỗi khi gọi FastAPI:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw new Error(`Không thể tìm kiếm báo cáo liên quan: ${error.message}`);
    }
  }
  async getLastReportUpdate() {
    try {
      const latestReport = await this.reportRepo.findOne({
        where: {},
        select: ['updated_at'],
        order: { updated_at: 'DESC' },
      });
      if (!latestReport) return null;

      const updatedAt = new Date(latestReport.updated_at);

      const day = updatedAt.getDate();
      const month = updatedAt.getMonth() + 1;
      const year = updatedAt.getFullYear();

      return { day, month, year };
    } catch (error) {
      console.error('Lỗi khi lấy thời gian cập nhật báo cáo:', error.message);
      throw new Error(
        `Không thể lấy thời gian cập nhật báo cáo: ${error.message}`,
      );
    }
  }
  async getTotalReportToday() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const total = await this.reportRepo.count({
        where: {
          created_at: Between(today, tomorrow),
        },
      });
      return total;
    } catch (error) {
      console.error('Lỗi khi lấy tổng báo cáo hôm nay:', error.message);
      throw new Error(`Không thể lấy tổng báo cáo hôm nay: ${error.message}`);
    }
  }
}
