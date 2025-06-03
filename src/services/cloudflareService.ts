import axios, { AxiosInstance } from 'axios';
import { config } from '../config/environment';
import { CloudflareResponse, CloudflareZone, CloudflareDNSRecord, DNSRecord } from '../types';

export class CloudflareService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.cloudflare.apiBase,
      headers: {
        Authorization: `Bearer ${config.cloudflare.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getZoneId(): Promise<string> {
    try {
      const response = await this.api.get<CloudflareResponse<CloudflareZone[]>>('/zones', {
        params: { name: config.cloudflare.zoneName },
      });

      const zone = response.data.result[0];
      if (!zone) {
        throw new Error(`Zone ${config.cloudflare.zoneName} not found`);
      }

      return zone.id;
    } catch (error) {
      throw new Error(`Failed to get zone ID: ${error}`);
    }
  }

  async getRecord(zoneId: string): Promise<DNSRecord> {
    try {
      const response = await this.api.get<CloudflareResponse<CloudflareDNSRecord[]>>(
        `/zones/${zoneId}/dns_records`,
        {
          params: {
            name: config.cloudflare.recordName,
            type: 'A',
          },
        },
      );

      const record = response.data.result[0];
      if (!record) {
        throw new Error(`DNS record ${config.cloudflare.recordName} not found`);
      }

      return {
        id: record.id,
        ip: record.content,
      };
    } catch (error) {
      throw new Error(`Failed to get DNS record: ${error}`);
    }
  }

  async updateRecord(zoneId: string, recordId: string, newIP: string): Promise<void> {
    try {
      await this.api.put(`/zones/${zoneId}/dns_records/${recordId}`, {
        type: 'A',
        name: config.cloudflare.recordName,
        content: newIP,
        ttl: 1,
        proxied: false,
      });
    } catch (error) {
      throw new Error(`Failed to update DNS record: ${error}`);
    }
  }
}
