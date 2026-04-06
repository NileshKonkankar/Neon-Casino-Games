export type GameType = 'slots' | 'blackjack' | 'roulette' | 'lobby';

export interface GameState {
  balance: number;
  activeGame: GameType;
}

export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  rank: number;
}
