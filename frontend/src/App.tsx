import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import webSocketService from './services/websocket';

function App() {
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket
    webSocketService.connect().catch((error) => {
      console.error('Failed to connect to WebSocket:', error);
    });

    // Monitor connection status
    webSocketService.onConnectionChange((connected) => {
      setWsConnected(connected);
    });

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Binance Trading Bot</h1>
        <div className="connection-status">
          <span className={`status-indicator ${wsConnected ? 'connected' : 'disconnected'}`}></span>
          {wsConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>
      <main className="app-main">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
