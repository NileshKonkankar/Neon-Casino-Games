import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Trophy, Disc } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RouletteProps {
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

type BetType = 'red' | 'black' | 'even' | 'odd' | number;

const NUMBERS = Array.from({ length: 37 }, (_, i) => i);
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function Roulette({ balance, onUpdateBalance }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetType | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (balance < betAmount || !selectedBet || isSpinning) return;

    onUpdateBalance(-betAmount);
    setIsSpinning(true);
    setWinningNumber(null);
    setLastWin(null);

    const newWinningNumber = Math.floor(Math.random() * 37);
    const extraRotations = 5 + Math.random() * 5;
    const targetRotation = rotation + (extraRotations * 360) + (newWinningNumber * (360 / 37));
    
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinningNumber(newWinningNumber);
      checkWin(newWinningNumber);
    }, 4000);
  };

  const checkWin = (num: number) => {
    let win = 0;
    const isRed = RED_NUMBERS.includes(num);
    const isBlack = num !== 0 && !isRed;

    if (typeof selectedBet === 'number') {
      if (selectedBet === num) win = betAmount * 35;
    } else if (selectedBet === 'red' && isRed) {
      win = betAmount * 2;
    } else if (selectedBet === 'black' && isBlack) {
      win = betAmount * 2;
    } else if (selectedBet === 'even' && num !== 0 && num % 2 === 0) {
      win = betAmount * 2;
    } else if (selectedBet === 'odd' && num % 2 !== 0) {
      win = betAmount * 2;
    }

    if (win > 0) {
      onUpdateBalance(win);
      setLastWin(win);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ffffff']
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
      <div className="w-full bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-12 items-center">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full" />

        {/* Wheel Section */}
        <div className="flex-1 flex flex-col items-center gap-8">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: [0.1, 0, 0.1, 1] }}
              className="w-full h-full rounded-full border-8 border-white/10 relative overflow-hidden bg-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              {NUMBERS.map((n) => (
                <div
                  key={n}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full origin-bottom flex flex-col items-center pt-2"
                  style={{ transform: `translateX(-50%) rotate(${n * (360 / 37)}deg)` }}
                >
                  <div className={`text-[10px] font-black ${n === 0 ? 'text-emerald-400' : RED_NUMBERS.includes(n) ? 'text-rose-500' : 'text-white/40'}`}>
                    {n}
                  </div>
                </div>
              ))}
              <div className="absolute inset-4 rounded-full border-4 border-white/5 bg-zinc-800 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]" />
              </div>
            </motion.div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-rose-500 z-10" />
          </div>

          <AnimatePresence mode="wait">
            {winningNumber !== null && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className={`text-6xl font-black mb-2 ${winningNumber === 0 ? 'text-emerald-400' : RED_NUMBERS.includes(winningNumber) ? 'text-rose-500' : 'text-white'}`}>
                  {winningNumber}
                </div>
                <div className="text-white/40 text-xs font-bold uppercase tracking-widest">Winning Number</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Betting Section */}
        <div className="flex-1 w-full flex flex-col gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedBet('red')}
              className={`h-16 rounded-2xl font-black uppercase tracking-widest border-2 transition-all ${
                selectedBet === 'red' ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-white/5 border-white/10 text-rose-500 hover:bg-white/10'
              }`}
            >
              Red
            </button>
            <button
              onClick={() => setSelectedBet('black')}
              className={`h-16 rounded-2xl font-black uppercase tracking-widest border-2 transition-all ${
                selectedBet === 'black' ? 'bg-zinc-800 border-zinc-700 text-white shadow-[0_0_20px_rgba(0,0,0,0.4)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              Black
            </button>
            <button
              onClick={() => setSelectedBet('even')}
              className={`h-16 rounded-2xl font-black uppercase tracking-widest border-2 transition-all ${
                selectedBet === 'even' ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              Even
            </button>
            <button
              onClick={() => setSelectedBet('odd')}
              className={`h-16 rounded-2xl font-black uppercase tracking-widest border-2 transition-all ${
                selectedBet === 'odd' ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              Odd
            </button>
          </div>

          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Bet Amount</span>
              <div className="flex items-center gap-2">
                {[10, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      betAmount === amount ? 'bg-rose-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
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
                    className="flex items-center gap-2 text-amber-400 font-black text-2xl"
                  >
                    <Trophy className="w-6 h-6" />
                    +{lastWin}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={spin}
                disabled={isSpinning || !selectedBet || balance < betAmount}
                className={`h-16 flex-1 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  isSpinning || !selectedBet || balance < betAmount
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_40px_rgba(244,63,94,0.5)]'
                }`}
              >
                <Disc className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
                {isSpinning ? 'Spinning...' : 'Spin Wheel'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
