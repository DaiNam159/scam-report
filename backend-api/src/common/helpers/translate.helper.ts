/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Mapping chuẩn hóa các kết quả bảo mật → Tiếng Việt
 */
const RESULT_TRANSLATIONS: Record<string, string> = {
  phishing: 'Lừa đảo',
  malware: 'Mã độc',
  trojan: 'Mã độc ngụy trang',
  ransomware: 'Mã độc tống tiền',
  spyware: 'Phần mềm gián điệp',
  adware: 'Phần mềm quảng cáo độc hại',
  scam: 'Lừa đảo',
  fraud: 'Gian lận',
  spam: 'Thư rác / Spam',
  botnet: 'Mạng botnet',
  exploit: 'Khai thác lỗ hổng',
  suspicious: 'Đáng ngờ',
  malicious: 'Nguy hiểm',
  clean: 'An toàn',
  safe: 'An toàn',
  harmless: 'An toàn',
  unknown: 'Không xác định',
};

/**
 * Mapping mức độ đánh giá
 */
const CATEGORY_TRANSLATIONS: Record<string, string> = {
  malicious: 'Nguy hiểm',
  suspicious: 'Đáng ngờ',
  harmless: 'An toàn',
  undetected: 'Chưa phát hiện',
  clean: 'An toàn',
  safe: 'An toàn',
  unknown: 'Không xác định',
};

/**
 * Dịch result / verdict / category từ mọi provider
 */
export function translateSecurityResult(input?: string): string {
  if (!input) return 'Không xác định';

  const key = input.toLowerCase().trim();
  return RESULT_TRANSLATIONS[key] || input;
}

/**
 * Dịch category / severity
 */
export function translateSecurityCategory(input?: string): string {
  if (!input) return 'Không xác định';

  const key = input.toLowerCase().trim();
  return CATEGORY_TRANSLATIONS[key] || input;
}

/**
 * Tự động dịch mọi field string trong object (optional)
 * dùng khi provider trả về rất nhiều text
 */
export function deepTranslateObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepTranslateObject);
  }

  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === 'string'
          ? translateSecurityResult(value)
          : deepTranslateObject(value),
      ]),
    );
  }

  return obj;
}
