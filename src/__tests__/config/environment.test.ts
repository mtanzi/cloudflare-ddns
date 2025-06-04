import { config } from '../../config/environment';

describe('Environment Configuration', () => {
  it('should load configuration from environment variables', () => {
    expect(config.cloudflare.apiToken).toBe('test-token');
    expect(config.cloudflare.zoneName).toBe('example.com');
    expect(config.cloudflare.recordName).toBe('test.example.com');
    expect(config.cloudflare.apiBase).toBe('https://api.cloudflare.com/client/v4');
  });

  it('should set development interval for test environment', () => {
    expect(config.ddns.updateIntervalMs).toBe(3600000);
  });
});
