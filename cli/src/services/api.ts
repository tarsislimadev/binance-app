import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getTicker(symbol: string) {
    const response = await this.client.get(`/prices/${symbol}/ticker`);
    return response.data;
  }

  async getKlines(symbol: string, interval: string = '1m', limit: number = 100) {
    const response = await this.client.get(`/prices/${symbol}`, {
      params: { interval, limit },
    });
    return response.data;
  }

  async analyze(symbol: string, interval: string = '1m', limit: number = 100) {
    const response = await this.client.post('/analysis/analyze', {
      symbol,
      interval,
      limit,
    });
    return response.data;
  }

  async startMonitoring(symbol: string, interval: string = '1m', checkIntervalSeconds: number = 10) {
    const response = await this.client.post('/monitor/start', {
      symbol,
      interval,
      checkIntervalSeconds,
    });
    return response.data;
  }

  async stopMonitoring(symbol: string) {
    const response = await this.client.post('/monitor/stop', { symbol });
    return response.data;
  }

  async getStatus(symbol?: string) {
    const url = symbol ? `/monitor/status/${symbol}` : '/monitor/status';
    const response = await this.client.get(url);
    return response.data;
  }
}

export default new ApiClient();
