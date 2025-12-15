import { BlacklistItem } from "./BlacklistType";
import { ReportResponse } from "./ReportType";

export interface BlackListDetailType {
  blacklistItem: BlacklistItem;
  reportList: ReportResponse[];
  reportStats: {
    totalReports: number;
    approvedReports: number;
    pendingReports: number;
  };
}
