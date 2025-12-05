// src/services/games.js
/**
 * CARTEL47 Game Configurations
 * 47 Provably-Fair Casino Games
 * All games use SHA-256 RNG verification
 */

export const GAMES = {
  // SLOT GAMES (1-10)
  '001': { id: '001', name: 'Diamond Rush', category: 'slots', rtp: 0.96, volatility: 'medium', lines: 25, reels: 5 },
  '002': { id: '002', name: 'Gold Strike', category: 'slots', rtp: 0.95, volatility: 'high', lines: 25, reels: 5 },
  '003': { id: '003', name: 'Crypto Kings', category: 'slots', rtp: 0.97, volatility: 'low', lines: 20, reels: 5 },
  '004': { id: '004', name: 'Midnight Riches', category: 'slots', rtp: 0.96, volatility: 'medium', lines: 30, reels: 5 },
  '005': { id: '005', name: 'Thunder Vault', category: 'slots', rtp: 0.94, volatility: 'high', lines: 25, reels: 5 },
  '006': { id: '006', name: 'Emerald Flush', category: 'slots', rtp: 0.97, volatility: 'low', lines: 15, reels: 3 },
  '007': { id: '007', name: 'Lucky Sevens', category: 'slots', rtp: 0.95, volatility: 'medium', lines: 5, reels: 3 },
  '008': { id: '008', name: 'Aztec Treasures', category: 'slots', rtp: 0.96, volatility: 'high', lines: 25, reels: 5 },
  '009': { id: '009', name: 'Cosmic Quest', category: 'slots', rtp: 0.97, volatility: 'medium', lines: 20, reels: 5 },
  '010': { id: '010', name: 'Cartel Fortune', category: 'slots', rtp: 0.96, volatility: 'medium', lines: 25, reels: 5 },

  // TABLE GAMES (11-25)
  '011': { id: '011', name: 'Blackjack', category: 'table', rtp: 0.99, volatility: 'low', minBet: 1, maxBet: 10000 },
  '012': { id: '012', name: 'European Roulette', category: 'table', rtp: 0.973, volatility: 'low', minBet: 1, maxBet: 5000 },
  '013': { id: '013', name: 'American Roulette', category: 'table', rtp: 0.947, volatility: 'low', minBet: 1, maxBet: 5000 },
  '014': { id: '014', name: 'Baccarat', category: 'table', rtp: 0.985, volatility: 'low', minBet: 1, maxBet: 10000 },
  '015': { id: '015', name: 'Craps', category: 'table', rtp: 0.986, volatility: 'medium', minBet: 1, maxBet: 5000 },
  '016': { id: '016', name: 'Poker - Texas Hold\'em', category: 'table', rtp: 0.98, volatility: 'high', minBet: 10, maxBet: 10000 },
  '017': { id: '017', name: 'Three Card Poker', category: 'table', rtp: 0.966, volatility: 'medium', minBet: 5, maxBet: 5000 },
  '018': { id: '018', name: 'Pai Gow Poker', category: 'table', rtp: 0.972, volatility: 'medium', minBet: 5, maxBet: 5000 },
  '019': { id: '019', name: 'Caribbean Stud', category: 'table', rtp: 0.975, volatility: 'high', minBet: 5, maxBet: 5000 },
  '020': { id: '020', name: 'Keno', category: 'table', rtp: 0.925, volatility: 'high', minBet: 1, maxBet: 1000 },
  '021': { id: '021', name: 'Bingo', category: 'table', rtp: 0.940, volatility: 'medium', minBet: 1, maxBet: 500 },
  '022': { id: '022', name: 'Sic Bo', category: 'table', rtp: 0.972, volatility: 'medium', minBet: 1, maxBet: 5000 },
  '023': { id: '023', name: 'Red Dog', category: 'table', rtp: 0.961, volatility: 'medium', minBet: 1, maxBet: 1000 },
  '024': { id: '024', name: 'War Card Game', category: 'table', rtp: 0.955, volatility: 'low', minBet: 1, maxBet: 500 },
  '025': { id: '025', name: 'Video Poker', category: 'table', rtp: 0.99, volatility: 'medium', minBet: 1, maxBet: 10000 },

  // ORIGINAL CARTEL47 GAMES (26-37)
  '026': { id: '026', name: 'Crash', category: 'original', rtp: 0.99, volatility: 'high', minBet: 0.01, maxBet: 100 },
  '027': { id: '027', name: 'Plinko', category: 'original', rtp: 0.97, volatility: 'medium', minBet: 0.1, maxBet: 50 },
  '028': { id: '028', name: 'Dice Roll', category: 'original', rtp: 0.99, volatility: 'medium', minBet: 0.01, maxBet: 100 },
  '029': { id: '029', name: 'Coin Flip', category: 'original', rtp: 0.99, volatility: 'low', minBet: 0.01, maxBet: 50 },
  '030': { id: '030', name: 'Wheel of Fortune', category: 'original', rtp: 0.96, volatility: 'high', minBet: 1, maxBet: 100 },
  '031': { id: '031', name: 'Lucky Numbers', category: 'original', rtp: 0.95, volatility: 'high', minBet: 0.1, maxBet: 100 },
  '032': { id: '032', name: 'Scratch Cards', category: 'original', rtp: 0.94, volatility: 'high', minBet: 0.5, maxBet: 50 },
  '033': { id: '033', name: 'Treasure Hunt', category: 'original', rtp: 0.97, volatility: 'medium', minBet: 1, maxBet: 100 },
  '034': { id: '034', name: 'Rock Paper Scissors', category: 'original', rtp: 0.995, volatility: 'low', minBet: 0.01, maxBet: 50 },
  '035': { id: '035', name: 'Lightning Link', category: 'original', rtp: 0.96, volatility: 'high', minBet: 0.1, maxBet: 100 },
  '036': { id: '036', name: 'Mystery Box', category: 'original', rtp: 0.97, volatility: 'high', minBet: 1, maxBet: 100 },
  '037': { id: '037', name: 'Ladder Climb', category: 'original', rtp: 0.96, volatility: 'medium', minBet: 0.5, maxBet: 50 },

  // LIVE GAMES (38-47)
  '038': { id: '038', name: 'Live Blackjack', category: 'live', rtp: 0.99, volatility: 'low', minBet: 10, maxBet: 50000 },
  '039': { id: '039', name: 'Live Roulette', category: 'live', rtp: 0.973, volatility: 'low', minBet: 5, maxBet: 25000 },
  '040': { id: '040', name: 'Live Baccarat', category: 'live', rtp: 0.985, volatility: 'low', minBet: 10, maxBet: 50000 },
  '041': { id: '041', name: 'Live Poker', category: 'live', rtp: 0.985, volatility: 'high', minBet: 20, maxBet: 50000 },
  '042': { id: '042', name: 'Live Craps', category: 'live', rtp: 0.986, volatility: 'medium', minBet: 10, maxBet: 25000 },
  '043': { id: '043', name: 'Live Sic Bo', category: 'live', rtp: 0.972, volatility: 'medium', minBet: 5, maxBet: 10000 },
  '044': { id: '044', name: 'Live Dragon Tiger', category: 'live', rtp: 0.96, volatility: 'low', minBet: 5, maxBet: 10000 },
  '045': { id: '045', name: 'Live Pai Gow', category: 'live', rtp: 0.972, volatility: 'medium', minBet: 10, maxBet: 25000 },
  '046': { id: '046', name: 'Live Caribbean Stud', category: 'live', rtp: 0.975, volatility: 'high', minBet: 10, maxBet: 25000 },
  '047': { id: '047', name: 'Cartel VIP Suite', category: 'live', rtp: 0.99, volatility: 'medium', minBet: 100, maxBet: 100000 }
};

/**
 * Get game by ID
 */
export function getGameById(gameId) {
  return GAMES[gameId];
}

/**
 * Get all games by category
 */
export function getGamesByCategory(category) {
  return Object.values(GAMES).filter(g => g.category === category);
}

/**
 * Validate game exists
 */
export function gameExists(gameId) {
  return gameId in GAMES;
}

export default GAMES;
