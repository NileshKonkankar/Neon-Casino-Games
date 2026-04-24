export type GameType = 'slots' | 'blackjack' | 'roulette' | 'lobby' | 'leaderboard';

export type ThemeType = 'neon' | 'cyberpunk' | 'retro';

export interface GameState {
  balance: number;
  activeGame: GameType;
}

export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  rank: number;
}
