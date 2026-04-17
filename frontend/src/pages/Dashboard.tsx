import React, { useState } from 'react';
import PriceMonitor from '../components/PriceMonitor';
import TradeAnalysis from '../components/TradeAnalysis';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'monitor' | 'analysis'>('monitor');

  return (
    <div className="dashboard">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'monitor' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitor')}
        >
          Price Monitor
        </button>
        <button
          className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Trade Analysis
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'monitor' && <PriceMonitor />}
        {activeTab === 'analysis' && <TradeAnalysis />}
      </div>
    </div>
  );
}
