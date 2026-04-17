import { KlineData } from './BinanceClient';

export interface TradeSignal {
  type: 'BUY' | 'SELL' | 'NONE';
  price: number;
  timestamp: number;
  reason: string;
}

export interface TradeAnalysis {
  firstPrice: number;
  firstTime: number;
  lowestPrice: number;
  lowestTime: number;
  timeInterval: number;
  buyPrice?: number;
  buyTime?: number;
  sellPrice?: number;
  sellTime?: number;
  gain?: number;
}

/**
 * Trading Logic Engine
 * Implements the trading algorithm from README:
 * 1. Get lowest price and first price
 * 2. Check if lowest < first and time interval > 1 second
 * 3. BUY when price rises 2% above lowest
 * 4. SELL when price rises 2% above buy price
 * 5. Calculate gain
 */
export class TradingEngine {
  private readonly BUY_THRESHOLD = 1.02; // 2% above lowest
  private readonly SELL_THRESHOLD = 1.02; // 2% above buy
  private readonly MIN_TIME_INTERVAL_MS = 1000; // 1 second

  /**
   * Analyze klines and determine buy/sell signals
   */
  analyzeKlines(klines: KlineData[]): TradeAnalysis {
    if (klines.length === 0) {
      throw new Error('No klines data provided');
    }

    // Get first price
    const firstPrice = parseFloat(klines[0].close);
    const firstTime = klines[0].time;

    // Find lowest price
    let lowestPrice = firstPrice;
    let lowestTime = firstTime;
    let lowestIndex = 0;

    for (let i = 1; i < klines.length; i++) {
      const price = parseFloat(klines[i].close);
      if (price < lowestPrice) {
        lowestPrice = price;
        lowestTime = klines[i].time;
        lowestIndex = i;
      }
    }

    const timeInterval = lowestTime - firstTime;

    const analysis: TradeAnalysis = {
      firstPrice,
      firstTime,
      lowestPrice,
      lowestTime,
      timeInterval,
    };

    // Check conditions
    if (lowestPrice >= firstPrice || timeInterval < this.MIN_TIME_INTERVAL_MS) {
      return analysis;
    }

    // Look for BUY signal (2% above lowest)
    const buyTarget = lowestPrice * this.BUY_THRESHOLD;
    let foundBuy = false;

    for (let i = lowestIndex; i < klines.length; i++) {
      const price = parseFloat(klines[i].close);
      if (price >= buyTarget) {
        analysis.buyPrice = price;
        analysis.buyTime = klines[i].time;
        foundBuy = true;
        
        // Look for SELL signal after buy (2% above buy price)
        if (foundBuy) {
          const sellTarget = analysis.buyPrice * this.SELL_THRESHOLD;
          for (let j = i + 1; j < klines.length; j++) {
            const sellPrice = parseFloat(klines[j].close);
            if (sellPrice >= sellTarget) {
              analysis.sellPrice = sellPrice;
              analysis.sellTime = klines[j].time;
              // Calculate gain
              analysis.gain = ((analysis.sellPrice - lowestPrice) / lowestPrice) * 100;
              break;
            }
          }
        }
        break;
      }
    }

    return analysis;
  }

  /**
   * Determine buy/sell signal based on analysis
   */
  getTradeSignal(analysis: TradeAnalysis): TradeSignal {
    // Check basic conditions
    if (analysis.lowestPrice >= analysis.firstPrice) {
      return {
        type: 'NONE',
        price: analysis.firstPrice,
        timestamp: analysis.firstTime,
        reason: "Lowest price is not lower than first price",
      };
    }

    if (analysis.timeInterval < this.MIN_TIME_INTERVAL_MS) {
      return {
        type: 'NONE',
        price: analysis.firstPrice,
        timestamp: analysis.firstTime,
        reason: "Time interval between first and lowest is less than 1 second",
      };
    }

    // Check for SELL signal first (we might already have completed a trade)
    if (analysis.sellPrice && analysis.sellPrice >= (analysis.buyPrice || 0) * this.SELL_THRESHOLD) {
      return {
        type: 'SELL',
        price: analysis.sellPrice,
        timestamp: analysis.sellTime || Date.now(),
        reason: `Sell signal: Price reached ${(this.SELL_THRESHOLD * 100 - 100).toFixed(1)}% above buy price`,
      };
    }

    // Check for BUY signal
    if (analysis.buyPrice && analysis.buyPrice >= analysis.lowestPrice * this.BUY_THRESHOLD) {
      return {
        type: 'BUY',
        price: analysis.buyPrice,
        timestamp: analysis.buyTime || Date.now(),
        reason: `Buy signal: Price reached ${(this.BUY_THRESHOLD * 100 - 100).toFixed(1)}% above lowest`,
      };
    }

    return {
      type: 'NONE',
      price: analysis.lowestPrice,
      timestamp: analysis.lowestTime,
      reason: "No clear buy/sell signals detected",
    };
  }

  /**
   * Calculate gain for a completed trade
   */
  calculateGain(entryPrice: number, exitPrice: number): number {
    return ((exitPrice - entryPrice) / entryPrice) * 100;
  }
}
