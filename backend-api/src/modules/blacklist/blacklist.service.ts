import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetBlacklistDto,
  BlacklistResponseDto,
  BlacklistItemDto,
} from './dto/get-blacklist.dto';
import { Report, ReportType } from '../../entities/reports.entity';
import { ReportEmailAddress } from '../../entities/report_email_address.entity';
import { ReportPersonOrg } from '../../entities/report_person_org.entity';
import { ReportPhone } from '../../entities/report_phone.entity';
import { ReportWebsite } from '../../entities/report_website.entity';
import { ReportSocial } from '../../entities/report_social.entity';
import { ReportBankAccount } from '../../entities/report_bank_account.entity';
import { ReportEWallet } from '../../entities/report_e_wallet.entity';
import { User } from '../../entities/user.entity';
import { GetDetailBlacklistDto } from './dto/get-detail-blacklist.dto';
import { console } from 'inspector';
import { report } from 'process';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(ReportEmailAddress)
    private emailAddressRepository: Repository<ReportEmailAddress>,
    @InjectRepository(ReportPersonOrg)
    private personOrgRepository: Repository<ReportPersonOrg>,
    @InjectRepository(ReportPhone)
    private phoneRepository: Repository<ReportPhone>,
    @InjectRepository(ReportWebsite)
    private websiteRepository: Repository<ReportWebsite>,
    @InjectRepository(ReportSocial)
    private socialRepository: Repository<ReportSocial>,
    @InjectRepository(ReportBankAccount)
    private bankAccountRepository: Repository<ReportBankAccount>,
    @InjectRepository(ReportEWallet)
    private eWalletRepository: Repository<ReportEWallet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getBlacklist(dto: GetBlacklistDto): Promise<BlacklistResponseDto> {
    const {
      type,
      search,
      page = 1,
      limit = 10,
      sortBy = 'reportCount',
      sortOrder = 'desc',
    } = dto;

    let blacklistItems: BlacklistItemDto[] = [];

    if (type) {
      blacklistItems = await this.getBlacklistByType(type, search);
    } else {
      // Lấy tất cả các loại
      const allTypes = [
        'email_address',
        'phone',
        'website',
        'social',
        'bank_account',
        'e_wallet',
        'person_org',
      ];
      for (const reportType of allTypes) {
        const items = await this.getBlacklistByType(reportType as any, search);
        blacklistItems.push(...items);
      }
    }

    // Sort
    blacklistItems.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'latestReport') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const total = blacklistItems.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedItems = blacklistItems.slice(offset, offset + limit);

    return {
      data: paginatedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getDetailsByTypeAndValue(dto: GetDetailBlacklistDto) {
    const { type, value } = dto;

    let blacklistItems: BlacklistItemDto[] = [];

    if (type) {
      blacklistItems = await this.getBlacklistByType(type, value);
    } else {
      // Lấy tất cả các loại
      const allTypes = [
        'email_address',
        'phone',
        'website',
        'social',
        'bank_account',
        'e_wallet',
        'person_org',
      ];
      for (const reportType of allTypes) {
        const items = await this.getBlacklistByType(reportType as any, value);
        blacklistItems.push(...items);
      }
    }

    let reportList: Report[] = [];
    if (blacklistItems.length > 0) {
      switch (blacklistItems[0].type) {
        case 'email_address':
          reportList = await this.reportRepository
            .createQueryBuilder('a')
            .innerJoin('a.email_address', 'b')
            .where('a.report_type = :type', { type: ReportType.EMAIL_ADDRESS })
            .andWhere('b.email_address = :email', { email: value })
            .select(['a'])
            .getMany();
          break;
        case 'phone':
          reportList = await this.reportRepository
            .createQueryBuilder('a')
            .innerJoin('a.phone', 'b')
            .where('a.report_type = :type', { type: ReportType.PHONE })
            .andWhere('b.phone_number = :phone', { phone: value })
            .select(['a'])
            .getMany();
          break;
        case 'website':
          reportList = await this.reportRepository
            .createQueryBuilder('a')
            .innerJoin('a.website', 'b')
            .where('a.report_type = :type', { type: ReportType.WEBSITE })
            .andWhere('b.url = :url', { url: value })
            .select(['a'])
            .getMany();
          break;
        case 'social':
          reportList = await this.reportRepository
            .createQueryBuilder('a')
            .innerJoin('a.social', 'b')
            .where('a.report_type = :type', { type: ReportType.SOCIAL })
            .andWhere('b.username = :username', { username: value })
            .select(['a'])
            .getMany();
          break;
        case 'bank_account':
          reportList = await this.reportRepository
            .createQueryBuilder('a')
            .innerJoin('a.bank_account', 'b')
            .where('a.report_type = :type', { type: ReportType.BANK_ACCOUNT })
            .andWhere('b.account_number = :account_number', {
              account_number: value,
            })
            .select(['a'])
            .getMany();
          break;
        case 'e_wallet':
          reportList = await this.reportRepository
            .createQueryBuilder('a')
            .innerJoin('a.e_wallet', 'b')
            .where('a.report_type = :type', { type: ReportType.E_WALLET })
            .andWhere('b.wallet_id = :wallet_id', { wallet_id: value })
            .select(['a'])
            .getMany();
          break;
        case 'person_org':
          reportList = await this.reportRepository
            .createQueryBuilder('a')
            .innerJoin('a.person_org', 'b')
            .where('a.report_type = :type', { type: ReportType.PERSON_ORG })
            .andWhere('b.name = :name', { name: value })
            .select(['a'])
            .getMany();
          break;
        default:
          reportList = [];
          break;
      }
    }

    reportList = reportList.filter((r) => r.status !== 'rejected');
    const totalReports = reportList.length;
    const approvedReports = reportList.filter(
      (report) => report.status === 'approved',
    ).length;
    const pendingReports = reportList.filter(
      (report) => report.status === 'pending',
    ).length;

    return {
      blacklistItem: blacklistItems[0],
      reportList,
      reportStats: {
        totalReports,
        approvedReports,
        pendingReports,
      },
    };
  }

  private async getBlacklistByType(
    type: string,
    search?: string,
  ): Promise<BlacklistItemDto[]> {
    switch (type) {
      case 'email_address':
        return await this.getEmailBlacklist(search);
      case 'phone':
        return await this.getPhoneBlacklist(search);
      case 'website':
        return await this.getWebsiteBlacklist(search);
      case 'social':
        return await this.getSocialBlacklist(search);
      case 'bank_account':
        return await this.getBankAccountBlacklist(search);
      case 'e_wallet':
        return await this.getEWalletBlacklist(search);
      case 'person_org':
        return await this.getPersonOrgBlacklist(search);
      default:
        return [];
    }
  }

  private async getEmailBlacklist(
    search?: string,
  ): Promise<BlacklistItemDto[]> {
    const query = this.emailAddressRepository
      .createQueryBuilder('email')
      .innerJoin('email.report', 'report')
      .where('report.status = :status', { status: 'approved' })
      .select([
        'email.email_address as email_address',
        'COUNT(report.id) as reportCount',
        'MAX(report.updated_at) as latestReport',
      ])
      .groupBy('email.email_address');

    if (search) {
      query.andWhere('email.email_address LIKE :search', {
        search: `%${search}%`,
      });
    }

    const results = await query.getRawMany();

    return results.map((result) => ({
      value: result.email_address,
      type: 'email_address' as any,
      reportCount: parseInt(result.reportCount),
      latestReport: result.latestReport,
      email_address: {
        email_address: result.email_address,
      },
    }));
  }

  private async getPhoneBlacklist(
    search?: string,
  ): Promise<BlacklistItemDto[]> {
    const query = this.phoneRepository
      .createQueryBuilder('phone')
      .innerJoin('phone.report', 'report')
      .where('report.status = :status', { status: 'approved' })
      .select([
        'phone.phone_number as phone_number',
        'COUNT(report.id) as reportCount',
        'MAX(report.updated_at) as latestReport',
      ])
      .groupBy('phone.phone_number');

    if (search) {
      query.andWhere('phone.phone_number LIKE :search', {
        search: `%${search}%`,
      });
    }

    const results = await query.getRawMany();

    return results.map((result) => ({
      value: result.phone_number,
      type: 'phone' as any,
      reportCount: parseInt(result.reportCount),
      latestReport: result.latestReport,
      phone: {
        phone_number: result.phone_number,
      },
    }));
  }

  private async getWebsiteBlacklist(
    search?: string,
  ): Promise<BlacklistItemDto[]> {
    const query = this.websiteRepository
      .createQueryBuilder('website')
      .innerJoin('website.report', 'report')
      .where('report.status = :status', { status: 'approved' })
      .select([
        'website.url as url',
        'COUNT(report.id) as reportCount',
        'MAX(report.updated_at) as latestReport',
      ])
      .groupBy('website.url');

    if (search) {
      query.andWhere('website.url LIKE :search', { search: `%${search}%` });
    }

    const results = await query.getRawMany();

    return results.map((result) => ({
      value: result.url,
      type: 'website' as any,
      reportCount: parseInt(result.reportCount),
      latestReport: result.latestReport,
      website: {
        url: result.url,
      },
    }));
  }

  private async getSocialBlacklist(
    search?: string,
  ): Promise<BlacklistItemDto[]> {
    const query = this.socialRepository
      .createQueryBuilder('social')
      .innerJoin('social.report', 'report')
      .where('report.status = :status', { status: 'approved' })
      .select([
        'social.platform as platform',
        'social.profile_url as profile_url',
        'social.username as username',
        'COUNT(report.id) as reportCount',
        'MAX(report.updated_at) as latestReport',
      ])
      .groupBy('social.platform, social.profile_url, social.username');

    if (search) {
      query.andWhere(
        '(social.username LIKE :search OR social.profile_url LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const results = await query.getRawMany();

    return results.map((result) => ({
      value: result.username || result.profile_url,
      type: 'social' as any,
      reportCount: parseInt(result.reportCount),
      latestReport: result.latestReport,
      social: {
        platform: result.platform,
        profile_url: result.profile_url,
        username: result.username,
      },
    }));
  }

  private async getBankAccountBlacklist(
    search?: string,
  ): Promise<BlacklistItemDto[]> {
    const query = this.bankAccountRepository
      .createQueryBuilder('bank')
      .innerJoin('bank.report', 'report')
      .where('report.status = :status', { status: 'approved' })
      .select([
        'bank.bank_name as bank_name',
        'bank.account_number as account_number',
        'bank.account_holder_name as account_holder_name',
        'COUNT(report.id) as reportCount',
        'MAX(report.updated_at) as latestReport',
      ])
      .groupBy('bank.bank_name, bank.account_number, bank.account_holder_name');

    if (search) {
      query.andWhere(
        '(bank.account_number LIKE :search OR bank.account_holder_name LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const results = await query.getRawMany();

    return results.map((result) => ({
      value: result.account_number,
      type: 'bank_account' as any,
      reportCount: parseInt(result.reportCount),
      latestReport: result.latestReport,
      bank_account: {
        bank_name: result.bank_name,
        account_number: result.account_number,
        account_holder_name: result.account_holder_name,
      },
    }));
  }

  private async getEWalletBlacklist(
    search?: string,
  ): Promise<BlacklistItemDto[]> {
    const query = this.eWalletRepository
      .createQueryBuilder('wallet')
      .innerJoin('wallet.report', 'report')
      .where('report.status = :status', { status: 'approved' })
      .select([
        'wallet.wallet_type as wallet_type',
        'wallet.wallet_id as wallet_id',
        'wallet.account_holder_name as account_holder_name',
        'COUNT(report.id) as reportCount',
        'MAX(report.updated_at) as latestReport',
      ])
      .groupBy(
        'wallet.wallet_type, wallet.wallet_id, wallet.account_holder_name',
      );

    if (search) {
      query.andWhere(
        '(wallet.wallet_id LIKE :search OR wallet.account_holder_name LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const results = await query.getRawMany();

    return results.map((result) => ({
      value: result.wallet_id,
      type: 'e_wallet' as any,
      reportCount: parseInt(result.reportCount),
      latestReport: result.latestReport,
      e_wallet: {
        wallet_type: result.wallet_type,
        wallet_id: result.wallet_id,
        account_holder_name: result.account_holder_name,
      },
    }));
  }

  private async getPersonOrgBlacklist(
    search?: string,
  ): Promise<BlacklistItemDto[]> {
    const query = this.personOrgRepository
      .createQueryBuilder('person')
      .innerJoin('person.report', 'report')
      .where('report.status = :status', { status: 'approved' })
      .select([
        'person.name as name',
        'person.role as role',
        'person.identification as identification',
        'person.address as address',
        'person.phone_number as phone_number',
        'person.email_address as email_address',
        'COUNT(report.id) as reportCount',
        'MAX(report.updated_at) as latestReport',
      ])
      .groupBy(
        'person.name, person.role, person.identification, person.address, person.phone_number, person.email_address',
      );

    if (search) {
      query.andWhere(
        '(person.name LIKE :search OR person.identification LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const results = await query.getRawMany();

    return results.map((result) => ({
      value: result.name,
      type: 'person_org' as any,
      reportCount: parseInt(result.reportCount),
      latestReport: result.latestReport,
      person_org: {
        name: result.name,
        role: result.role,
        identification: result.identification,
        address: result.address,
        phone_number: result.phone_number,
        email_address: result.email_address,
      },
    }));
  }
  async getBlacklistStats() {
    const [totalItems, totalReports, totalUsers] = await Promise.all([
      this.getBlacklistItemCount(),
      this.reportRepository.count(),
      this.userRepository.count(),
    ]);

    return {
      totalItems,
      totalReports,
      totalUsers,
    };
  }

  private async getBlacklistItemCount() {
    let count = 0;
    const allTypes = [
      'email_address',
      'phone',
      'website',
      'social',
      'bank_account',
      'e_wallet',
      'person_org',
    ];

    for (const type of allTypes) {
      const data = await this.getBlacklistByType(type);
      count += await data.length;
    }

    return count;
  }
}
