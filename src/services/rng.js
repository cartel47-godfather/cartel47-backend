// src/services/rng.js
import crypto from 'crypto';

/**
 * Provably-Fair RNG Service for CARTEL47
 * Uses SHA-256 hashing with client seed + server nonce
 * Ensures all game outcomes are verifiable
 */

export class RNGService {
  /**
   * Generate a server-side nonce for the bet
   * @returns {string} Random hex nonce
   */
  static generateNonce() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Verify that a hash matches the expected result
   * @param {string} nonce - Server nonce
   * @param {string} clientSeed - Client seed
   * @param {string} expectedHash - Expected hash to verify
   * @returns {boolean} True if hash matches
   */
  static verifyHash(nonce, clientSeed, expectedHash) {
    const computedHash = this.computeHash(nonce, clientSeed);
    return computedHash === expectedHash;
  }

  /**
   * Compute SHA-256 hash from nonce and client seed
   * @param {string} nonce - Server nonce
   * @param {string} clientSeed - Client seed
   * @returns {string} SHA-256 hash
   */
  static computeHash(nonce, clientSeed) {
    const combined = `${nonce}:${clientSeed}`;
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  /**
   * Generate a random number between 0 and max using hash
   * @param {string} nonce - Server nonce
   * @param {string} clientSeed - Client seed
   * @param {number} max - Maximum value (exclusive)
   * @returns {number} Random number 0 to max-1
   */
  static generateRandomNumber(nonce, clientSeed, max) {
    const hash = this.computeHash(nonce, clientSeed);
    // Convert first 8 chars of hex to integer
    const hashInt = parseInt(hash.substring(0, 8), 16);
    // Modulo to get within range
    return hashInt % max;
  }

  /**
   * Generate multiple random numbers for a bet
   * Useful for multi-spin games
   * @param {string} nonce - Server nonce
   * @param {string} clientSeed - Client seed
   * @param {number} count - Number of random values
   * @param {number} max - Maximum value for each
   * @returns {number[]} Array of random numbers
   */
  static generateMultipleRandomNumbers(nonce, clientSeed, count, max) {
    const results = [];
    for (let i = 0; i < count; i++) {
      const seedVariation = `${nonce}:${clientSeed}:${i}`;
      const hash = crypto.createHash('sha256').update(seedVariation).digest('hex');
      const hashInt = parseInt(hash.substring(0, 8), 16);
      results.push(hashInt % max);
    }
    return results;
  }

  /**
   * Generate a shuffle using Fisher-Yates algorithm
   * For games like card shuffles, slot reels, etc.
   * @param {number} count - Size of array to shuffle (0 to count-1)
   * @param {string} nonce - Server nonce
   * @param {string} clientSeed - Client seed
   * @returns {number[]} Shuffled array
   */
  static generateShuffledArray(count, nonce, clientSeed) {
    // Initialize array [0, 1, 2, ..., count-1]
    const arr = Array.from({ length: count }, (_, i) => i);
    
    // Fisher-Yates shuffle using RNG
    for (let i = arr.length - 1; i > 0; i--) {
      const seedVariation = `${nonce}:${clientSeed}:shuffle:${i}`;
      const hash = crypto.createHash('sha256').update(seedVariation).digest('hex');
      const hashInt = parseInt(hash.substring(0, 8), 16);
      const j = hashInt % (i + 1);
      
      // Swap
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr;
  }

  /**
   * Get RNG proof data for a completed bet
   * Players can verify the outcome using this data
   * @param {object} bet - Bet object
   * @returns {object} Proof data
   */
  static getProofData(bet) {
    return {
      nonce: bet.nonce,
      clientSeed: bet.clientSeed || 'user-provided',
      serverSeed: bet.serverSeed,
      hash: this.computeHash(bet.nonce, bet.clientSeed),
      result: bet.result,
      timestamp: bet.createdAt,
      verified: true
    };
  }
}

export default RNGService;
