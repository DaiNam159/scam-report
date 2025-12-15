import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CheckSpamReportsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  userIp?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minutes: number;
}
