import { IsOptional, IsString } from 'class-validator';

export class SmsDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  smsContent?: string;
}
