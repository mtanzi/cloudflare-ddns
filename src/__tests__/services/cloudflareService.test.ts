import { CloudflareService } from '../../services/cloudflareService';
import nock from 'nock';

describe('CloudflareService', () => {
  let cloudflareService: CloudflareService;
  const mockZoneId = 'zone123';
  const mockRecordId = 'record456';
  const mockIP = '192.168.1.1';

  beforeEach(() => {
    cloudflareService = new CloudflareService();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getZoneId', () => {
    it('should return zone ID for valid zone name', async () => {
      nock('https://api.cloudflare.com')
        .get('/client/v4/zones')
        .query({ name: 'example.com' })
        .reply(200, {
          result: [{ id: mockZoneId, name: 'example.com' }],
          success: true,
          errors: [],
        });

      const result = await cloudflareService.getZoneId();
      expect(result).toBe(mockZoneId);
    });

    it('should throw error when zone not found', async () => {
      nock('https://api.cloudflare.com')
        .get('/client/v4/zones')
        .query({ name: 'example.com' })
        .reply(200, {
          result: [],
          success: true,
          errors: [],
        });

      await expect(cloudflareService.getZoneId()).rejects.toThrow('Zone example.com not found');
    });

    it('should throw error when API fails', async () => {
      nock('https://api.cloudflare.com')
        .get('/client/v4/zones')
        .query({ name: 'example.com' })
        .reply(500, 'Internal Server Error');

      await expect(cloudflareService.getZoneId()).rejects.toThrow('Failed to get zone ID');
    });
  });

  describe('getRecord', () => {
    it('should return DNS record for valid zone and record name', async () => {
      nock('https://api.cloudflare.com')
        .get(`/client/v4/zones/${mockZoneId}/dns_records`)
        .query({ name: 'test.example.com', type: 'A' })
        .reply(200, {
          result: [
            {
              id: mockRecordId,
              name: 'test.example.com',
              content: mockIP,
              type: 'A',
            },
          ],
          success: true,
          errors: [],
        });

      const result = await cloudflareService.getRecord(mockZoneId);
      expect(result).toEqual({
        id: mockRecordId,
        ip: mockIP,
      });
    });

    it('should throw error when record not found', async () => {
      nock('https://api.cloudflare.com')
        .get(`/client/v4/zones/${mockZoneId}/dns_records`)
        .query({ name: 'test.example.com', type: 'A' })
        .reply(200, {
          result: [],
          success: true,
          errors: [],
        });

      await expect(cloudflareService.getRecord(mockZoneId)).rejects.toThrow(
        'DNS record test.example.com not found',
      );
    });
  });

  describe('updateRecord', () => {
    it('should update DNS record successfully', async () => {
      const newIP = '192.168.1.2';

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

      await expect(
        cloudflareService.updateRecord(mockZoneId, mockRecordId, newIP),
      ).resolves.not.toThrow();
    });

    it('should throw error when update fails', async () => {
      const newIP = '192.168.1.2';

      nock('https://api.cloudflare.com')
        .put(`/client/v4/zones/${mockZoneId}/dns_records/${mockRecordId}`)
        .reply(400, 'Bad Request');

      await expect(cloudflareService.updateRecord(mockZoneId, mockRecordId, newIP)).rejects.toThrow(
        'Failed to update DNS record',
      );
    });
  });
});
