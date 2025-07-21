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
