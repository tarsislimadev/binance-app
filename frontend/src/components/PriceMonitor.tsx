import React, { useState } from 'react';
import apiClient from '../services/api';
import './PriceMonitor.css';

export default function PriceMonitor() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');
  const [monitoring, setMonitoring] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    console.log(`[UI] Start monitoring requested for symbol=${symbol}, interval=${interval}`);
    try {
      await apiClient.startMonitoring(symbol, interval);
      setMonitoring(true);
      // Fetch updated status
      const result = await apiClient.getMonitoringStatus(symbol);
      setStatus(result.data);
      console.log(`[UI] Monitoring started for symbol=${symbol}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start monitoring');
      console.error('[UI] Failed to start monitoring:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    setError(null);
    console.log(`[UI] Stop monitoring requested for symbol=${symbol}`);
    try {
      await apiClient.stopMonitoring(symbol);
      setMonitoring(false);
      setStatus(null);
      console.log(`[UI] Monitoring stopped for symbol=${symbol}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop monitoring');
      console.error('[UI] Failed to stop monitoring:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    console.log(`[UI] Refresh status requested for symbol=${symbol}`);
    try {
      const result = await apiClient.getMonitoringStatus(symbol);
      setStatus(result.data);
      console.log(`[UI] Status refreshed for symbol=${symbol}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
      console.error('[UI] Failed to refresh status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="price-monitor">
      <div className="monitor-controls">
        <div className="input-group">
          <input
            type="text"
            placeholder="Symbol (e.g., BTCUSDT)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            disabled={monitoring}
          />
          <select value={interval} onChange={(e) => setInterval(e.target.value)} disabled={monitoring}>
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
          {!monitoring ? (
            <button className="button button-primary" onClick={handleStart} disabled={loading}>
              {loading ? 'Starting...' : 'Start'}
            </button>
          ) : (
            <button className="button button-danger" onClick={handleStop} disabled={loading}>
              {loading ? 'Stopping...' : 'Stop'}
            </button>
          )}
        </div>
        {monitoring && (
          <button className="button button-secondary" onClick={handleRefresh} disabled={loading}>
            Refresh Status
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && !monitoring && (
        <div className="loading">
          <div className="spinner"></div>
          Loading...
        </div>
      )}

      {status && (
        <div className="monitor-status">
          <h3>Monitoring Status</h3>
          <div className="status-grid">
            <div className="status-item">
              <label>Symbol</label>
              <value>{status.symbol}</value>
            </div>
            <div className="status-item">
              <label>Status</label>
              <value className={`status ${status.isRunning ? 'running' : 'stopped'}`}>
                {status.isRunning ? 'Running' : 'Stopped'}
              </value>
            </div>
            <div className="status-item">
              <label>Last Check</label>
              <value>{status.lastCheck ? new Date(status.lastCheck).toLocaleTimeString() : 'N/A'}</value>
            </div>
            {status.lastSignal && (
              <>
                <div className="status-item">
                  <label>Last Signal</label>
                  <value>{status.lastSignal.type}</value>
                </div>
                <div className="status-item">
                  <label>Signal Price</label>
                  <value>${Number(status.lastSignal.price).toFixed(2)}</value>
                </div>
              </>
            )}
          </div>
          {status.error && <div className="alert alert-error">{status.error}</div>}
        </div>
      )}
    </div>
  );
}
