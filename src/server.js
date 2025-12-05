// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import gamesRoutes from './routes/games.js';
import betsRoutes from './routes/bets.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// DB connectivity check
app.get('/db-check', async (req, res) => {
  try {
    const users = await prisma.user.count();
    const games = await prisma.game.count();
    const bets = await prisma.bet.count();
    res.status(200).json({
      database: 'connected',
      users,
      games,
      bets,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      database: 'error',
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/bets', betsRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Boot
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CARTEL47 backend running on http://localhost:${PORT}`);
});
