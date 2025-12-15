export type WeeklyReportStat = {
  date: string;
  count: number;
};

export type WeeklyReportChartItem = {
  label: string;
  date: string;
  day: string;
  month: string;
  year: string;
  value: number;
};

export const WEEKDAY_LABELS = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'CN',
];
