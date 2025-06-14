import { IsOptional, IsString } from 'class-validator';

export class WebsiteDto {
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  screenshotUrl?: string;
}
