import { ReportType } from "./ReportType";

export interface BlacklistItem {
  value: string;
  type: ReportType;
  reportCount: number;
  latestReport: string;
}
