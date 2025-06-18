import { ReportType } from "./ReportType";

export interface DetailItem {
  id: number;
  value: string;
  type: ReportType;
  reportCount: number;
  latestReport: string;
  verifiedReports: Report[];
  unverifiedReports: Report[];
}

export interface Report {
  id: number;
  reporter: string; // hoặc ẩn danh
  message: string;
  date: string;
  verified: boolean;
  trustScore: number; // ví dụ: từ 1-5
}
