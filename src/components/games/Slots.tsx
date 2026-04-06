import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Play, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SlotsProps {
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
const PAYOUTS: Record<string, number> = {
  '🍒': 2,
  '🍋': 3,
  '🍊': 4,
  '🍇': 5,
  '🔔': 10,
  '💎': 25,
  '7️⃣': 50
};

export default function Slots({ balance, onUpdateBalance }: SlotsProps) {
  const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [spinningReels, setSpinningReels] = useState([false, false, false]);

  const spin = () => {
    if (balance < bet || isSpinning) return;

    onUpdateBalance(-bet);
    setIsSpinning(true);
    setLastWin(null);
    setSpinningReels([true, true, true]);

    // Staggered reel stops
    [0, 1, 2].forEach((i) => {
      setTimeout(() => {
        setSpinningReels(prev => {
          const next = [...prev];
          next[i] = false;
          return next;
        });
        
        setReels(prev => {
          const next = [...prev];
          next[i] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          return next;
        });

        if (i === 2) {
          setIsSpinning(false);
        }
      }, 1000 + i * 500);
    });
  };

  useEffect(() => {
    if (!isSpinning && spinningReels.every(r => !r)) {
      checkWin();
    }
  }, [isSpinning, spinningReels]);

  const checkWin = () => {
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      const multiplier = PAYOUTS[reels[0]];
      const winAmount = bet * multiplier;
      onUpdateBalance(winAmount);
      setLastWin(winAmount);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#ffffff', '#f59e0b']
      });
    } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      const winAmount = Math.floor(bet * 1.5);
      onUpdateBalance(winAmount);
      setLastWin(winAmount);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />

        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Neon <span className="text-purple-400">Slots</span></h2>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Match 3 symbols to hit the jackpot</p>
        </div>

        {/* Reels Container */}
        <div className="flex gap-4 mb-12 h-64">
          {reels.map((symbol, i) => (
            <div key={i} className="flex-1 bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
              <AnimatePresence mode="wait">
                {spinningReels[i] ? (
                  <motion.div
                    key="spinning"
                    initial={{ y: -100 }}
                    animate={{ y: 100 }}
                    transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
                    className="text-7xl opacity-20"
                  >
                    {SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]}
                  </motion.div>
                ) : (
                  <motion.div
                    key={symbol}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  >
                    {symbol}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-white/5 p-6 rounded-3xl border border-white/10">
          <div className="flex flex-col gap-2">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Current Bet</span>
            <div className="flex items-center gap-4">
              {[10, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBet(amount)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    bet === amount 
                    ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {lastWin && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2 text-amber-400 font-black text-2xl"
                >
                  <Trophy className="w-6 h-6" />
                  +{lastWin}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={spin}
              disabled={isSpinning || balance < bet}
              className={`h-16 px-12 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                isSpinning || balance < bet
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]'
              }`}
            >
              {isSpinning ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
              {isSpinning ? 'Spinning...' : 'Spin'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Payout Table */}
      <div className="mt-12 grid grid-cols-4 sm:grid-cols-7 gap-4 max-w-4xl w-full">
        {Object.entries(PAYOUTS).map(([symbol, mult]) => (
          <div key={symbol} className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
            <div className="text-2xl mb-1">{symbol}</div>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">x{mult}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
