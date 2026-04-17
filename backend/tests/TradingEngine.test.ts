import { TradingEngine } from '../src/services/TradingEngine';
import { KlineData } from '../src/services/BinanceClient';

describe('TradingEngine', () => {
  let engine: TradingEngine;

  beforeEach(() => {
    engine = new TradingEngine();
  });

  describe('analyzeKlines', () => {
    it('should throw error on empty klines', () => {
      expect(() => engine.analyzeKlines([])).toThrow('No klines data provided');
    });

    it('should identify lowest price correctly', () => {
      const klines: KlineData[] = [
        { time: 1000, open: '100', high: '110', low: '95', close: '105', volume: '1000' },
        { time: 2000, open: '105', high: '115', low: '90', close: '100', volume: '1000' },
        { time: 3000, open: '100', high: '120', low: '85', close: '110', volume: '1000' },
      ];

      const analysis = engine.analyzeKlines(klines);
      expect(analysis.lowestPrice).toBe(85);
      expect(analysis.lowestTime).toBe(3000);
    });

    it('should calculate time interval correctly', () => {
      const klines: KlineData[] = [
        { time: 1000, open: '100', high: '100', low: '100', close: '100', volume: '1000' },
        { time: 5000, open: '90', high: '90', low: '90', close: '90', volume: '1000' },
      ];

      const analysis = engine.analyzeKlines(klines);
      expect(analysis.timeInterval).toBe(4000);
    });

    it('should detect buy signal at 2% threshold', () => {
      const klines: KlineData[] = [
        { time: 1000, open: '100', high: '100', low: '100', close: '100', volume: '1000' },
        { time: 2000, open: '90', high: '90', low: '90', close: '90', volume: '1000' },
        { time: 3000, open: '91.8', high: '91.8', low: '91.8', close: '91.8', volume: '1000' },
      ];

      const analysis = engine.analyzeKlines(klines);
      expect(analysis.buyPrice).toBe(91.8);
    });

    it('should detect sell signal at 2% threshold', () => {
      const klines: KlineData[] = [
        { time: 1000, open: '100', high: '100', low: '100', close: '100', volume: '1000' },
        { time: 2000, open: '90', high: '90', low: '90', close: '90', volume: '1000' },
        { time: 3000, open: '91.8', high: '91.8', low: '91.8', close: '91.8', volume: '1000' },
        { time: 4000, open: '93.6', high: '93.6', low: '93.6', close: '93.6', volume: '1000' },
      ];

      const analysis = engine.analyzeKlines(klines);
      expect(analysis.sellPrice).toBe(93.6);
      expect(analysis.gain).toBeCloseTo(4, 0);
    });

    it('should not detect signals if lowest >= first', () => {
      const klines: KlineData[] = [
        { time: 1000, open: '100', high: '100', low: '100', close: '100', volume: '1000' },
        { time: 2000, open: '110', high: '110', low: '110', close: '110', volume: '1000' },
      ];

      const analysis = engine.analyzeKlines(klines);
      expect(analysis.buyPrice).toBeUndefined();
    });

    it('should not detect signals if time interval < 1 second', () => {
      const klines: KlineData[] = [
        { time: 1000, open: '100', high: '100', low: '100', close: '100', volume: '1000' },
        { time: 1500, open: '90', high: '90', low: '90', close: '90', volume: '1000' },
      ];

      const analysis = engine.analyzeKlines(klines);
      expect(analysis.buyPrice).toBeUndefined();
    });
  });

  describe('getTradeSignal', () => {
    it('should return NONE signal when no conditions met', () => {
      const analysis = {
        firstPrice: 100,
        firstTime: 1000,
        lowestPrice: 110,
        lowestTime: 2000,
        timeInterval: 1000,
      };

      const signal = engine.getTradeSignal(analysis);
      expect(signal.type).toBe('NONE');
    });

    it('should return BUY signal when buy price met', () => {
      const analysis = {
        firstPrice: 100,
        firstTime: 1000,
        lowestPrice: 90,
        lowestTime: 2000,
        timeInterval: 2000,
        buyPrice: 91.8,
        buyTime: 3000,
      };

      const signal = engine.getTradeSignal(analysis);
      expect(signal.type).toBe('BUY');
      expect(signal.price).toBe(91.8);
    });

    it('should return SELL signal when sell price met', () => {
      const analysis = {
        firstPrice: 100,
        firstTime: 1000,
        lowestPrice: 90,
        lowestTime: 2000,
        timeInterval: 2000,
        buyPrice: 91.8,
        buyTime: 3000,
        sellPrice: 93.6,
        sellTime: 4000,
      };

      const signal = engine.getTradeSignal(analysis);
      expect(signal.type).toBe('SELL');
      expect(signal.price).toBe(93.6);
    });
  });

  describe('calculateGain', () => {
    it('should calculate gain correctly', () => {
      const gain = engine.calculateGain(100, 110);
      expect(gain).toBeCloseTo(10, 5);
    });

    it('should handle decimal prices', () => {
      const gain = engine.calculateGain(99.5, 104.5);
      expect(gain).toBeCloseTo(5.03, 1);
    });
  });
});
