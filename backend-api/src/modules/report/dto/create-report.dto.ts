import { BaseReportDto } from './base-report.dto';
import { EmailAddressDto } from './types/email-address.dto';
import { EmailContentDto } from './types/email-content.dto';
import { PhoneDto } from './types/phone.dto';
import { SmsDto } from './types/sms.dto';
import { WebsiteDto } from './types/website.dto';
import { SocialDto } from './types/social.dto';
import { BankAccountDto } from './types/bank-account.dto';
import { EWalletDto } from './types/e-wallet.dto';
import { PersonOrgDto } from './types/person-org.dto';

export class CreateReportDto
  extends BaseReportDto
  implements
    EmailAddressDto,
    EmailContentDto,
    PhoneDto,
    SmsDto,
    WebsiteDto,
    SocialDto,
    BankAccountDto,
    EWalletDto,
    PersonOrgDto
{
  // Gộp các trường
  emailAddress?: string;

  emailSubject?: string;
  emailBody?: string;
  senderAddress?: string;
  attachments?: string;
  suspiciousLinks?: string;

  phoneNumber?: string;
  smsContent?: string;

  websiteUrl?: string;

  platform?: string;
  profileUrl?: string;
  username?: string;
  socialLinks?: string;

  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;

  walletType?: string;
  walletId?: string;

  name?: string;
  role?: string;
  identification?: string;
  address?: string;
}
