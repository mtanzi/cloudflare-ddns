import { IPService } from '../../services/ipService';
import nock from 'nock';

describe('IPService', () => {
  let ipService: IPService;

  beforeEach(() => {
    ipService = new IPService();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getPublicIP', () => {
    it('should return public IP address', async () => {
      const expectedIP = '192.168.1.1';

      nock('https://api.ipify.org')
        .get('/')
        .query({ format: 'json' })
        .reply(200, { ip: expectedIP });

      const result = await ipService.getPublicIP();
      expect(result).toBe(expectedIP);
    });

    it('should throw error when API fails', async () => {
      nock('https://api.ipify.org')
        .get('/')
        .query({ format: 'json' })
        .reply(500, 'Internal Server Error');

      await expect(ipService.getPublicIP()).rejects.toThrow('Failed to get public IP');
    });

    it('should throw error when network is unavailable', async () => {
      nock('https://api.ipify.org')
        .get('/')
        .query({ format: 'json' })
        .replyWithError('Network error');

      await expect(ipService.getPublicIP()).rejects.toThrow('Failed to get public IP');
    });
  });
});
