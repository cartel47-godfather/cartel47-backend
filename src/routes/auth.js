// src/routes/auth.js
import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { verifyMessage } from 'ethers';

const prisma = new PrismaClient();
const router = express.Router();

// In-memory nonce store with TTL (5 minutes)
const nonceStore = new Map();
const NONCE_TTL = 5 * 60 * 1000; // 5 minutes
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

// Clean up expired nonces every minute
setInterval(() => {
  const now = Date.now();
  for (const [nonce, data] of nonceStore.entries()) {
    if (now - data.createdAt > NONCE_TTL) {
      nonceStore.delete(nonce);
    }
  }
}, 60 * 1000);

// POST /api/auth/nonce - Generate a nonce for wallet signature
router.post('/nonce', (req, res) => {
  try {
    const nonce = crypto.randomBytes(32).toString('hex');
    const createdAt = Date.now();
    const expiresIn = NONCE_TTL / 1000; // in seconds

    nonceStore.set(nonce, {
      createdAt,
      expiresAt: createdAt + NONCE_TTL,
    });

    res.json({
      nonce,
      expiresIn,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

// POST /api/auth/verify - Verify wallet signature and issue JWT
router.post('/verify', async (req, res) => {
  try {
    const { address, nonce, signature } = req.body;

    // Validate input
    if (!address || !nonce || !signature) {
      return res.status(400).json({ error: 'Missing required fields: address, nonce, signature' });
    }

    // Check if nonce exists and hasn't expired
    const nonceData = nonceStore.get(nonce);
    if (!nonceData) {
      return res.status(400).json({ error: 'Invalid or expired nonce' });
    }

    // Verify the signature
    const message = `Sign this message to authenticate with CARTEL47:\n\nNonce: ${nonce}`;
    let recoveredAddress;

    try {
      recoveredAddress = verifyMessage(message, signature);
    } catch (sigError) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Verify recovered address matches provided address
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature does not match wallet address' });
    }

    // Consume the nonce
    nonceStore.delete(nonce);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: address.toLowerCase(),
          email: null,
          username: null,
          isActive: true,
        },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        walletAddress: user.walletAddress,
        isAdmin: user.isAdmin || false,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        isAdmin: user.isAdmin,
      },
      expiresIn: JWT_EXPIRY,
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;
