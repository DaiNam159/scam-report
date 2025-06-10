// Định nghĩa ReportType là union type thay vì enum để dùng string value
export type ReportType =
  | "email_content"
  | "email_address"
  | "sms"
  | "phone_number"
  | "person"
  | "website"
  | "social_profile"
  | "bank_account"
  | "e_wallet";

export interface ReportFormProps {
  type: ReportType;
}
