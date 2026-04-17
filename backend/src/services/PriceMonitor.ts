import { BinanceClient } from './BinanceClient';
import { TradingEngine, TradeAnalysis, TradeSignal } from './TradingEngine';

export interface MonitoringConfig {
  symbol: string;
  interval: string; // 1m, 5m, 1h, etc.
  checkIntervalSeconds: number; // How often to check for signals
}

export interface MonitoringStatus {
  isRunning: boolean;
  symbol: string;
  lastCheck?: Date;
  lastSignal?: TradeSignal;
  lastAnalysis?: TradeAnalysis;
  error?: string;
}

/**
 * Price Monitoring Service
 * Continuously monitors Binance prices and emits trading signals
 */
export class PriceMonitor {
  private binanceClient: BinanceClient;
  private tradingEngine: TradingEngine;
  private config: MonitoringConfig;
  private isRunning = false;
  private monitoringInterval?: NodeJS.Timeout;
  private lastSignal?: TradeSignal;
  private lastAnalysis?: TradeAnalysis;
  private lastError?: string;
  private signalCallbacks: ((signal: TradeSignal) => void)[] = [];

  constructor(
    config: MonitoringConfig,
    binanceClient?: BinanceClient,
    tradingEngine?: TradingEngine
  ) {
    this.config = config;
    this.binanceClient = binanceClient || new BinanceClient();
    this.tradingEngine = tradingEngine || new TradingEngine();
  }

  /**
   * Register a callback to be called when a trade signal is detected
   */
  onSignal(callback: (signal: TradeSignal) => void): void {
    this.signalCallbacks.push(callback);
  }

  /**
   * Start monitoring prices
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Monitor is already running');
    }

    // Verify connection to Binance
    const isConnected = await this.binanceClient.ping();
    if (!isConnected) {
      throw new Error('Cannot connect to Binance API');
    }

    this.isRunning = true;
    this.lastError = undefined;

    // Run first check immediately
    await this.checkPrices();

    // Schedule periodic checks
    this.monitoringInterval = setInterval(
      () => this.checkPrices(),
      this.config.checkIntervalSeconds * 1000
    );

    console.log(`✓ Price monitoring started for ${this.config.symbol}`);
  }

  /**
   * Stop monitoring prices
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.isRunning = false;
    console.log(`✓ Price monitoring stopped for ${this.config.symbol}`);
  }

  /**
   * Check prices and emit signals
   */
  private async checkPrices(): Promise<void> {
    try {
      const response = await this.binanceClient.getKlines(
        this.config.symbol,
        this.config.interval,
        100 // Get last 100 klines for analysis
      );

      // Analyze klines
      const analysis = this.tradingEngine.analyzeKlines(response.klines);
      this.lastAnalysis = analysis;

      // Get signal
      const signal = this.tradingEngine.getTradeSignal(analysis);
      this.lastSignal = signal;

      // Emit callbacks if signal changed
      if (signal.type !== 'NONE') {
        this.signalCallbacks.forEach((callback) => callback(signal));
      }

      this.lastError = undefined;
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : String(error);
      console.error(`Error checking prices: ${this.lastError}`);
    }
  }

  /**
   * Get current monitoring status
   */
  getStatus(): MonitoringStatus {
    return {
      isRunning: this.isRunning,
      symbol: this.config.symbol,
      lastCheck: new Date(),
      lastSignal: this.lastSignal,
      lastAnalysis: this.lastAnalysis,
      error: this.lastError,
    };
  }
}
