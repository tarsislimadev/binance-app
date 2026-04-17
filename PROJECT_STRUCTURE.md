# Binance Trading Bot - Project Structure

This is a full-stack cryptocurrency trading application built with multiple components.

## Project Layout

```
binance-app/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── index.ts                    # Entry point
│   │   ├── routes/                     # Express routes
│   │   │   ├── prices.ts              # Price endpoints
│   │   │   ├── analysis.ts            # Analysis endpoints
│   │   │   └── monitor.ts             # Monitoring endpoints
│   │   ├── services/                   # Business logic
│   │   │   ├── BinanceClient.ts       # Binance API client
│   │   │   ├── TradingEngine.ts       # Trading logic
│   │   │   ├── PriceMonitor.ts        # Price monitoring
│   │   │   └── TradingBotController.ts # Bot controller
│   │   └── websocket/
│   │       └── PriceWebSocketServer.ts # WebSocket server
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/            # React web application
│   ├── src/
│   │   ├── components/
│   │   │   ├── PriceMonitor.tsx       # Monitoring UI
│   │   │   └── TradeAnalysis.tsx      # Analysis UI
│   │   ├── pages/
│   │   │   └── Dashboard.tsx          # Main dashboard
│   │   ├── services/
│   │   │   ├── api.ts                 # REST API client
│   │   │   └── websocket.ts           # WebSocket client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── cli/                 # Command-line interface
│   ├── src/
│   │   ├── index.ts                   # CLI entry point with commands
│   │   └── services/
│   │       └── api.ts                 # API client
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── docs/
│   └── STACK.md         # Technical stack documentation
│
├── package.json         # Root package (optional, for monorepo setup)
├── README.md           # This file
└── PROJECT_STRUCTURE.md # This documentation
```

## Getting Started

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run build
npm run dev
```

The backend will run on `http://localhost:3000`

API endpoints:
- `GET /health` - Health check
- `GET /api/prices/:symbol` - Get klines
- `POST /api/analysis/analyze` - Analyze klines
- `POST /api/monitor/start` - Start monitoring
- `POST /api/monitor/stop` - Stop monitoring
- `GET /api/monitor/status` - Get monitoring status
- WebSocket: `ws://localhost:3000` - Real-time updates

### 2. Start the Web Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy API calls to the backend.

### 3. Use the CLI Tool

In another terminal:

```bash
cd cli
npm install
npm run build
npm start -- --help
```

Examples:
```bash
npm start -- start BTCUSDT           # Start monitoring Bitcoin
npm start -- status                  # Check all monitoring statuses
npm start -- analyze ETHUSDT         # Analyze Ethereum
npm start -- price BTCUSDT           # Get current Bitcoin price
npm start -- stop BTCUSDT            # Stop monitoring Bitcoin
```

## Architecture

### Backend

The backend consists of:
- **Express Server**: REST API for price data and analysis
- **WebSocket Server**: Real-time price and signal broadcasts
- **Binance Client**: Fetches market data from Binance API
- **Trading Engine**: Analyzes prices and generates buy/sell signals
- **Price Monitor**: Continuously monitors prices and emits signals
- **Bot Controller**: Manages monitoring lifecycle

### Frontend

The frontend provides:
- **Dashboard**: Main UI with tabbed interface
- **Price Monitor**: Start/stop monitoring and view status
- **Trade Analysis**: Analyze klines and view signals
- **WebSocket Client**: Real-time updates
- **REST API Client**: Backend communication

### CLI

The CLI provides commands for:
- Starting/stopping price monitoring
- Checking monitoring status
- Analyzing historical data
- Getting current prices

## Trading Logic

The bot implements this trading strategy:

1. **Data Collection**: Get klines (candlestick data) from Binance
2. **Analysis**:
   - Find the lowest price (Lower)
   - Find the first price (First)
   - Verify Lower < First and time interval > 1 second
3. **Buy Signal**: Price rises 2% above Lower
4. **Sell Signal**: Price rises 2% above Buy price
5. **Gain**: Calculate profit = (Sell - Lower) / Lower * 100

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js, Express, TypeScript |
| Frontend | React, Vite, TypeScript, Axios |
| CLI | Node.js, Yargs, Chalk, TypeScript |
| WebSocket | Node.js ws library |
| API Client | Binance API (REST) |

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
BINANCE_API_KEY=your_key
BINANCE_API_SECRET=your_secret
MONITOR_SYMBOL=BTCUSDT
MONITOR_INTERVAL=1m
CHECK_INTERVAL_SECONDS=10
```

### Frontend

The frontend proxies API calls to `http://localhost:3000/api` (configurable in vite.config.ts).

## Next Steps

- [ ] Phase 1 Tests: Add unit and integration tests
- [ ] Phase 2 Dashboard: Add price charts with Recharts
- [ ] Phase 2 Settings: Add configurable trading parameters
- [ ] Phase 2 Auth: Add user authentication
- [ ] Phase 4: Mobile app with React Native
- [ ] Phase 5: Desktop app with Electron
- [ ] Database: Add PostgreSQL for trade history
- [ ] Deployment: Dockerize and deploy to cloud

## Development

All components are TypeScript for type safety. Each package has its own:
- `package.json` with dependencies
- `tsconfig.json` for TypeScript compilation
- `README.md` with specific instructions
- `.gitignore` for version control

## Running All Components

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: CLI (as needed)
cd cli && npm start -- <command>
```

Access the app at `http://localhost:5173` (frontend) or use the CLI for command-line interactions.

## Troubleshooting

### Backend won't start
- Check if port 3000 is in use
- Verify Node.js version (ES2020 support required)
- Ensure all dependencies are installed: `npm install`

### Frontend connection issues
- Ensure backend is running on port 3000
- Check Vite proxy configuration in `vite.config.ts`
- Verify API URL in `services/api.ts`

### CLI commands fail
- Ensure backend is running
- Check API URL with `--api-url` flag
- Use `-h` flag for help on any command

## Contributing

Follow the TypeScript strict mode guidelines and ensure:
- All code is type-safe
- Components are modular and reusable
- Error handling is comprehensive
- Documentation is updated
