import axios from 'axios';

export class IPService {
  async getPublicIP(): Promise<string> {
    try {
      const { data } = await axios.get('https://api.ipify.org?format=json');
      return data.ip;
    } catch (error) {
      throw new Error(`Failed to get public IP: ${error}`);
    }
  }
}
