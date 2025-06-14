import { IsOptional, IsString, IsJSON } from 'class-validator';

export class EmailContentDto {
  @IsOptional()
  @IsString()
  emailSubject?: string;

  @IsOptional()
  @IsString()
  emailBody?: string;

  @IsOptional()
  @IsString()
  senderAddress?: string;

  @IsOptional()
  @IsJSON()
  attachments?: string;

  @IsOptional()
  @IsJSON()
  suspiciousLinks?: string;
}
