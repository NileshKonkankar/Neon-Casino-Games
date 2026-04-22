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
  const [betAmount, setBetAmount] = useState<number | ''>(10);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const currentBetAmount = typeof betAmount === 'number' ? betAmount : 0;

  const spin = () => {
    if (balance < currentBetAmount || !selectedBet || isSpinning || currentBetAmount <= 0) return;

    onUpdateBalance(-currentBetAmount);
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
      if (selectedBet === num) win = currentBetAmount * 35;
    } else if (selectedBet === 'red' && isRed) {
      win = currentBetAmount * 2;
    } else if (selectedBet === 'black' && isBlack) {
      win = currentBetAmount * 2;
    } else if (selectedBet === 'even' && num !== 0 && num % 2 === 0) {
      win = currentBetAmount * 2;
    } else if (selectedBet === 'odd' && num % 2 !== 0) {
      win = currentBetAmount * 2;
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
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center max-w-6xl mx-auto w-full [perspective:2000px]">
      <div className="w-full bg-zinc-900 border-x-8 border-t-8 border-b-[20px] border-zinc-800 rounded-[60px] p-8 backdrop-blur-xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col lg:flex-row gap-12 items-center [transform:rotateX(10deg)]">
        {/* Machine Accents */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Wheel Section */}
        <div className="flex-1 flex flex-col items-center gap-8 [perspective:1000px]">
          <div className="relative w-64 h-64 sm:w-96 sm:h-96 [transform:rotateX(45deg)]">
            {/* Outer Wood Ring */}
            <div className="absolute inset-[-20px] rounded-full border-[24px] border-[#3d2b1f] shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-90" />
            
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: [0.1, 0, 0.1, 1] }}
              className="w-full h-full rounded-full border-[12px] border-zinc-800 relative overflow-hidden bg-zinc-900 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] preserve-3d"
            >
              {/* Inner Metallic Ring */}
              <div className="absolute inset-0 rounded-full border-[20px] border-amber-600/10" />
              
              {NUMBERS.map((n) => (
                <div
                  key={n}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-full origin-bottom flex flex-col items-center pt-2"
                  style={{ transform: `translateX(-50%) rotate(${n * (360 / 37)}deg)` }}
                >
                  <div className={`text-xs font-black px-1 rounded-sm shadow-sm ${n === 0 ? 'bg-emerald-600 text-white' : RED_NUMBERS.includes(n) ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-white'}`}>
                    {n}
                  </div>
                </div>
              ))}
              
              {/* Center Hub (Metallic) */}
              <div className="absolute inset-12 rounded-full border-8 border-zinc-700 bg-gradient-to-br from-zinc-400 via-zinc-800 to-zinc-900 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-800 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] border-2 border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full opacity-50" />
                </div>
              </div>

              {/* Ball Animation */}
              {isSpinning && (
                <motion.div
                  animate={{ rotate: -rotation * 2 }}
                  transition={{ duration: 4, ease: [0.1, 0, 0.1, 1] }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white,0_0_20px_rgba(255,255,255,0.5)] border border-zinc-300" />
                </motion.div>
              )}
            </motion.div>
            
            {/* Pointer (Gold) */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[50px] border-t-amber-500 z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              <div className="absolute -top-12 left-[-10px] w-5 h-5 bg-amber-400 rounded-full blur-[2px] opacity-50" />
            </div>
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
                <input
                  type="number"
                  min="1"
                  value={betAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') setBetAmount('');
                    else setBetAmount(Math.max(1, parseInt(val) || 0));
                  }}
                  className="w-20 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs font-bold outline-none focus:border-rose-500 transition-colors"
                  placeholder="Custom"
                />
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
                disabled={isSpinning || !selectedBet || balance < currentBetAmount || currentBetAmount <= 0}
                className={`h-16 flex-1 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  isSpinning || !selectedBet || balance < currentBetAmount || currentBetAmount <= 0
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
