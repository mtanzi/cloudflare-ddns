import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  cloudflare: {
    apiToken: process.env.CF_API_TOKEN!,
    zoneName: process.env.CF_ZONE_NAME!,
    recordName: process.env.CF_RECORD_NAME!,
    apiBase: 'https://api.cloudflare.com/client/v4',
  },
  ddns: {
    updateIntervalMs: 60 * 60 * 1000, // 1 hour
  },
} as const;
