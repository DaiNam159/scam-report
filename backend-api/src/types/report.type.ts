export type ReportType =
  | 'email_address'
  | 'phone'
  | 'website'
  | 'social'
  | 'bank_account'
  | 'e_wallet'
  | 'person_org'
  | 'other';

export type ReportStatus = 'pending' | 'approved' | 'rejected';
