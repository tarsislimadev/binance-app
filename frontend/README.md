# Binance Trading Bot - Frontend

React/TypeScript web frontend for the Binance trading bot.

## Features

- **Price Monitor**: Start/stop monitoring crypto prices with real-time WebSocket updates
- **Trade Analysis**: Analyze historical klines and view trading signals
- **Real-time Updates**: WebSocket connection for live price and signal notifications
- **Responsive Design**: Works on desktop and mobile devices
- **Dashboard**: Clean, intuitive user interface

## Project Structure

```
src/
├── components/
│   ├── PriceMonitor.tsx    # Price monitoring controls
│   ├── TradeAnalysis.tsx   # Trade analysis form and results
│   └── *.css               # Component styles
├── pages/
│   └── Dashboard.tsx       # Main dashboard page
├── services/
│   ├── api.ts              # REST API client
│   └── websocket.ts        # WebSocket client
├── App.tsx                 # Main app component
├── App.css                 # Global styles
└── main.tsx                # Entry point
```

## Setup

```bash
npm install
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Development

The frontend runs on `http://localhost:5173` by default, and proxies API calls to `http://localhost:3000/api`.

### Available Pages

- **Price Monitor**: Monitor cryptocurrency prices and configure trading parameters
- **Trade Analysis**: Analyze historical price data and view trading signals

### WebSocket

The app connects to the WebSocket server at `ws://localhost:3000` and subscribes to price updates and trade signals in real-time.

## API Endpoints Used

- `GET /api/prices/:symbol` - Get klines for a symbol
- `GET /api/prices/:symbol/ticker` - Get 24h ticker
- `POST /api/analysis/analyze` - Analyze klines
- `POST /api/monitor/start` - Start monitoring
- `POST /api/monitor/stop` - Stop monitoring
- `GET /api/monitor/status` - Get monitoring status

## Technologies

- React 18
- TypeScript
- Vite
- Axios (HTTP client)
- Recharts (charts)
- WebSocket (real-time updates)

## Next Steps

- [ ] Add price charts with Recharts
- [ ] Implement trade history view
- [ ] Add user settings/preferences
- [ ] Add authentication
- [ ] Deploy to production
