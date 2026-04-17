/**
 * WebSocket service for real-time price and signal updates
 */
class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageCallbacks: ((data: any) => void)[] = [];
  private connectionCallbacks: ((connected: boolean) => void)[] = [];

  constructor(url?: string) {
    this.url = url || `ws://${window.location.hostname}:${window.location.port || '3000'}`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('✓ WebSocket connected');
          this.reconnectAttempts = 0;
          this.notifyConnectionCallbacks(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.messageCallbacks.forEach((callback) => callback(data));
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('✓ WebSocket disconnected');
          this.notifyConnectionCallbacks(false);
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting in ${this.reconnectDelay}ms...`);
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectDelay);
    }
  }

  subscribe(symbol: string): void {
    this.send({
      type: 'subscribe',
      symbol,
      timestamp: Date.now(),
    });
  }

  unsubscribe(symbol: string): void {
    this.send({
      type: 'unsubscribe',
      symbol,
      timestamp: Date.now(),
    });
  }

  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  onMessage(callback: (data: any) => void): void {
    this.messageCallbacks.push(callback);
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionCallbacks.push(callback);
  }

  private notifyConnectionCallbacks(connected: boolean): void {
    this.connectionCallbacks.forEach((callback) => callback(connected));
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();
