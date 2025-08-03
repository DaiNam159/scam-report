import { IsEnum, IsOptional, IsString, IsInt } from 'class-validator';

export class BaseReportDto {
  @IsEnum([
    'email_content',
    'email_address',
    'phone',
    'sms',
    'website',
    'social',
    'bank_account',
    'e_wallet',
    'person_org',
  ])
  reportType: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  evidence?: string;

  @IsOptional()
  @IsString()
  evidencePublicId?: string;

  @IsOptional()
  @IsString()
  userIp?: string;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status: string = 'pending';

  @IsOptional()
  @IsString()
  contact: string;
}
