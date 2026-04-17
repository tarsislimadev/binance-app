import { Router, Request, Response } from 'express';

// This will be injected by the main app
let controller: any;

export const setMonitoringController = (ctrl: any) => {
  controller = ctrl;
};

const router = Router();

/**
 * POST /api/monitor/start
 * Start monitoring a symbol
 */
router.post('/start', async (req: Request, res: Response) => {
  try {
    const { symbol, interval = '1m', checkIntervalSeconds = 10 } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Symbol is required',
      });
    }

    if (!controller) {
      return res.status(500).json({
        success: false,
        error: 'Monitoring controller not initialized',
      });
    }

    await controller.startMonitoring({
      symbol,
      interval,
      checkIntervalSeconds,
    });

    res.json({
      success: true,
      message: `Started monitoring ${symbol}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/monitor/stop
 * Stop monitoring a symbol
 */
router.post('/stop', (req: Request, res: Response) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Symbol is required',
      });
    }

    if (!controller) {
      return res.status(500).json({
        success: false,
        error: 'Monitoring controller not initialized',
      });
    }

    controller.stopMonitoring(symbol);

    res.json({
      success: true,
      message: `Stopped monitoring ${symbol}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/monitor/status
 * Get monitoring status for all symbols
 */
router.get('/status', (req: Request, res: Response) => {
  try {
    if (!controller) {
      return res.status(500).json({
        success: false,
        error: 'Monitoring controller not initialized',
      });
    }

    const statuses = controller.getAllStatuses();
    res.json({
      success: true,
      data: statuses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/monitor/status/:symbol
 * Get monitoring status for a specific symbol
 */
router.get('/status/:symbol', (req: Request, res: Response) => {
  try {
    const symbol = Array.isArray(req.params.symbol) ? req.params.symbol[0] : req.params.symbol;

    if (!controller) {
      return res.status(500).json({
        success: false,
        error: 'Monitoring controller not initialized',
      });
    }

    const status = controller.getStatus(symbol);
    if (!status) {
      return res.status(404).json({
        success: false,
        error: `Not monitoring ${symbol}`,
      });
    }

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
