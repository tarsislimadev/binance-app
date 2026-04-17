# Binance Trading Bot - Backend

Node.js/Express/TypeScript backend for the Binance trading bot.

## Features

- **Binance API Client**: Fetch klines and market data
- **Trading Logic Engine**: Analyze price movements and generate buy/sell signals
- **Price Monitoring Service**: Continuously monitor prices and emit trade signals
- **REST API**: Endpoints for price data and trading analysis
- **WebSocket Support**: Real-time price updates (to be implemented)

## Project Structure

```
src/
├── index.ts              # Express app entry point
├── routes/
│   ├── prices.ts        # Price data endpoints
│   └── analysis.ts      # Trading analysis endpoints
├── services/
│   ├── BinanceClient.ts # Binance API client
│   ├── TradingEngine.ts # Trading logic
│   ├── PriceMonitor.ts  # Price monitoring service
│   └── ...
├── models/              # Database models (to be implemented)
├── websocket/           # WebSocket server (to be implemented)
└── types/               # TypeScript type definitions
```

## Setup

```bash
npm install
npm run build
npm run dev      # Start development server
npm start        # Start production server
```

## API Endpoints

### Prices
- `GET /api/prices/:symbol` - Get klines for a symbol
- `GET /api/prices/:symbol/ticker` - Get 24h ticker

### Analysis
- `POST /api/analysis/analyze` - Analyze klines and get trade signals

### Health
- `GET /health` - Server health check

## Trading Logic

The bot analyzes price movements to generate buy/sell signals:

1. **BUY Signal**: When price rises 2% above the lowest price in the period
2. **SELL Signal**: When price rises 2% above the buy price
3. **Gain Calculation**: (Exit Price - Entry Price) / Entry Price * 100

## Environment Variables

See `.env` file for configuration:
- `PORT` - Server port (default: 3000)
- `BINANCE_API_KEY` - Binance API key for authenticated requests
- `BINANCE_API_SECRET` - Binance API secret
- `MONITOR_SYMBOL` - Symbol to monitor (default: BTCUSDT)
- `MONITOR_INTERVAL` - Kline interval (default: 1m)
- `CHECK_INTERVAL_SECONDS` - How often to check prices

## Testing

Tests to be implemented using Jest or Mocha.

## Next Steps

- [ ] Implement WebSocket server for real-time updates
- [ ] Add database models for trade history
- [ ] Implement user authentication
- [ ] Add comprehensive tests
- [ ] Deploy to production
