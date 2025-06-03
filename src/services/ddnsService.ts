import { CloudflareService } from './cloudflareService';
import { IPService } from './ipService';
import { DNSRecord } from '../types';
import { config } from '../config/environment';

export class DDNSService {
  private cloudflareService: CloudflareService;
  private ipService: IPService;

  constructor() {
    this.cloudflareService = new CloudflareService();
    this.ipService = new IPService();
  }

  async initialize(): Promise<{ zoneId: string; record: DNSRecord }> {
    const zoneId = await this.cloudflareService.getZoneId();
    const record = await this.cloudflareService.getRecord(zoneId);

    console.log(`🎯 Current record IP: ${record.ip}`);

    return { zoneId, record };
  }

  async checkAndUpdateIP(zoneId: string, record: DNSRecord): Promise<boolean> {
    const currentIP = await this.ipService.getPublicIP();

    if (currentIP !== record.ip) {
      console.log(`🌐 IP changed to ${currentIP}, updating...`);
      await this.cloudflareService.updateRecord(zoneId, record.id, currentIP);
      record.ip = currentIP;
      console.log(`✅ Record updated.`);
      return true;
    } else {
      console.log(`⏳ IP unchanged: ${currentIP}`);
      return false;
    }
  }

  async startLoop(): Promise<void> {
    const { zoneId, record } = await this.initialize();

    while (true) {
      try {
        await this.checkAndUpdateIP(zoneId, record);
      } catch (error) {
        console.error('❌ Error in update loop:', error);
      }

      await this.sleep(config.ddns.updateIntervalMs);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
