import { IsOptional, IsString } from 'class-validator';

export class GetDetailBlacklistDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  value?: string;
}
