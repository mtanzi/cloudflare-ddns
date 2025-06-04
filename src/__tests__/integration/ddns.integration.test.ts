import { DDNSService } from '../../services/ddnsService';
import nock from 'nock';

describe('DDNS Integration Tests', () => {
  let ddnsService: DDNSService;

  beforeEach(() => {
    ddnsService = new DDNSService();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should complete full DDNS cycle when IP changes', async () => {
    const mockZoneId = 'zone123';
    const mockRecordId = 'record456';
    const oldIP = '192.168.1.1';
    const newIP = '192.168.1.2';

    // Mock the full flow
    nock('https://api.cloudflare.com')
      .get('/client/v4/zones')
      .query({ name: 'example.com' })
      .reply(200, {
        result: [{ id: mockZoneId, name: 'example.com' }],
        success: true,
        errors: [],
      });

    nock('https://api.cloudflare.com')
      .get(`/client/v4/zones/${mockZoneId}/dns_records`)
      .query({ name: 'test.example.com', type: 'A' })
      .reply(200, {
        result: [
          {
            id: mockRecordId,
            name: 'test.example.com',
            content: oldIP,
            type: 'A',
          },
        ],
        success: true,
        errors: [],
      });

    nock('https://api.ipify.org').get('/').query({ format: 'json' }).reply(200, { ip: newIP });

    nock('https://api.cloudflare.com')
      .put(`/client/v4/zones/${mockZoneId}/dns_records/${mockRecordId}`)
      .reply(200, {
        result: {
          id: mockRecordId,
          name: 'test.example.com',
          content: newIP,
          type: 'A',
        },
        success: true,
        errors: [],
      });

    // Run the integration test
    const { zoneId, record } = await ddnsService.initialize();
    const wasUpdated = await ddnsService.checkAndUpdateIP(zoneId, record);

    expect(wasUpdated).toBe(true);
    expect(record.ip).toBe(newIP);
  });

  it('should handle no change scenario', async () => {
    const mockZoneId = 'zone123';
    const mockRecordId = 'record456';
    const currentIP = '192.168.1.1';

    // Mock initialization
    nock('https://api.cloudflare.com')
      .get('/client/v4/zones')
      .query({ name: 'example.com' })
      .reply(200, {
        result: [{ id: mockZoneId, name: 'example.com' }],
        success: true,
        errors: [],
      });

    nock('https://api.cloudflare.com')
      .get(`/client/v4/zones/${mockZoneId}/dns_records`)
      .query({ name: 'test.example.com', type: 'A' })
      .reply(200, {
        result: [
          {
            id: mockRecordId,
            name: 'test.example.com',
            content: currentIP,
            type: 'A',
          },
        ],
        success: true,
        errors: [],
      });

    // Mock IP check returning same IP
    nock('https://api.ipify.org').get('/').query({ format: 'json' }).reply(200, { ip: currentIP });

    const { zoneId, record } = await ddnsService.initialize();
    const wasUpdated = await ddnsService.checkAndUpdateIP(zoneId, record);

    expect(wasUpdated).toBe(false);
    expect(record.ip).toBe(currentIP);
  });
});
