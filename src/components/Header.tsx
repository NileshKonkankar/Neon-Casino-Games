import React from 'react';
import { Coins, LogOut, Trophy, ListOrdered } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  balance: number;
  onNavigate: (page: 'lobby' | 'leaderboard') => void;
  currentPage: string;
}

export default function Header({ balance, onNavigate, currentPage }: HeaderProps) {
  const isLobby = currentPage === 'lobby';
  const isLeaderboard = currentPage === 'leaderboard';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-gold/20 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.4)]">
          <Trophy className="text-black w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter text-white uppercase hidden sm:block">
          Neon <span className="text-amber-400">Vault</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <motion.div 
          key={balance}
          initial={{ scale: 1.1, color: '#fbbf24' }}
          animate={{ scale: 1, color: '#fff' }}
          className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10"
        >
          <Coins className="text-amber-400 w-5 h-5" />
          <span className="font-mono font-bold text-lg">{balance.toLocaleString()}</span>
          <span className="text-xs text-white/40 font-medium uppercase tracking-widest ml-1">Tokens</span>
        </motion.div>

        <div className="flex items-center gap-4">
          {!isLeaderboard && (
            <button 
              onClick={() => onNavigate('leaderboard')}
              className="flex items-center gap-2 text-amber-400/80 hover:text-amber-400 transition-colors text-sm font-medium uppercase tracking-widest"
            >
              <ListOrdered className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </button>
          )}

          {!isLobby && (
            <button 
              onClick={() => onNavigate('lobby')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest pl-4 border-l border-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Lobby</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
