import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Price endpoints
  async getKlines(symbol: string, interval: string = '1m', limit: number = 100) {
    const response = await this.client.get(`/prices/${symbol}`, {
      params: { interval, limit },
    });
    return response.data;
  }

  async getTicker(symbol: string) {
    const response = await this.client.get(`/prices/${symbol}/ticker`);
    return response.data;
  }

  // Analysis endpoints
  async analyzeKlines(symbol: string, interval: string = '1m', limit: number = 100) {
    const response = await this.client.post('/analysis/analyze', {
      symbol,
      interval,
      limit,
    });
    return response.data;
  }

  // Monitoring endpoints
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

  async getMonitoringStatus(symbol?: string) {
    const url = symbol ? `/monitor/status/${symbol}` : '/monitor/status';
    const response = await this.client.get(url);
    return response.data;
  }
}

export default new ApiClient();
