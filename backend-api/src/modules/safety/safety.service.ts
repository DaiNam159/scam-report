import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SafetyService {
  private readonly apiKey: string;
  private readonly endpoint =
    'https://safebrowsing.googleapis.com/v4/threatMatches:find';

  constructor(private configService: ConfigService) {
    this.apiKey =
      this.configService.get<string>('GOOGLE_SAFE_BROWSING_API_KEY') || '';
  }

  async checkUrl(url: string): Promise<{
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
      const res = await axios.post(`${this.endpoint}?key=${this.apiKey}`, body);
      const matches = res.data.matches;
      console.log('Using API KEY:', this.apiKey);
      console.log('Matches found:', res.data);
      if (matches && matches.length > 0) {
        return {
          url,
          isSafe: false,
          matches, // 👈 Trả về thông tin đe doạ
        };
      }

      return {
        url,
        isSafe: true,
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
}
