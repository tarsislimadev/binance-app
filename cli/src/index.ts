#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import dotenv from 'dotenv';
import apiClient from './services/api';

dotenv.config();

const argv = yargs(hideBin(process.argv))
  .command(
    'start <symbol>',
    'Start monitoring a cryptocurrency symbol',
    (yargs) =>
      yargs
        .positional('symbol', {
          describe: 'Trading pair symbol (e.g., BTCUSDT)',
          type: 'string',
        })
        .option('interval', {
          alias: 'i',
          describe: 'Kline interval',
          default: '1m',
          type: 'string',
        })
        .option('check-interval', {
          alias: 'c',
          describe: 'Check interval in seconds',
          default: 10,
          type: 'number',
        }),
    async (args) => {
      await handleStart(args.symbol as string, args.interval as string, args['check-interval'] as number);
    }
  )
  .command(
    'stop <symbol>',
    'Stop monitoring a symbol',
    (yargs) =>
      yargs.positional('symbol', {
        describe: 'Trading pair symbol',
        type: 'string',
      }),
    async (args) => {
      await handleStop(args.symbol as string);
    }
  )
  .command(
    'status [symbol]',
    'Get monitoring status',
    (yargs) =>
      yargs.positional('symbol', {
        describe: 'Optional: Get status for specific symbol',
        type: 'string',
      }),
    async (args) => {
      await handleStatus(args.symbol as string | undefined);
    }
  )
  .command(
    'analyze <symbol>',
    'Analyze klines and get trade signals',
    (yargs) =>
      yargs
        .positional('symbol', {
          describe: 'Trading pair symbol',
          type: 'string',
        })
        .option('interval', {
          alias: 'i',
          describe: 'Kline interval',
          default: '1m',
          type: 'string',
        })
        .option('limit', {
          alias: 'l',
          describe: 'Number of klines to analyze',
          default: 100,
          type: 'number',
        }),
    async (args) => {
      await handleAnalyze(args.symbol as string, args.interval as string, args.limit as number);
    }
  )
  .command(
    'price <symbol>',
    'Get current price for a symbol',
    (yargs) =>
      yargs.positional('symbol', {
        describe: 'Trading pair symbol',
        type: 'string',
      }),
    async (args) => {
      await handlePrice(args.symbol as string);
    }
  )
  .option('api-url', {
    describe: 'API base URL',
    default: 'http://localhost:3000/api',
    type: 'string',
  })
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version').argv;

async function handleStart(symbol: string, interval: string, checkInterval: number) {
  console.log(chalk.blue(`Starting monitoring for ${symbol}...`));
  try {
    const result = await apiClient.startMonitoring(symbol, interval, checkInterval);
    if (result.success) {
      console.log(chalk.green(`✓ ${result.message}`));
      console.log(chalk.dim(`Monitoring ${symbol} at ${interval} intervals`));
    } else {
      console.error(chalk.red(`✗ Error: ${result.error}`));
    }
  } catch (error) {
    console.error(chalk.red(`✗ Failed to start monitoring: ${error instanceof Error ? error.message : error}`));
    process.exit(1);
  }
}

async function handleStop(symbol: string) {
  console.log(chalk.blue(`Stopping monitoring for ${symbol}...`));
  try {
    const result = await apiClient.stopMonitoring(symbol);
    if (result.success) {
      console.log(chalk.green(`✓ ${result.message}`));
    } else {
      console.error(chalk.red(`✗ Error: ${result.error}`));
    }
  } catch (error) {
    console.error(chalk.red(`✗ Failed to stop monitoring: ${error instanceof Error ? error.message : error}`));
    process.exit(1);
  }
}

async function handleStatus(symbol?: string) {
  try {
    const result = await apiClient.getStatus(symbol);
    if (result.success) {
      console.log(chalk.blue('\n📊 Monitoring Status\n'));
      if (symbol) {
        displayStatusItem(result.data);
      } else {
        Object.entries(result.data).forEach(([sym, status]: [string, any]) => {
          console.log(`${chalk.bold(sym)}:`);
          displayStatusItem(status);
          console.log();
        });
      }
    } else {
      console.error(chalk.red(`✗ Error: ${result.error}`));
    }
  } catch (error) {
    console.error(chalk.red(`✗ Failed to get status: ${error instanceof Error ? error.message : error}`));
    process.exit(1);
  }
}

async function handleAnalyze(symbol: string, interval: string, limit: number) {
  console.log(chalk.blue(`Analyzing ${symbol}...`));
  try {
    const result = await apiClient.analyze(symbol, interval, limit);
    if (result.success) {
      const { analysis, signal } = result;
      console.log(chalk.green(`\n✓ Analysis complete\n`));
      console.log(chalk.dim('Price Analysis:'));
      console.log(`  First Price:  $${Number(analysis.firstPrice).toFixed(2)}`);
      console.log(`  Lowest Price: $${Number(analysis.lowestPrice).toFixed(2)}`);
      console.log(`  Time Interval: ${Math.floor(analysis.timeInterval / 1000)}s`);

      if (analysis.buyPrice) {
        console.log(chalk.dim('\nBuy Signal:'));
        console.log(`  Buy Price:    $${Number(analysis.buyPrice).toFixed(2)}`);
      }

      if (analysis.sellPrice) {
        console.log(chalk.dim('\nSell Signal:'));
        console.log(`  Sell Price:   $${Number(analysis.sellPrice).toFixed(2)}`);
        console.log(`  Gain:         ${Number(analysis.gain).toFixed(2)}%`);
      }

      console.log(chalk.dim('\nTrade Signal:'));
      const signalColor = signal.type === 'BUY' ? 'green' : signal.type === 'SELL' ? 'red' : 'dim';
      console.log(`  ${chalk[signalColor](signal.type)}`);
      console.log(`  ${chalk.dim(signal.reason)}`);
    } else {
      console.error(chalk.red(`✗ Error: ${result.error}`));
    }
  } catch (error) {
    console.error(chalk.red(`✗ Failed to analyze: ${error instanceof Error ? error.message : error}`));
    process.exit(1);
  }
}

async function handlePrice(symbol: string) {
  try {
    const result = await apiClient.getTicker(symbol);
    if (result.success) {
      const ticker = result.data;
      console.log(chalk.blue(`\n${symbol} - 24h Ticker\n`));
      console.log(`  Last Price:      $${ticker.lastPrice}`);
      console.log(`  24h Change:      ${ticker.priceChangePercent}%`);
      console.log(`  24h High:        $${ticker.highPrice}`);
      console.log(`  24h Low:         $${ticker.lowPrice}`);
      console.log(`  Volume:          ${ticker.volume}\n`);
    } else {
      console.error(chalk.red(`✗ Error: ${result.error}`));
    }
  } catch (error) {
    console.error(chalk.red(`✗ Failed to get price: ${error instanceof Error ? error.message : error}`));
    process.exit(1);
  }
}

function displayStatusItem(status: any) {
  console.log(`  Status:      ${status.isRunning ? chalk.green('Running') : chalk.red('Stopped')}`);
  console.log(`  Symbol:      ${status.symbol}`);
  if (status.lastCheck) {
    console.log(`  Last Check:  ${new Date(status.lastCheck).toLocaleTimeString()}`);
  }
  if (status.lastSignal) {
    console.log(`  Last Signal: ${status.lastSignal.type} @ $${Number(status.lastSignal.price).toFixed(2)}`);
  }
  if (status.error) {
    console.log(`  Error:       ${chalk.red(status.error)}`);
  }
}
