export interface DomainAge {
  human: string;
  timestamp: number;
  iso: string;
}

export interface ScanDetails {
  message: string;
  success: boolean;
  unsafe: boolean;
  domain: string;
  root_domain: string;
  ip_address: string;
  server: string;
  content_type: string;
  status_code: number;
  page_size: number;
  domain_rank: number;
  dns_valid: boolean;
  parking: boolean;
  spamming: boolean;
  malware: boolean;
  phishing: boolean;
  suspicious: boolean;
  adult: boolean;
  risk_score: number;
  country_code: string;
  category: string;
  domain_age: DomainAge;
  domain_trust: string;
  redirected: boolean;
  short_link_redirect: boolean;
  hosted_content: boolean;
  page_title: string;
  risky_tld: boolean;
  spf_record: boolean;
  dmarc_record: boolean;
  technologies: string[];
  a_records: string[];
  mx_records: string[];
  ns_records: string[];
  language_code: string;
  final_url: string;
  scanned_url: string;
  request_id: string;
  provider: string;
  url: string;
  summary: {
    harmless: number;
    malicious: number;
    suspicious: number;
    undetected: number;
    timeout: number;
    total: number;
  };
  verdict: string;
  maliciousEngines?: maliciousEngineData[];
  scannedAt: string;
}

export interface maliciousEngineData {
  engine: string;
  result: string;
}

export interface GoogleSafeBrowsingMatch {
  threatType: string;
  platformType: string;
  threat: { url: string };
  cacheDuration: string;
  threatEntryType: string;
}

export interface ApiResult {
  name: string;
  loading: boolean;
  result?: {
    isSafe: boolean;
    matches?: GoogleSafeBrowsingMatch[] | null | undefined;
    error?: string;
    details?: ScanDetails | null | undefined;
  };
}
