import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ReportType } from '../../../types/report.type';

export class GetBlacklistDto {
  @IsOptional()
  @IsEnum([
    'email_address',
    'phone',
    'website',
    'social',
    'bank_account',
    'e_wallet',
    'person_org',
    'other',
  ])
  type?: ReportType;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(['reportCount', 'latestReport', 'value'])
  sortBy?: 'reportCount' | 'latestReport' | 'value' = 'reportCount';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export interface BlacklistResponseDto {
  data: BlacklistItemDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BlacklistItemDto {
  value: string;
  type: ReportType;
  reportCount: number;
  latestReport: string;

  // Thông tin chi tiết tùy theo type
  email_address?: {
    email_address: string;
    sender_address?: string;
  };

  person_org?: {
    name: string;
    role: string;
    identification: string;
    address: string;
    phone_number: string;
    email_address: string;
  };

  phone?: {
    phone_number: string;
  };

  website?: {
    url: string;
  };

  social?: {
    platform: string;
    profile_url: string;
    username: string;
  };

  bank_account?: {
    bank_name: string;
    account_number: string;
    account_holder_name: string;
  };

  e_wallet?: {
    wallet_type: string;
    wallet_id: string;
    account_holder_name: string;
  };
}
