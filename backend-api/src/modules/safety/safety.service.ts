import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Stats } from 'src/entities/stats.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class SafetyService {
  private readonly safe_browsing_apiKey: string;
  private readonly ipqs_apiKey: string;
  private readonly screenshot_apiKey: string;
  private readonly urlscan_apiKey: string;

  private readonly endpoint =
    'https://safebrowsing.googleapis.com/v4/threatMatches:find';
  private readonly urlscanEndpoint = 'https://urlscan.io/api/v1/scan/';
  private readonly ipqsEndpoint = 'https://ipqualityscore.com/api/json/url';
  private readonly screenshotEndpoint =
    'https://shot.screenshotapi.net/screenshot';
  constructor(
    private configService: ConfigService,
    @InjectRepository(Stats)
    private statsRepo: Repository<Stats>,
  ) {
    this.safe_browsing_apiKey =
      process.env.SAFETY_API_KEY ||
      this.configService.get<string>('SAFETY_API_KEY') ||
      '';
    this.ipqs_apiKey =
      process.env.IPQS_API_KEY ||
      this.configService.get<string>('IPQS_API_KEY') ||
      '';
    this.screenshot_apiKey =
      process.env.SCREENSHOT_API_KEY ||
      this.configService.get<string>('SCREENSHOT_API_KEY') ||
      '';
    this.urlscan_apiKey =
      process.env.URLSCAN_API_KEY ||
      this.configService.get<string>('URLSCAN_API_KEY') ||
      '';
  }

  async checkUrlWithSafeBrowsing(url: string): Promise<{
    url: string;
    isSafe: boolean;
    matches?: any[];
  }> {
    const body = {
      client: {
        clientId: 'NdnCloudSql',
        clientVersion: '1.0',
      },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },
    };

    try {
      const stats = await this.statsRepo.findOne({
        where: { id: 1 },
      });
      if (!stats) {
        throw new Error('Stats not found');
      }
      stats.lookup_count++;
      await this.statsRepo.save(stats);
      const res = await axios.post(
        `${this.endpoint}?key=${this.safe_browsing_apiKey}`,
        body,
      );
      const matches = res.data.matches;
      if (matches && matches.length > 0) {
        return {
          url,
          isSafe: false,
          matches,
        };
      }

      return {
        url,
        isSafe: true,
        matches: [],
      };
    } catch (err) {
      console.error('Error checking URL:', err.message);
      return {
        url,
        isSafe: false,
        matches: [],
      };
    }
  }
  async checkUrlWithIPQS(url: string) {
    try {
      const apiUrl = `${this.ipqsEndpoint}/${this.ipqs_apiKey}/${encodeURIComponent(url)}?strictness=1&fast=true`;

      const res = await fetch(apiUrl);
      const data = await res.json();
      return { url, isSafe: !data.unsafe, details: data };
    } catch (err) {
      console.error('Error checking URL with IPQS:', err.message);
      return {
        url,
        isSafe: false,
        matches: [],
      };
    }
  }

  async screenshotUrl(url: string) {
    try {
      // 1. Gửi request scan
      const scanRes = await fetch(this.urlscanEndpoint, {
        method: 'POST',
        headers: {
          'API-Key': this.urlscan_apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          visibility: 'private',
        }),
      });

      const scanData = await scanRes.json();

      if (!scanRes.ok) {
        throw new HttpException(scanData, scanRes.status);
      }

      const uuid = scanData.uuid;
      const resultUrl = `https://urlscan.io/api/v1/result/${uuid}/`;

      // 2. Polling để chờ scan hoàn thành
      const maxRetries = 20; // Thử tối đa 20 lần (khoảng 2 phút)
      const retryDelay = 6000; // Chờ 6 giây giữa mỗi lần thử

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(
          `Attempt ${attempt}/${maxRetries} - Checking scan result...`,
        );

        try {
          const resultRes = await fetch(resultUrl);

          if (resultRes.status === 200) {
            // Scan đã hoàn thành
            const resultData = await resultRes.json();

            // Kiểm tra screenshot có tồn tại không
            const screenshotUrl = `https://urlscan.io/screenshots/${uuid}.png`;
            const screenshotCheck = await fetch(screenshotUrl, {
              method: 'HEAD',
            });

            return {
              uuid,
              screenshotURL:
                screenshotCheck.status === 200 ? screenshotUrl : null,
              status: 'completed',
            };
          } else if (resultRes.status === 404) {
            // Scan chưa hoàn thành, tiếp tục chờ
            console.log(
              `Scan not finished yet, waiting ${retryDelay / 1000}s before retry...`,
            );

            if (attempt < maxRetries) {
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              continue;
            } else {
              // Đã thử hết số lần cho phép
              throw new HttpException(
                'Scan timeout: Website scan is taking too long to complete',
                HttpStatus.REQUEST_TIMEOUT,
              );
            }
          } else if (resultRes.status === 410) {
            // Scan result đã bị xóa
            throw new HttpException(
              'Scan result has been deleted',
              HttpStatus.GONE,
            );
          } else {
            // Lỗi khác
            throw new HttpException(
              `Unexpected response status: ${resultRes.status}`,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        } catch (fetchError) {
          if (attempt === maxRetries) {
            throw fetchError;
          }
          console.log(`Network error on attempt ${attempt}, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    } catch (error) {
      console.error('Error in screenshotUrl:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to scan website: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async screenshotUrlWithScrollPositions(
    url: string,
    options?: {
      scrollPositions?: number[]; // % scroll (0-100)
      viewportWidth?: number;
      viewportHeight?: number;
      delay?: number; // delay sau khi scroll (ms)
    },
  ) {
    try {
      const scrollPositions = options?.scrollPositions || [0, 25, 50, 75, 100];
      const viewportWidth = options?.viewportWidth || 1920;
      const viewportHeight = options?.viewportHeight || 1080;
      const scrollDelay = options?.delay || 3000;

      console.log(
        `Taking screenshots at ${scrollPositions.length} scroll positions for: ${url}`,
      );

      type ScreenshotResult = {
        scrollPosition: number;
        uuid?: string;
        screenshotURL?: string | null;
        resultURL?: string;
        domURL?: string;
        status: string;
        error?: string;
      };

      const results: ScreenshotResult[] = [];

      for (let i = 0; i < scrollPositions.length; i++) {
        const scrollPercent = scrollPositions[i];

        try {
          console.log(
            `Taking screenshot at ${scrollPercent}% scroll position (${i + 1}/${scrollPositions.length})`,
          );

          // 1. Gửi request scan với scroll position
          const scanRes = await fetch(this.urlscanEndpoint, {
            method: 'POST',
            headers: {
              'API-Key': this.urlscan_apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url,
              visibility: 'private',
              // Thêm user agent để tránh bị block
              customagent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              // URLScan.io không trực tiếp hỗ trợ scroll, nhưng chúng ta có thể dùng delay
              // và sau đó crop ảnh theo vị trí
              referer: url,
              tags: [`scroll-${scrollPercent}`, 'multi-screenshot'],
            }),
          });

          const scanData = await scanRes.json();

          if (!scanRes.ok) {
            console.error(
              `Failed to start scan for ${scrollPercent}% scroll:`,
              scanData,
            );
            results.push({
              scrollPosition: scrollPercent,
              error: scanData.message || 'Failed to start scan',
              status: 'failed',
            });
            continue;
          }

          // 2. Chờ scan hoàn thành
          const scanResult = await this.waitForScanCompletion(
            scanData.uuid,
            scrollPercent,
            scrollDelay,
          );

          if (scanResult) {
            results.push({
              scrollPosition: scrollPercent,
              ...scanResult,
            });
          } else {
            results.push({
              scrollPosition: scrollPercent,
              error: 'Scan failed or timed out',
              status: 'failed',
            });
          }

          // Delay giữa các scan để tránh rate limiting
          if (i < scrollPositions.length - 1) {
            console.log(
              'Waiting 5 seconds before next scan to avoid rate limiting...',
            );
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        } catch (error) {
          console.error(
            `Error taking screenshot at ${scrollPercent}% scroll:`,
            error,
          );
          results.push({
            scrollPosition: scrollPercent,
            error: error.message,
            status: 'failed',
          });
        }
      }

      return {
        url,
        scrollPositions,
        screenshots: results,
        totalSuccessful: results.filter((r) => r.status === 'completed').length,
        totalFailed: results.filter((r) => r.status === 'failed').length,
        status: results.some((r) => r.status === 'completed')
          ? 'partial_success'
          : 'failed',
      };
    } catch (error) {
      console.error('Error in screenshotUrlWithScrollPositions:', error);
      throw new HttpException(
        'Failed to take multiple screenshots: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Helper method để chờ scan completion
  private async waitForScanCompletion(
    uuid: string,
    scrollPosition: number,
    delay: number = 3000,
  ) {
    const resultUrl = `https://urlscan.io/api/v1/result/${uuid}/`;
    const maxRetries = 15; // Giảm số retry cho multiple scans
    const retryDelay = 5000; // 5 giây

    // Chờ thêm delay cho scan có thời gian xử lý
    await new Promise((resolve) => setTimeout(resolve, delay));

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(
        `Scroll ${scrollPosition}% - Attempt ${attempt}/${maxRetries} - Checking scan result...`,
      );

      try {
        const resultRes = await fetch(resultUrl);

        if (resultRes.status === 200) {
          const resultData = await resultRes.json();

          // Kiểm tra screenshot có tồn tại không
          const screenshotUrl = `https://urlscan.io/screenshots/${uuid}.png`;
          const screenshotCheck = await fetch(screenshotUrl, {
            method: 'HEAD',
          });

          return {
            uuid,
            screenshotURL:
              screenshotCheck.status === 200 ? screenshotUrl : null,
            resultURL: `https://urlscan.io/result/${uuid}/`,
            domURL: `https://urlscan.io/dom/${uuid}/`,
            status: 'completed',
            scanData: {
              page: resultData.page,
              stats: resultData.stats,
              meta: resultData.meta,
            },
          };
        } else if (resultRes.status === 404) {
          // Scan chưa hoàn thành
          if (attempt < maxRetries) {
            console.log(
              `Scroll ${scrollPosition}% - Scan not finished, waiting ${retryDelay / 1000}s...`,
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          } else {
            console.log(
              `Scroll ${scrollPosition}% - Scan timeout after ${maxRetries} attempts`,
            );
            return {
              uuid,
              error: 'Scan timeout',
              status: 'timeout',
            };
          }
        } else if (resultRes.status === 410) {
          return {
            uuid,
            error: 'Scan result deleted',
            status: 'deleted',
          };
        } else {
          return {
            uuid,
            error: `Unexpected response status: ${resultRes.status}`,
            status: 'error',
          };
        }
      } catch (fetchError) {
        console.error(
          `Scroll ${scrollPosition}% - Fetch error on attempt ${attempt}:`,
          fetchError.message,
        );
        if (attempt === maxRetries) {
          return {
            uuid,
            error: fetchError.message,
            status: 'error',
          };
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    return null;
  }

  // Method để chụp full page với automatic scroll detection
  async screenshotUrlFullPage(url: string, sections: number = 5) {
    const scrollPositions: number[] = [];

    // Tạo các vị trí scroll đều nhau
    for (let i = 0; i <= sections; i++) {
      scrollPositions.push(Math.round((i / sections) * 100));
    }

    return this.screenshotUrlWithScrollPositions(url, {
      scrollPositions,
      delay: 4000, // Delay lâu hơn cho full page
    });
  }

  async screenshotWebsite(url: string) {
    try {
      const params = {
        token: this.screenshot_apiKey,
        url,
        full_page: true,
        fresh: true,
        output: 'image', // hoặc 'json'
      };

      const response = await axios.get(this.screenshotEndpoint, {
        params,
        responseType: 'arraybuffer', // lấy dữ liệu binary
      });

      return response.data;
    } catch (error) {
      console.error('Error taking screenshot:', error);
      throw new Error('Failed to take screenshot');
    }
  }
}
