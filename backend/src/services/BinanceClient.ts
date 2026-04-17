import https from 'https';

export interface KlineData {
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface KlineResponse {
  symbol: string;
  interval: string;
  klines: KlineData[];
}

/**
 * Binance API Client for fetching market data
 */
export class BinanceClient {
  private baseUrl = 'api.binance.com';
  private apiKey?: string;
  private apiSecret?: string;

  constructor(apiKey?: string, apiSecret?: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  /**
   * Fetch klines (candlestick) data for a symbol
   * @param symbol Trading pair (e.g., BTCUSDT)
   * @param interval Candlestick interval (1m, 5m, 1h, etc.)
   * @param limit Number of klines to fetch (default: 100, max: 1000)
   */
  async getKlines(symbol: string, interval: string = '1m', limit: number = 100): Promise<KlineResponse> {
    return new Promise((resolve, reject) => {
      const path = `/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      
      const options = {
        hostname: this.baseUrl,
        path,
        method: 'GET',
        headers: {
          'User-Agent': 'Binance-Trading-Bot/1.0',
        },
      };

      https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const klines = JSON.parse(data) as Array<any[]>;
            const formattedKlines: KlineData[] = klines.map((k) => ({
              time: k[0],
              open: k[1],
              high: k[2],
              low: k[3],
              close: k[4],
              volume: k[7],
            }));

            resolve({
              symbol,
              interval,
              klines: formattedKlines,
            });
          } catch (error) {
            reject(new Error(`Failed to parse Binance response: ${error}`));
          }
        });
      }).on('error', reject);
    });
  }

  /**
   * Get 24h ticker data for a symbol
   */
  async get24hTicker(symbol: string): Promise<Record<string, string>> {
    return new Promise((resolve, reject) => {
      const path = `/api/v3/ticker/24hr?symbol=${symbol}`;

      https.get({ hostname: this.baseUrl, path, method: 'GET' }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error(`Failed to parse ticker response: ${error}`));
          }
        });
      }).on('error', reject);
    });
  }

  /**
   * Validate that the API client can reach Binance
   */
  async ping(): Promise<boolean> {
    return new Promise((resolve) => {
      https.get({ hostname: this.baseUrl, path: '/api/v3/ping', method: 'GET' }, (res) => {
        resolve(res.statusCode === 200);
      }).on('error', () => {
        resolve(false);
      });
    });
  }
}
