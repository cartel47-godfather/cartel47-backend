const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { generateNonce, computeHash, generateRandomNumber, generateMultipleRandomNumbers, getProofData } = require('../services/rng');
const { getGameById, gameExists } = require('../services/games');

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'cartel47-secret-key';
const HOUSE_EDGE = process.env.HOUSE_EDGE || 0.03; // 3% default house edge

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.walletAddress = decoded.walletAddress;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

/**
 * POST /api/bets/place
 * Place a new bet on a game
 * Body: { gameId, betAmount, clientSeed }
 * Returns: { betId, gameId, betAmount, nonce, clientSeed, rtp, volatility, minBet, maxBet }
 */
router.post('/place', verifyToken, async (req, res) => {
  try {
    const { gameId, betAmount, clientSeed } = req.body;

    // Validate inputs
    if (!gameId || !betAmount || !clientSeed) {
      return res.status(400).json({ error: 'Missing required fields: gameId, betAmount, clientSeed' });
    }

    // Validate game exists
    if (!gameExists(gameId)) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const game = getGameById(gameId);

    // Validate bet amount
    if (betAmount < game.minBet) {
      return res.status(400).json({ error: `Minimum bet is ${game.minBet}` });
    }
    if (betAmount > game.maxBet) {
      return res.status(400).json({ error: `Maximum bet is ${game.maxBet}` });
    }

    // Generate server-side nonce for provably-fair RNG
    const nonce = generateNonce();

    // Create bet record in database
    const bet = await prisma.bet.create({
      data: {
        userId: req.userId,
        gameId,
        betAmount,
        nonce,
        clientSeed,
        status: 'PENDING',
        outcome: null,
        winAmount: null,
      },
    });

    // Return bet with game info and proof data components
    res.status(201).json({
      betId: bet.id,
      userId: req.userId,
      gameId: bet.gameId,
      gameName: game.name,
      gameCategory: game.category,
      betAmount: bet.betAmount,
      nonce: bet.nonce,
      clientSeed: bet.clientSeed,
      rtp: game.rtp,
      volatility: game.volatility,
      minBet: game.minBet,
      maxBet: game.maxBet,
      status: bet.status,
      createdAt: bet.createdAt,
    });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ error: 'Failed to place bet' });
  }
});

/**
 * GET /api/bets/:betId
 * Get bet details with proof data
 * Returns: Bet with provably-fair proof components
 */
router.get('/:betId', verifyToken, async (req, res) => {
  try {
    const { betId } = req.params;

    const bet = await prisma.bet.findUnique({
      where: { id: betId },
    });

    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }

    if (bet.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const game = getGameById(bet.gameId);

    // Get proof data for verification
    const proofData = getProofData(bet.nonce, bet.clientSeed);

    res.json({
      betId: bet.id,
      userId: bet.userId,
      gameId: bet.gameId,
      gameName: game.name,
      gameCategory: game.category,
      betAmount: bet.betAmount,
      status: bet.status,
      outcome: bet.outcome,
      winAmount: bet.winAmount,
      proofData: {
        nonce: proofData.nonce,
        clientSeed: proofData.clientSeed,
        hash: proofData.hash,
        randomNumber: proofData.randomNumber,
      },
      rtp: game.rtp,
      volatility: game.volatility,
      createdAt: bet.createdAt,
      settledAt: bet.settledAt,
    });
  } catch (error) {
    console.error('Error fetching bet:', error);
    res.status(500).json({ error: 'Failed to fetch bet' });
  }
});

/**
 * POST /api/bets/:betId/settle
 * Settle a completed bet using RNG and calculate win/loss
 * Body: { } (empty, uses existing nonce + clientSeed)
 * Returns: Settled bet with outcome and winAmount
 */
router.post('/:betId/settle', verifyToken, async (req, res) => {
  try {
    const { betId } = req.params;

    const bet = await prisma.bet.findUnique({
      where: { id: betId },
    });

    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }

    if (bet.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (bet.status !== 'PENDING') {
      return res.status(400).json({ error: 'Bet is already settled' });
    }

    const game = getGameById(bet.gameId);

    // Generate outcome using RNG
    // Random number between 0-100 representing win probability
    const randomNumber = generateRandomNumber(bet.nonce, bet.clientSeed);
    const winThreshold = game.rtp * 100; // Convert RTP to percentage (e.g., 0.96 -> 96)

    // Determine if player wins
    const playerWins = randomNumber <= winThreshold;
    let winAmount = 0;
    let outcome = 'LOSS';

    if (playerWins) {
      outcome = 'WIN';
      // Calculate payout based on volatility
      const payoutMultiplier = 1 + (game.volatility === 'high' ? 2 : game.volatility === 'medium' ? 1 : 0.5);
      winAmount = bet.betAmount * payoutMultiplier * (1 - HOUSE_EDGE);
    }

    // Update bet with settlement data
    const settledBet = await prisma.bet.update({
      where: { id: betId },
      data: {
        status: 'SETTLED',
        outcome,
        winAmount,
        settledAt: new Date(),
      },
    });

    // Get proof data
    const proofData = getProofData(bet.nonce, bet.clientSeed);

    res.json({
      betId: settledBet.id,
      userId: settledBet.userId,
      gameId: settledBet.gameId,
      gameName: game.name,
      betAmount: settledBet.betAmount,
      outcome: settledBet.outcome,
      winAmount: settledBet.winAmount,
      status: settledBet.status,
      proofData: {
        nonce: proofData.nonce,
        clientSeed: proofData.clientSeed,
        hash: proofData.hash,
        randomNumber: proofData.randomNumber,
      },
      settlementReason: 'Provably-fair settlement with RNG',
      settledAt: settledBet.settledAt,
    });
  } catch (error) {
    console.error('Error settling bet:', error);
    res.status(500).json({ error: 'Failed to settle bet' });
  }
});

/**
 * GET /api/bets/user/:userId
 * Get all bets for a user with betting history
 * Query params: status (PENDING|SETTLED), limit, offset
 * Returns: Array of bets with pagination
 */
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 20, offset = 0 } = req.query;

    // Ensure user can only fetch their own bet history
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const whereClause = { userId };
    if (status) {
      whereClause.status = status;
    }

    const bets = await prisma.bet.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    const total = await prisma.bet.count({ where: whereClause });

    // Enrich with game info
    const enrichedBets = bets.map((bet) => {
      const game = getGameById(bet.gameId);
      return {
        betId: bet.id,
        gameId: bet.gameId,
        gameName: game.name,
        gameCategory: game.category,
        betAmount: bet.betAmount,
        outcome: bet.outcome,
        winAmount: bet.winAmount,
        status: bet.status,
        createdAt: bet.createdAt,
        settledAt: bet.settledAt,
      };
    });

    res.json({
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      bets: enrichedBets,
    });
  } catch (error) {
    console.error('Error fetching user bets:', error);
    res.status(500).json({ error: 'Failed to fetch bet history' });
  }
});

module.exports = router;
