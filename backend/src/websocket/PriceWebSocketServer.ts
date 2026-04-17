import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { TradeSignal } from '../services/TradingEngine';

export interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'signal' | 'price' | 'status' | 'error';
  symbol?: string;
  data?: any;
  timestamp: number;
}

/**
 * WebSocket Server for real-time price and signal updates
 */
export class PriceWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, string[]> = new Map(); // Track which symbols each client is subscribed to
  private signalCallbacks: ((signal: TradeSignal, symbol: string) => void)[] = [];

  constructor(httpServer: HTTPServer) {
    this.wss = new WebSocketServer({ server: httpServer });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('✓ WebSocket client connected');
      this.clients.set(ws, []);

      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data) as WSMessage;
          this.handleMessage(ws, message);
        } catch (error) {
          ws.send(
            JSON.stringify({
              type: 'error',
              data: 'Invalid message format',
              timestamp: Date.now(),
            } as WSMessage)
          );
        }
      });

      ws.on('close', () => {
        console.log('✓ WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(ws: WebSocket, message: WSMessage): void {
    const subscriptions = this.clients.get(ws) || [];

    switch (message.type) {
      case 'subscribe':
        if (message.symbol && !subscriptions.includes(message.symbol)) {
          subscriptions.push(message.symbol);
          this.clients.set(ws, subscriptions);
          ws.send(
            JSON.stringify({
              type: 'status',
              data: { message: `Subscribed to ${message.symbol}` },
              timestamp: Date.now(),
            } as WSMessage)
          );
        }
        break;

      case 'unsubscribe':
        if (message.symbol) {
          const index = subscriptions.indexOf(message.symbol);
          if (index > -1) {
            subscriptions.splice(index, 1);
            this.clients.set(ws, subscriptions);
          }
          ws.send(
            JSON.stringify({
              type: 'status',
              data: { message: `Unsubscribed from ${message.symbol}` },
              timestamp: Date.now(),
            } as WSMessage)
          );
        }
        break;

      default:
        ws.send(
          JSON.stringify({
            type: 'error',
            data: `Unknown message type: ${message.type}`,
            timestamp: Date.now(),
          } as WSMessage)
        );
    }
  }

  /**
   * Register a callback for trade signals
   */
  onSignal(callback: (signal: TradeSignal, symbol: string) => void): void {
    this.signalCallbacks.push(callback);
  }

  /**
   * Broadcast a trade signal to all subscribed clients
   */
  broadcastSignal(signal: TradeSignal, symbol: string): void {
    const message: WSMessage = {
      type: 'signal',
      symbol,
      data: signal,
      timestamp: Date.now(),
    };

    this.clients.forEach((subscriptions, ws) => {
      if (subscriptions.includes(symbol) && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });

    // Call registered callbacks
    this.signalCallbacks.forEach((callback) => callback(signal, symbol));
  }

  /**
   * Broadcast price update to all subscribed clients
   */
  broadcastPrice(symbol: string, price: number, timestamp: number): void {
    const message: WSMessage = {
      type: 'price',
      symbol,
      data: { price, timestamp },
      timestamp: Date.now(),
    };

    this.clients.forEach((subscriptions, ws) => {
      if (subscriptions.includes(symbol) && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  /**
   * Get number of connected clients
   */
  getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Close the WebSocket server
   */
  close(): void {
    this.wss.close();
  }
}
