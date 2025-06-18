import { ReportStatus, ReportType } from "@/types/ReportType";

export interface Report {
  id: number;
  report_type: ReportType;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  evidence: string;
  user_ip: string;
  contact: string;
  status: ReportStatus;

  user: {
    id: number;
    email: string;
    fullName: string | null;
  };

  // Các thông tin bổ sung tùy loại báo cáo:
  email_address?: {
    email_address: string;
  };

  person_org?: {
    name: string;
    role: string;
    identification: string;
    address: string;
    phone_number: string;
    email_address: string;
    social_links: string;
  };

  email_content?: {
    email_subject: string;
    email_body: string;
    sender_address: string;
    attachments: string;
    suspicious_links: string;
  };

  phone?: {
    phone_number: string;
  };

  sms?: {
    phone_number: string;
    sms_content: string;
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
