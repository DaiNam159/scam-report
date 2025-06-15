import { IsOptional, IsString } from 'class-validator';

export class EmailAddressDto {
  @IsOptional()
  @IsString()
  emailAddress?: string;
}
