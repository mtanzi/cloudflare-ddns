import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const CF_API_TOKEN = process.env.CF_API_TOKEN!;
const CF_ZONE_NAME = process.env.CF_ZONE_NAME!;
const CF_RECORD_NAME = process.env.CF_RECORD_NAME!;

const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

async function getPublicIP(): Promise<string> {
  const { data } = await axios.get('https://api.ipify.org?format=json');
  return data.ip;
}

async function getZoneId(): Promise<string> {
  const res = await axios.get(`${CF_API_BASE}/zones`, {
    headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    params: { name: CF_ZONE_NAME },
  });
  return res.data.result[0].id;
}

async function getRecord(zoneId: string): Promise<{ id: string; ip: string }> {
  const res = await axios.get(`${CF_API_BASE}/zones/${zoneId}/dns_records`, {
    headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    params: { name: CF_RECORD_NAME, type: 'A' },
  });
  const rec = res.data.result[0];
  return { id: rec.id, ip: rec.content };
}

async function updateRecord(zoneId: string, recordId: string, newIP: string) {
  await axios.put(
    `${CF_API_BASE}/zones/${zoneId}/dns_records/${recordId}`,
    {
      type: 'A',
      name: CF_RECORD_NAME,
      content: newIP,
      ttl: 1,
      proxied: false,
    },
    {
      headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    }
  );
}

async function ddnsLoop() {
  const zoneId = await getZoneId();
  const record = await getRecord(zoneId);

  console.log(`🎯 Current record IP: ${record.ip}`);

  while (true) {
    try {
      const currentIP = await getPublicIP();
      if (currentIP !== record.ip) {
        console.log(`🌐 IP changed to ${currentIP}, updating...`);
        await updateRecord(zoneId, record.id, currentIP);
        record.ip = currentIP;
        console.log(`✅ Record updated.`);
      } else {
        console.log(`⏳ IP unchanged: ${currentIP}`);
      }
    } catch (err) {
      console.error('❌ Error in update loop:', err);
    }

    await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000)); // 1 hour
  }
}

ddnsLoop();
