# Binance Trading Bot - Implementation Plan

## Overview
Build a full-stack cryptocurrency trading application that monitors Binance prices and automatically executes buy/sell trades based on configurable price thresholds (2% buy, 2% sell targets).

## Current State
- Repo is empty except for README with trading logic checklist
- No code, no git history beyond initial commits
- Requirements documented as a checklist in README

## Chosen Stack
- **Backend**: Node.js/Express + TypeScript
- **Web Frontend**: React + TypeScript
- **Mobile**: React Native
- **Desktop**: Electron
- **CLI**: Node.js command-line tool
- **Database**: PostgreSQL (for trade history, user settings)
- **API Integration**: Binance API for price data and trading

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Binance Trading Bot                   │
├─────────────────────────────────────────────────────────┤
│
├─ Backend (Node.js/Express/TypeScript)
│  ├─ Price monitoring service (WebSocket from Binance)
│  ├─ Trading logic engine (buy/sell decision maker)
│  ├─ REST API (user management, trade history, settings)
│  ├─ Database (PostgreSQL)
│  └─ WebSocket server (real-time updates to clients)
│
├─ Web Frontend (React/TypeScript)
│  ├─ Dashboard (real-time price charts, trading status)
│  ├─ Settings panel (configure trading parameters)
│  ├─ Trade history
│  └─ Binance API key management (secure storage)
│
├─ Mobile App (React Native)
│  ├─ Same features as web frontend
│  ├─ Push notifications for trades
│  └─ Mobile-optimized UI
│
├─ Desktop App (Electron)
│  ├─ Native desktop application
│  ├─ Embedded backend or connect to remote backend
│  └─ System tray integration
│
└─ CLI Tool
   ├─ Start/stop trading bot
   ├─ View real-time prices
   ├─ Configure settings
   └─ View trade history
```

## Trading Logic (from README)
1. Get klines (Time, Price) from Binance
2. Detect price movements:
   - Find lowest price (Lower) and first occurrence (First)
   - Check if Lower < First
   - Verify time interval between First and Lower > 1 second
3. BUY trigger: Find Upper price after Lower where Upper >= Lower * 1.02 (2% above Lower)
4. SELL trigger: Find After price where After >= Upper * 1.02 (2% above Upper)
5. Calculate gain: (After - Lower) / Lower * 100

## Project Structure
```
binance-app/
├─ backend/                    # Node.js/Express API & services
│  ├─ src/
│  │  ├─ services/             # Trading logic, Binance API client
│  │  ├─ routes/               # Express routes
│  │  ├─ models/               # Database models (TypeORM/Sequelize)
│  │  ├─ websocket/            # Real-time updates
│  │  └─ utils/                # Helpers, validators
│  ├─ tests/
│  └─ package.json
│
├─ frontend/                   # React web app
│  ├─ src/
│  │  ├─ components/           # React components
│  │  ├─ pages/                # Page components
│  │  ├─ services/             # API client
│  │  ├─ hooks/                # Custom React hooks
│  │  └─ styles/               # CSS/Tailwind
│  ├─ tests/
│  └─ package.json
│
├─ mobile/                     # React Native app
│  ├─ src/
│  ├─ tests/
│  └─ package.json
│
├─ desktop/                    # Electron app
│  ├─ src/
│  │  ├─ main.ts              # Electron main process
│  │  └─ renderer.tsx         # React UI
│  ├─ tests/
│  └─ package.json
│
├─ cli/                        # CLI tool
│  ├─ src/
│  └─ package.json
│
├─ docker-compose.yml          # Local development environment
└─ README.md
```

## Implementation Phases

### Phase 1: Backend Foundation
- [ ] Set up Express/TypeScript project structure
- [ ] Create database schema (users, trades, price history, settings)
- [ ] Implement Binance API client (klines, WebSocket connection)
- [ ] Build price monitoring service
- [ ] Implement core trading logic engine
- [ ] Create REST API endpoints (auth, trades, settings, status)
- [ ] Add WebSocket server for real-time updates
- [ ] Write unit and integration tests

### Phase 2: Web Frontend
- [ ] Set up React/TypeScript project with Vite/Create React App
- [ ] Create dashboard layout (price chart, trading status)
- [ ] Implement WebSocket client for real-time updates
- [ ] Build settings panel for configuration
- [ ] Add trade history view
- [ ] Implement Binance API key input (with secure storage)
- [ ] Add authentication flow
- [ ] Deploy to web server

### Phase 3: CLI Tool
- [ ] Create CLI application with command framework
- [ ] Implement commands: start, stop, status, config, history
- [ ] Add real-time price display
- [ ] Connect to backend API

### Phase 4: Mobile App (React Native)
- [ ] Set up React Native project (Expo or bare workflow)
- [ ] Implement same features as web (dashboard, settings, history)
- [ ] Add push notifications for trades
- [ ] Build mobile-optimized UI
- [ ] Test on iOS and Android

### Phase 5: Desktop App (Electron)
- [ ] Create Electron project
- [ ] Embed React frontend
- [ ] Implement system tray integration
- [ ] Add native notifications
- [ ] Build installers for Windows, macOS, Linux

## Key Considerations
- **Security**: Store Binance API keys securely (encrypted, not in local storage)
- **Performance**: Use WebSockets for real-time data, cache price history
- **Reliability**: Implement error handling, reconnection logic, fallback mechanisms
- **Testing**: Unit tests for trading logic, integration tests for API
- **Deployment**: Dockerize backend, deploy to cloud (AWS/GCP/Azure)
- **Monitoring**: Add logging and monitoring for production stability

## Next Steps
1. Confirm this plan and any adjustments
2. Begin Phase 1 (Backend Foundation)
3. Set up initial project structure and dependencies
