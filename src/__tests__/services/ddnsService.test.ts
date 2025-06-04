import { DDNSService } from '../../services/ddnsService';
import { CloudflareService } from '../../services/cloudflareService';
import { IPService } from '../../services/ipService';
import nock from 'nock';

// Mock the services
jest.mock('../../services/cloudflareService');
jest.mock('../../services/ipService');

describe('DDNSService', () => {
  let ddnsService: DDNSService;
  let mockCloudflareService: jest.Mocked<CloudflareService>;
  let mockIPService: jest.Mocked<IPService>;

  const mockZoneId = 'zone123';
  const mockRecord = { id: 'record456', ip: '192.168.1.1' };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create service instance
    ddnsService = new DDNSService();

    // Get mocked instances
    mockCloudflareService = (ddnsService as any).cloudflareService;
    mockIPService = (ddnsService as any).ipService;
  });

  describe('initialize', () => {
    it('should initialize with zone ID and record', async () => {
      mockCloudflareService.getZoneId.mockResolvedValue(mockZoneId);
      mockCloudflareService.getRecord.mockResolvedValue(mockRecord);

      const result = await ddnsService.initialize();

      expect(result).toEqual({
        zoneId: mockZoneId,
        record: mockRecord,
      });
      expect(mockCloudflareService.getZoneId).toHaveBeenCalledTimes(1);
      expect(mockCloudflareService.getRecord).toHaveBeenCalledWith(mockZoneId);
    });

    it('should throw error when initialization fails', async () => {
      mockCloudflareService.getZoneId.mockRejectedValue(new Error('Zone not found'));

      await expect(ddnsService.initialize()).rejects.toThrow('Zone not found');
    });
  });

  describe('checkAndUpdateIP', () => {
    it('should update IP when it has changed', async () => {
      const newIP = '192.168.1.2';
      const record = { ...mockRecord };

      mockIPService.getPublicIP.mockResolvedValue(newIP);
      mockCloudflareService.updateRecord.mockResolvedValue();

      const result = await ddnsService.checkAndUpdateIP(mockZoneId, record);

      expect(result).toBe(true);
      expect(record.ip).toBe(newIP);
      expect(mockCloudflareService.updateRecord).toHaveBeenCalledWith(mockZoneId, record.id, newIP);
    });

    it('should not update IP when unchanged', async () => {
      const record = { ...mockRecord };

      mockIPService.getPublicIP.mockResolvedValue(mockRecord.ip);

      const result = await ddnsService.checkAndUpdateIP(mockZoneId, record);

      expect(result).toBe(false);
      expect(record.ip).toBe(mockRecord.ip);
      expect(mockCloudflareService.updateRecord).not.toHaveBeenCalled();
    });

    it('should throw error when IP check fails', async () => {
      const record = { ...mockRecord };

      mockIPService.getPublicIP.mockRejectedValue(new Error('Network error'));

      await expect(ddnsService.checkAndUpdateIP(mockZoneId, record)).rejects.toThrow(
        'Network error',
      );
    });
  });
});
