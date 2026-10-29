import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';

import { initDatabaseConnection } from './db/index.js';
import { seedInitialData } from './db/seed.js';
import { setupWebRTCSignaling } from './services/webrtc.js';

import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 5000;

// Socket.IO for WebRTC Signaling & Teleconsultation
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Setup WebRTC Signaling Gateway
setupWebRTCSignaling(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'HealthBridge Telemedicine API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Start Server & Initialize
export async function startServer(port: number = PORT): Promise<http.Server> {
  await initDatabaseConnection();
  await seedInitialData();

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`
=====================================================
🚀 HealthBridge Backend Server Running
📍 Port: http://localhost:${port}
🩺 Target: Nabha Rural Health Ecosystem
📡 WebRTC Signaling Gateway: Active
🔐 JWT Auth & RBAC Guards: Active
=====================================================
`);
      resolve(server);
    });
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, server };
