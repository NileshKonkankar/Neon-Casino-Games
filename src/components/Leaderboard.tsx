import React from 'react';
import { motion } from 'motion/react';
import { Crown, Medal, User } from 'lucide-react';

const MOCK_LEADERBOARD: { id: number; name: string; balance: number; isUser?: boolean }[] = [
  { id: 1, name: 'NeonKing99', balance: 1450000 },
  { id: 2, name: 'CyberRoller', balance: 850000 },
  { id: 3, name: 'VaultMaster', balance: 520000 },
  { id: 4, name: 'LuckyCharm_7', balance: 410000 },
  { id: 5, name: 'AceOfSpades', balance: 350000 },
  { id: 6, name: 'DiamondHands', balance: 290000 },
  { id: 7, name: 'RetroGamer', balance: 180000 },
  { id: 8, name: 'CasinoRoyal', balance: 155000 },
  { id: 9, name: 'HighStakes', balance: 120000 },
  { id: 10, name: 'TheBroker', balance: 95000 },
];

export default function Leaderboard({ currentBalance }: { currentBalance: number }) {
  // Insert current user into the mock leaderboard if not present
  const allUsers = [...MOCK_LEADERBOARD];
  
  // Just for fun, if the user has a higher balance than the lowest, we show them as "You"
  // Usually this would come from a real database.
  const userEntry = { id: 0, name: 'You', balance: currentBalance, isUser: true };
  
  // In a real app we'd fetch this from via API. Here we just sort and slice to top 10.
  allUsers.push(userEntry);
  const sortedLeaderboard = allUsers.sort((a, b) => b.balance - a.balance).slice(0, 10);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.3)] mb-6">
          <Crown className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase mb-4">
          Vault <span className="text-amber-400">Legends</span>
        </h2>
        <p className="text-white/40 text-lg max-w-md mx-auto font-medium">
          The wealthiest high rollers inside the Neon Vault.
        </p>
      </motion.div>

      <div className="w-full bg-white/5 border border-white/10 rounded-[40px] p-4 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex items-center px-6 py-2 text-white/40 text-xs font-black uppercase tracking-widest border-b border-white/5 mb-2">
            <div className="w-12 text-center">Rank</div>
            <div className="flex-1">Player</div>
            <div className="text-right">Balance</div>
          </div>

          {sortedLeaderboard.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center px-4 py-4 rounded-2xl transition-all ${
                player.isUser 
                  ? 'bg-amber-500/20 border border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]' 
                  : 'bg-black/40 border border-white/5 hover:bg-black/60'
              }`}
            >
              <div className="w-12 flex justify-center">
                {index === 0 ? <Crown className="w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" /> : 
                 index === 1 ? <Medal className="w-6 h-6 text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]" /> : 
                 index === 2 ? <Medal className="w-6 h-6 text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.8)]" /> : 
                 <span className="text-white/40 font-black text-lg">{index + 1}</span>}
              </div>
              <div className="flex-1 flex items-center gap-4 pl-4 border-l border-white/5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${player.isUser ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/60'}`}>
                  <User className="w-5 h-5" />
                </div>
                <span className={`font-bold text-lg leading-none ${player.isUser ? 'text-amber-400' : 'text-white'}`}>
                  {player.name}
                  {player.isUser && <span className="ml-2 text-[10px] uppercase font-black tracking-widest text-amber-500/60 bg-amber-500/10 px-2 py-0.5 rounded-sm">You</span>}
                </span>
              </div>
              <div className="text-right pl-4">
                <span className={`font-mono font-black text-xl ${player.isUser ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {player.balance.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
