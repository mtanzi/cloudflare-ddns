export interface DNSRecord {
  id: string;
  ip: string;
}

export interface CloudflareResponse<T> {
  result: T;
  success: boolean;
  errors: string[];
}

export interface CloudflareZone {
  id: string;
  name: string;
}

export interface CloudflareDNSRecord {
  id: string;
  name: string;
  content: string;
  type: string;
}
