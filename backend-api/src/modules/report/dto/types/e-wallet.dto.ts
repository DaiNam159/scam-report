import { IsOptional, IsString } from 'class-validator';

export class EWalletDto {
  @IsOptional()
  @IsString()
  walletType?: string;

  @IsOptional()
  @IsString()
  walletId?: string;

  @IsOptional()
  @IsString()
  accountHolderName?: string;
}
