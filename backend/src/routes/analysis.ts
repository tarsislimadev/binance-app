import { Router, Request, Response } from 'express';
import { TradingEngine } from '../services/TradingEngine';
import { BinanceClient } from '../services/BinanceClient';

const router = Router();

/**
 * POST /api/analysis/analyze
 * Analyze klines and get trading signals
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { symbol, interval = '1m', limit = 100 } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Symbol is required',
      });
    }

    // Fetch klines from Binance
    const binanceClient = new BinanceClient();
    const response = await binanceClient.getKlines(symbol, interval, limit);

    // Analyze with trading engine
    const tradingEngine = new TradingEngine();
    const analysis = tradingEngine.analyzeKlines(response.klines);
    const signal = tradingEngine.getTradeSignal(analysis);

    res.json({
      success: true,
      symbol,
      interval,
      analysis,
      signal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
