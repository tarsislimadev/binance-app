# Binance Trading Bot

> 🤖 **A full-stack cryptocurrency trading application** that monitors Binance prices and generates automated buy/sell trading signals using a sophisticated trading algorithm.

[![CI/CD Pipeline](https://github.com/tarsislimadev/binance-app/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/tarsislimadev/binance-app/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🌟 Features

- ✅ **Real-time Price Monitoring** - Continuously monitor cryptocurrency prices
- ✅ **Automated Trading Signals** - Generate buy/sell signals based on sophisticated algorithm
- ✅ **Web Dashboard** - Beautiful React interface for monitoring and analysis
- ✅ **Command-Line Interface** - Full-featured CLI for server environments
- ✅ **WebSocket Support** - Real-time updates via WebSocket connections
- ✅ **Multi-Symbol Support** - Monitor multiple crypto pairs simultaneously
- ✅ **REST API** - Complete REST API for programmatic access
- ✅ **Docker Ready** - Production-ready Docker configurations
- ✅ **Fully Typed** - 100% TypeScript with strict mode enabled

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│       Binance Trading Bot Application       │
├─────────────────────────────────────────────┤
│                                             │
│  Backend (Express + TypeScript)             │
│  ├─ REST API                                │
│  ├─ WebSocket Server                        │
│  ├─ Trading Logic Engine                    │
│  ├─ Price Monitoring Service                │
│  └─ Binance API Client                      │
│                                             │
│  Clients                                    │
│  ├─ Web Dashboard (React + Vite)            │
│  ├─ CLI Tool (Yargs)                        │
│  └─ REST API Consumers                      │
│                                             │
└─────────────────────────────────────────────┘
```

## 📊 Trading Algorithm

The bot implements an intelligent 3-phase trading strategy:

### Phase 1: Price Analysis
1. Collect historical kline (candlestick) data
2. Identify the **lowest price** and **first price** in the period
3. Validate: `lowest < first` AND `time_interval > 1 second`

### Phase 2: Buy Signal
- **Trigger**: When price rises to ≥ `lowest_price × 1.02` (2% above lowest)
- **Signal**: Ready to enter trade

### Phase 3: Sell Signal
- **Trigger**: When price rises to ≥ `buy_price × 1.02` (2% above buy price)
- **Gain**: Automatically calculated

**Example:**
```
Lowest Price: $50,000
Buy Signal:   $51,000 (2% above lowest)
Sell Signal:  $51,020 (2% above buy)
Gain:         4% profit ($2,020 on $50,000)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Docker & Docker Compose (optional)

### Using npm

```bash
# Clone the repository
git clone <repository-url>
cd binance-app

# Terminal 1: Start Backend
cd backend
npm install
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Use CLI (optional)
cd cli
npm install
npm start -- start BTCUSDT
```

Access the app at **http://localhost:5173**

### Using Docker Compose

```bash
docker-compose up -d

# Backend runs on http://localhost:3000
# Frontend runs on http://localhost:5173
# PostgreSQL runs on localhost:5432
```

## 📖 Usage

### Web Dashboard

1. Open http://localhost:5173
2. Navigate to **Price Monitor** tab
3. Enter symbol (e.g., `BTCUSDT`)
4. Click **Start** to begin monitoring
5. View real-time trading signals

### Command-Line Interface

```bash
cd cli

# Start monitoring a symbol
npm start -- start BTCUSDT

# Check monitoring status
npm start -- status

# Analyze historical data for signals
npm start -- analyze ETHUSDT -i 15m

# Get current 24h ticker data
npm start -- price BTCUSDT

# Stop monitoring
npm start -- stop BTCUSDT
```

## 🔌 API Endpoints

### Price Data
```
GET /api/prices/:symbol?interval=1m&limit=100
GET /api/prices/:symbol/ticker
```

### Trading Analysis
```
POST /api/analysis/analyze
Body: { symbol: "BTCUSDT", interval: "1m", limit: 100 }
```

### Monitoring Control
```
POST /api/monitor/start
Body: { symbol: "BTCUSDT", interval: "1m", checkIntervalSeconds: 10 }

POST /api/monitor/stop
Body: { symbol: "BTCUSDT" }

GET /api/monitor/status
GET /api/monitor/status/:symbol
```

### WebSocket
```
ws://localhost:3000
Commands: subscribe, unsubscribe
```

## 🧪 Testing

### Run Tests
```bash
cd backend
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Generate coverage report
```

### Test Coverage
- TradingEngine: Buy/sell signal generation
- BinanceClient: API integration
- Price analysis algorithms
- Edge cases and error handling

## 🐳 Docker Deployment

### Build Images
```bash
# Backend
docker build -f backend/Dockerfile -t binance-bot-backend:latest ./backend

# Frontend
docker build -f frontend/Dockerfile -t binance-bot-frontend:latest ./frontend
```

### Run with Docker Compose
```bash
docker-compose up -d
docker-compose logs -f backend
docker-compose down
```

## 📁 Project Structure

```
binance-app/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── services/  # Business logic
│   │   ├── routes/    # API endpoints
│   │   └── websocket/ # WebSocket server
│   ├── tests/         # Jest unit tests
│   ├── Dockerfile     # Production image
│   └── README.md
│
├── frontend/          # React web application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Dashboard pages
│   │   └── services/   # API client
│   ├── Dockerfile     # Production image
│   └── README.md
│
├── cli/               # Command-line interface
│   ├── src/
│   ├── dist/          # Compiled output
│   └── README.md
│
├── docs/              # Documentation
│   └── STACK.md       # Technical architecture
│
├── .github/workflows/ # GitHub Actions CI/CD
├── docker-compose.yml # Development setup
└── PROJECT_STRUCTURE.md
```

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js, Express, TypeScript |
| Frontend | React, Vite, TypeScript, Axios |
| CLI | Node.js, Yargs, Chalk |
| Testing | Jest, ts-jest |
| Container | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| API | REST, WebSocket |

## 📊 Project Statistics

- **Backend**: 980 lines of TypeScript
- **Frontend**: 540 lines of React/TypeScript
- **CLI**: 287 lines of Node.js/TypeScript
- **Tests**: Comprehensive Jest test suite
- **Documentation**: 10,000+ lines

## 🔒 Security Notes

- Never commit Binance API keys to version control
- Use environment variables for sensitive data
- Enable API IP whitelisting on Binance
- Consider using testnet for development

## 📚 Documentation

- [Architecture Documentation](./docs/STACK.md) - Technical deep dive
- [Project Structure](./PROJECT_STRUCTURE.md) - Complete guide
- [Backend README](./backend/README.md) - Backend specific docs
- [Frontend README](./frontend/README.md) - Frontend specific docs
- [CLI README](./cli/README.md) - CLI documentation

## 🚦 Development Status

| Phase | Component | Status |
|-------|-----------|--------|
| ✅ Phase 1 | Backend Foundation | Complete |
| ✅ Phase 2 | Web Frontend | Complete |
| ✅ Phase 3 | CLI Tool | Complete |
| ✅ Phase 1 | Testing & CI/CD | Complete |
| ⏳ Phase 2 | Dashboard Charts | Coming Soon |
| ⏳ Phase 2 | Authentication | Coming Soon |
| ⏳ Phase 4 | Mobile App | Planned |
| ⏳ Phase 5 | Desktop App | Planned |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is a educational trading bot. Always:
- Start with small amounts
- Test thoroughly with testnet
- Understand trading risks
- Monitor your trades actively
- Do your own research

## 💡 Support

For issues, questions, or suggestions:
1. Check existing [documentation](./docs/)
2. Review [GitHub Issues](https://github.com/tarsislimadev/binance-app/issues)
3. Submit a new issue with details

## 🎉 Acknowledgments

Built with ❤️ for the cryptocurrency trading community.

---

**Ready to start trading?** Follow the [Quick Start](#-quick-start) guide above!

