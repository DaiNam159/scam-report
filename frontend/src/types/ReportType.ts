// Định nghĩa ReportType là union type thay vì enum để dùng string value
export type ReportType =
  | "email_content"
  | "email_address"
  | "sms"
  | "phone"
  | "person_org"
  | "website"
  | "social"
  | "bank_account"
  | "e_wallet";

export interface ReportFormProps {
  type: ReportType;
}
export enum ReportStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

export interface ReportSubmit {
  reportType: ReportType;
  title: string;
  description: string;
  evidence: string;
  evidencePublicId: string;
  emailAddress: string;
  name: string;
  role: string;
  identification: string;
  address: string;
  socialLinks: string;
  emailSubject: string;
  emailBody: string;
  senderAddress: string;
  attachments: string;
  suspiciousLinks: string;
  phoneNumber: string;
  smsContent: string;
  websiteUrl: string;
  platform: string;
  profileUrl: string;
  username: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  walletType: string;
  walletId: string;
  contact: string;
}

export interface ReportResponse {
  id: number;
  reportType: ReportType;
  title: string;
  description: string;
  evidence: string;
  evidencePublicId: string;
  emailAddress: string;
  user_ip: string;
  status: ReportStatus;
  contact: string;
  created_at: string;
  updated_at: string;
}
