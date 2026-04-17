import { BinanceClient } from '../../src/services/BinanceClient';

describe('BinanceClient', () => {
  let client: BinanceClient;

  beforeEach(() => {
    client = new BinanceClient();
  });

  describe('constructor', () => {
    it('should initialize without API key', () => {
      expect(client).toBeDefined();
    });

    it('should initialize with API key and secret', () => {
      const clientWithAuth = new BinanceClient('test-key', 'test-secret');
      expect(clientWithAuth).toBeDefined();
    });
  });

  describe('ping', () => {
    it('should attempt to ping Binance API', async () => {
      const result = await client.ping();
      expect(typeof result).toBe('boolean');
    }, 10000);
  });

  describe('getKlines', () => {
    it('should have correct method signature', () => {
      expect(typeof client.getKlines).toBe('function');
    });

    it('should accept symbol and optional parameters', async () => {
      // This test just verifies the method accepts the parameters
      const getKlinesMethod = client.getKlines;
      expect(getKlinesMethod.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('get24hTicker', () => {
    it('should have correct method signature', () => {
      expect(typeof client.get24hTicker).toBe('function');
    });
  });
});
