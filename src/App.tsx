import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBalance } from './hooks/useBalance';
import { GameType } from './types';
import Header from './components/Header';
import Lobby from './components/Lobby';
import Slots from './components/games/Slots';
import Blackjack from './components/games/Blackjack';
import Roulette from './components/games/Roulette';
import { Gift, X } from 'lucide-react';

export default function App() {
  const { balance, updateBalance, claimDailyReward } = useBalance();
  const [activeGame, setActiveGame] = useState<GameType>('lobby');
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  useEffect(() => {
    const reward = claimDailyReward();
    if (reward > 0) {
      setRewardAmount(reward);
      setShowReward(true);
    }
  }, []);

  const renderGame = () => {
    switch (activeGame) {
      case 'slots':
        return <Slots balance={balance} onUpdateBalance={updateBalance} />;
      case 'blackjack':
        return <Blackjack balance={balance} onUpdateBalance={updateBalance} />;
      case 'roulette':
        return <Roulette balance={balance} onUpdateBalance={updateBalance} />;
      default:
        return <Lobby onSelectGame={setActiveGame} balance={balance} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-400 selection:text-black">
      <Header 
        balance={balance} 
        onBackToLobby={() => setActiveGame('lobby')} 
        isLobby={activeGame === 'lobby'} 
      />

      <main className="relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, x: activeGame === 'lobby' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeGame === 'lobby' ? 20 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderGame()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Daily Reward Notification */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100] w-80 bg-gradient-to-br from-amber-400 to-amber-600 p-1 rounded-3xl shadow-[0_20px_50px_rgba(251,191,36,0.3)]"
          >
            <div className="bg-black rounded-[22px] p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-amber-400/5 pointer-events-none" />
              <button 
                onClick={() => setShowReward(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center mb-4">
                <Gift className="text-amber-400 w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-black uppercase tracking-tighter mb-1">Daily Reward!</h3>
              <p className="text-white/60 text-sm font-medium mb-4">Welcome back to the vault. Here are some tokens on the house.</p>
              
              <div className="text-3xl font-black text-amber-400 mb-6">+{rewardAmount}</div>
              
              <button
                onClick={() => setShowReward(false)}
                className="w-full py-3 bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-amber-300 transition-colors"
              >
                Claim Tokens
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
