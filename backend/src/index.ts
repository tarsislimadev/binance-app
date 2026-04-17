import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import priceRoutes from './routes/prices';
import analysisRoutes from './routes/analysis';
import monitorRoutes, { setMonitoringController } from './routes/monitor';
import { PriceWebSocketServer } from './websocket/PriceWebSocketServer';
import { TradingBotController } from './services/TradingBotController';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize WebSocket server
const wsServer = new PriceWebSocketServer(httpServer);

// Initialize Trading Bot Controller
const botController = new TradingBotController(wsServer);
setMonitoringController(botController);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    wsClients: wsServer.getClientCount(),
  });
});

// API Routes
app.use('/api/prices', priceRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/monitor', monitorRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Shutting down gracefully...');
  botController.stopAll();
  wsServer.close();
  httpServer.close();
  process.exit(0);
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ WebSocket server ready`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app, wsServer, botController };
