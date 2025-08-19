import { ReportType } from "./ReportType";

export interface BlacklistItem {
  value: string;
  type: ReportType;
  reportCount: number;
  latestReport: string;

  // Thông tin chi tiết cho từng loại báo cáo
  email_address?: {
    email_address: string;
    sender_address?: string;
  };

  person_org?: {
    name: string;
    role: string;
    identification: string;
    address: string;
    phone_number: string;
    email_address: string;
  };

  phone?: {
    phone_number: string;
  };

  website?: {
    url: string;
  };

  social?: {
    platform: string;
    profile_url: string;
    username: string;
  };

  bank_account?: {
    bank_name: string;
    account_number: string;
    account_holder_name: string;
  };

  e_wallet?: {
    wallet_type: string;
    wallet_id: string;
    account_holder_name: string;
  };
}
