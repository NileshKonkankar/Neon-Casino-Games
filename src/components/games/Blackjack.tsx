import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Plus, Hand, Trophy, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card } from '../../types';

interface BlackjackProps {
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      let rank = parseInt(value);
      if (value === 'A') rank = 11;
      else if (['J', 'Q', 'K'].includes(value)) rank = 10;
      deck.push({ suit, value, rank });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const calculateScore = (hand: Card[]): number => {
  let score = hand.reduce((acc, card) => acc + card.rank, 0);
  let aces = hand.filter(card => card.value === 'A').length;
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }
  return score;
};

export default function Blackjack({ balance, onUpdateBalance }: BlackjackProps) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState('');
  const [winAmount, setWinAmount] = useState<number | null>(null);

  const startGame = () => {
    if (balance < bet) return;
    onUpdateBalance(-bet);
    const newDeck = createDeck();
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameState('playing');
    setMessage('');
    setWinAmount(null);

    if (calculateScore(pHand) === 21) {
      endGame('Blackjack!', 'win');
    }
  };

  const hit = () => {
    const newDeck = [...deck];
    const newHand = [...playerHand, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(newHand);
    if (calculateScore(newHand) > 21) {
      endGame('Bust!', 'lose');
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
  };

  const endGame = useCallback((msg: string, result: 'win' | 'lose' | 'push') => {
    setGameState('gameOver');
    setMessage(msg);
    if (result === 'win') {
      const win = bet * 2;
      onUpdateBalance(win);
      setWinAmount(win);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#ffffff']
      });
    } else if (result === 'push') {
      onUpdateBalance(bet);
      setWinAmount(bet);
    }
  }, [bet, onUpdateBalance]);

  useEffect(() => {
    if (gameState === 'dealerTurn') {
      const dScore = calculateScore(dealerHand);
      if (dScore < 17) {
        setTimeout(() => {
          const newDeck = [...deck];
          const newHand = [...dealerHand, newDeck.pop()!];
          setDeck(newDeck);
          setDealerHand(newHand);
        }, 800);
      } else {
        const pScore = calculateScore(playerHand);
        if (dScore > 21) endGame('Dealer Bust!', 'win');
        else if (dScore > pScore) endGame('Dealer Wins!', 'lose');
        else if (dScore < pScore) endGame('You Win!', 'win');
        else endGame('Push!', 'push');
      }
    }
  }, [gameState, dealerHand, deck, playerHand, endGame]);

  const renderCard = (card: Card, hidden = false, key: string) => (
    <div key={key} className="relative w-20 h-28 sm:w-24 sm:h-36 preserve-3d group">
      <motion.div
        initial={false}
        animate={{ rotateY: hidden ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="w-full h-full relative preserve-3d"
      >
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden bg-[#fdfdfd] rounded-xl border-2 border-zinc-300 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Subtle Linen Texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/linen.png')]" />
          {/* Lighting Highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 pointer-events-none" />
          
          <div className={`absolute top-2 left-2 font-black text-lg leading-none ${['hearts', 'diamonds'].includes(card.suit) ? 'text-rose-600' : 'text-zinc-900'}`}>
            {card.value}
            <div className="text-xs">{card.suit === 'hearts' && '♥'}{card.suit === 'diamonds' && '♦'}{card.suit === 'clubs' && '♣'}{card.suit === 'spades' && '♠'}</div>
          </div>
          
          <div className={`text-5xl drop-shadow-sm ${['hearts', 'diamonds'].includes(card.suit) ? 'text-rose-600' : 'text-zinc-900'}`}>
            {card.suit === 'hearts' && '♥'}
            {card.suit === 'diamonds' && '♦'}
            {card.suit === 'clubs' && '♣'}
            {card.suit === 'spades' && '♠'}
          </div>

          <div className={`absolute bottom-2 right-2 font-black text-lg leading-none rotate-180 ${['hearts', 'diamonds'].includes(card.suit) ? 'text-rose-600' : 'text-zinc-900'}`}>
            {card.value}
            <div className="text-xs">{card.suit === 'hearts' && '♥'}{card.suit === 'diamonds' && '♦'}{card.suit === 'clubs' && '♣'}{card.suit === 'spades' && '♠'}</div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#1a1a1a] rounded-xl border-2 border-zinc-700 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Intricate Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-emerald-500" />
          <div className="absolute inset-2 border border-emerald-500/30 rounded-lg flex items-center justify-center">
            <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute text-emerald-500/40 font-black text-5xl italic tracking-tighter select-none">VAULT</div>
          </div>
          {/* Lighting Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center max-w-5xl mx-auto w-full [perspective:2000px]">
      <div className="w-full bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col gap-12 [transform:rotateX(15deg)]">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full" />

        {/* Dealer Area */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Dealer's Hand</div>
          <div className="flex gap-4 min-h-[144px]">
            {dealerHand.map((card, i) => renderCard(card, gameState === 'playing' && i === 1, `dealer-${i}-${card.suit}-${card.value}`))}
          </div>
          {gameState !== 'betting' && gameState !== 'playing' && (
            <div className="text-white font-black text-xl">Score: {calculateScore(dealerHand)}</div>
          )}
        </div>

        {/* Message Area */}
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4"
              >
                {message}
                {winAmount && <span className="text-emerald-400">+{winAmount}</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Player Area */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 min-h-[144px]">
            {playerHand.map((card, i) => renderCard(card, false, `player-${i}-${card.suit}-${card.value}`))}
          </div>
          {gameState !== 'betting' && (
            <div className="text-white font-black text-xl">Your Score: {calculateScore(playerHand)}</div>
          )}
          <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Your Hand</div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-white/5 p-6 rounded-3xl border border-white/10">
          {gameState === 'betting' || gameState === 'gameOver' ? (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Current Bet</span>
                <div className="flex items-center gap-4">
                  {[10, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBet(amount)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${
                        bet === amount 
                        ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                disabled={balance < bet}
                className={`h-16 px-12 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                  balance < bet
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]'
                }`}
              >
                {gameState === 'gameOver' ? <RotateCcw className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                {gameState === 'gameOver' ? 'Play Again' : 'Deal Cards'}
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-6 w-full justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={hit}
                disabled={gameState !== 'playing'}
                className="h-16 flex-1 max-w-[200px] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all"
              >
                <Plus className="w-6 h-6" />
                Hit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stand}
                disabled={gameState !== 'playing'}
                className="h-16 flex-1 max-w-[200px] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 bg-white text-black hover:bg-white/90 transition-all"
              >
                <Hand className="w-6 h-6" />
                Stand
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
