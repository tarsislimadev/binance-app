import React, { useState } from 'react';
import apiClient from '../services/api';
import './TradeAnalysis.css';

export default function TradeAnalysis() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');
  const [limit, setLimit] = useState('100');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.analyzeKlines(symbol, interval, parseInt(limit));
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="trade-analysis">
      <div className="analysis-controls">
        <div className="input-group">
          <input
            type="text"
            placeholder="Symbol (e.g., BTCUSDT)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
          <select value={interval} onChange={(e) => setInterval(e.target.value)}>
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
          <input
            type="number"
            placeholder="Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            min="1"
            max="1000"
          />
          <button className="button button-primary" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {analysis && (
          <button className="button button-secondary" onClick={handleReset}>
            Clear
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          Analyzing...
        </div>
      )}

      {analysis && (
        <div className="analysis-results">
          <div className="results-grid">
            <div className="result-card">
              <h3>Price Analysis</h3>
              <div className="metric">
                <label>First Price</label>
                <value>${Number(analysis.analysis.firstPrice).toFixed(2)}</value>
              </div>
              <div className="metric">
                <label>Lowest Price</label>
                <value>${Number(analysis.analysis.lowestPrice).toFixed(2)}</value>
              </div>
              <div className="metric">
                <label>Price Difference</label>
                <value>${Number(analysis.analysis.firstPrice - analysis.analysis.lowestPrice).toFixed(2)}</value>
              </div>
              <div className="metric">
                <label>Time Interval</label>
                <value>{Math.floor(analysis.analysis.timeInterval / 1000)}s</value>
              </div>
            </div>

            {analysis.analysis.buyPrice && (
              <div className="result-card buy">
                <h3>Buy Signal</h3>
                <div className="metric">
                  <label>Buy Price</label>
                  <value>${Number(analysis.analysis.buyPrice).toFixed(2)}</value>
                </div>
                <div className="metric">
                  <label>Increase from Lowest</label>
                  <value>
                    {(
                      ((analysis.analysis.buyPrice - analysis.analysis.lowestPrice) /
                        analysis.analysis.lowestPrice) *
                      100
                    ).toFixed(2)}
                    %
                  </value>
                </div>
              </div>
            )}

            {analysis.analysis.sellPrice && (
              <div className="result-card sell">
                <h3>Sell Signal</h3>
                <div className="metric">
                  <label>Sell Price</label>
                  <value>${Number(analysis.analysis.sellPrice).toFixed(2)}</value>
                </div>
                <div className="metric">
                  <label>Gain</label>
                  <value className="gain">{Number(analysis.analysis.gain).toFixed(2)}%</value>
                </div>
              </div>
            )}
          </div>

          <div className="signal-card">
            <h3>Trade Signal</h3>
            <div className="signal-type" data-type={analysis.signal.type}>
              {analysis.signal.type}
            </div>
            <p className="signal-reason">{analysis.signal.reason}</p>
            <div className="signal-price">Price: ${Number(analysis.signal.price).toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
