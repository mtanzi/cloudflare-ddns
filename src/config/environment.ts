import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment-specific .env file
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;

// Try to load environment-specific file first, then fallback to .env
try {
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
} catch {
  dotenv.config();
}

export const config = {
  cloudflare: {
    apiToken: process.env.CF_API_TOKEN!,
    zoneName: process.env.CF_ZONE_NAME!,
    recordName: process.env.CF_RECORD_NAME!,
    apiBase: 'https://api.cloudflare.com/client/v4',
  },
  ddns: {
    updateIntervalMs: parseInt(process.env.DDNS_UPDATE_INTERVAL_MS || '3600000', 10),
  },
} as const;
