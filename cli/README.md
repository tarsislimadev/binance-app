# Binance Trading Bot - CLI

Command-line interface for managing the Binance trading bot.

## Features

- **Start/Stop Monitoring**: Control price monitoring for any crypto pair
- **View Status**: Check monitoring status for all symbols or specific ones
- **Analyze Trades**: Get trade signals and analysis for klines
- **Get Prices**: View current 24h ticker data
- **Colored Output**: Easy-to-read colored terminal output

## Installation

```bash
npm install
npm run build
npm start -- --help
```

Or use the local development:
```bash
npm run dev -- --help
```

## Commands

### Start Monitoring

```bash
npm start -- start BTCUSDT
npm start -- start ETHUSDT -i 5m -c 15
```

Options:
- `-i, --interval` - Kline interval (default: 1m)
- `-c, --check-interval` - Check interval in seconds (default: 10)

### Stop Monitoring

```bash
npm start -- stop BTCUSDT
```

### Get Status

```bash
npm start -- status              # Get all symbols
npm start -- status BTCUSDT      # Get specific symbol
```

### Analyze Klines

```bash
npm start -- analyze BTCUSDT
npm start -- analyze ETHUSDT -i 5m -l 200
```

Options:
- `-i, --interval` - Kline interval (default: 1m)
- `-l, --limit` - Number of klines to analyze (default: 100)

### Get Price

```bash
npm start -- price BTCUSDT
npm start -- price ETHUSDT
```

## Global Options

- `--api-url` - Backend API URL (default: http://localhost:3000/api)
- `-h, --help` - Show help
- `-v, --version` - Show version

## Examples

```bash
# Start monitoring Bitcoin with 1-minute interval
npm start -- start BTCUSDT

# Check status of all monitoring
npm start -- status

# Analyze Ethereum with 15-minute candles
npm start -- analyze ETHUSDT -i 15m

# Get current Bitcoin price
npm start -- price BTCUSDT

# Stop monitoring
npm start -- stop BTCUSDT
```

## Technologies

- Node.js + TypeScript
- Yargs (command-line parsing)
- Chalk (colored output)
- Axios (HTTP client)

## Next Steps

- [ ] Add interactive monitoring mode with live updates
- [ ] Implement watch mode with periodic status checks
- [ ] Add configuration file support
- [ ] Create npm package for global installation
