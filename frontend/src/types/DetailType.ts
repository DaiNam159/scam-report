import { ReportType } from "./ReportType";

export interface DetailItem {
  id: string;
  value: string;
  type: ReportType;
  reportCount: number;
  latestReport: string;
  verifiedReports: Report[];
  unverifiedReports: Report[];
}

export interface Report {
  id: string;
  reporter: string; // hoặc ẩn danh
  message: string;
  date: string;
  verified: boolean;
  trustScore: number; // ví dụ: từ 1-5
}
