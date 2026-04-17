import { Router, Request, Response } from 'express';
import { BinanceClient } from '../services/BinanceClient';

const router = Router();

/**
 * GET /api/prices/:symbol
 * Get current price data for a symbol
 */
router.get('/:symbol', async (req: Request, res: Response) => {
  try {
    const symbol = Array.isArray(req.params.symbol) ? req.params.symbol[0] : req.params.symbol;
    const intervalParam = req.query.interval;
    const interval = (Array.isArray(intervalParam) ? intervalParam[0] : intervalParam) as string || '1m';
    const limitParam = req.query.limit;
    const limitStr = (Array.isArray(limitParam) ? limitParam[0] : limitParam) as string || '100';
    const limit = parseInt(limitStr, 10);

    const client = new BinanceClient();
    const data = await client.getKlines(symbol, interval, limit);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/prices/:symbol/ticker
 * Get 24h ticker data
 */
router.get('/:symbol/ticker', async (req: Request, res: Response) => {
  try {
    const symbol = Array.isArray(req.params.symbol) ? req.params.symbol[0] : req.params.symbol;
    const client = new BinanceClient();
    const ticker = await client.get24hTicker(symbol);

    res.json({
      success: true,
      data: ticker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
