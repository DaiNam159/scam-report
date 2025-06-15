import { IsOptional, IsString } from 'class-validator';

export class PhoneDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
