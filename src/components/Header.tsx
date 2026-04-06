import React from 'react';
import { Coins, LogOut, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  balance: number;
  onBackToLobby: () => void;
  isLobby: boolean;
}

export default function Header({ balance, onBackToLobby, isLobby }: HeaderProps) {
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

        {!isLobby && (
          <button 
            onClick={onBackToLobby}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Lobby
          </button>
        )}
      </div>
    </header>
  );
}
