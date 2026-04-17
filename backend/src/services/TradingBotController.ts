import { PriceMonitor, MonitoringConfig } from '../services/PriceMonitor';
import { PriceWebSocketServer } from '../websocket/PriceWebSocketServer';

/**
 * Trading Bot Controller
 * Manages the price monitoring and integrates with WebSocket for real-time updates
 */
export class TradingBotController {
  private monitors: Map<string, PriceMonitor> = new Map();
  private wsServer: PriceWebSocketServer;

  constructor(wsServer: PriceWebSocketServer) {
    this.wsServer = wsServer;
  }

  /**
   * Start monitoring a symbol
   */
  async startMonitoring(config: MonitoringConfig): Promise<void> {
    if (this.monitors.has(config.symbol)) {
      throw new Error(`Already monitoring ${config.symbol}`);
    }

    const monitor = new PriceMonitor(config);

    // Register signal callback to broadcast via WebSocket
    monitor.onSignal((signal) => {
      this.wsServer.broadcastSignal(signal, config.symbol);
      console.log(`📊 Signal: ${signal.type} for ${config.symbol} at ${signal.price}`);
    });

    // Start monitoring
    await monitor.start();
    this.monitors.set(config.symbol, monitor);
  }

  /**
   * Stop monitoring a symbol
   */
  stopMonitoring(symbol: string): void {
    const monitor = this.monitors.get(symbol);
    if (monitor) {
      monitor.stop();
      this.monitors.delete(symbol);
    }
  }

  /**
   * Get monitoring status for a symbol
   */
  getStatus(symbol: string) {
    const monitor = this.monitors.get(symbol);
    if (!monitor) {
      return null;
    }
    return monitor.getStatus();
  }

  /**
   * Get all monitoring statuses
   */
  getAllStatuses() {
    const statuses: Record<string, any> = {};
    this.monitors.forEach((monitor, symbol) => {
      statuses[symbol] = monitor.getStatus();
    });
    return statuses;
  }

  /**
   * Stop all monitoring
   */
  stopAll(): void {
    this.monitors.forEach((monitor) => {
      monitor.stop();
    });
    this.monitors.clear();
  }
}
