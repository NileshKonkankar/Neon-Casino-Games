import React from 'react';
import { Coins, LogOut, Trophy, ListOrdered, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../App';

interface HeaderProps {
  balance: number;
  onNavigate: (page: 'lobby' | 'leaderboard') => void;
  currentPage: string;
}

export default function Header({ balance, onNavigate, currentPage }: HeaderProps) {
  const isLobby = currentPage === 'lobby';
  const isLeaderboard = currentPage === 'leaderboard';
  const { theme, setTheme } = useTheme();

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 backdrop-blur-md border-b z-50 px-6 flex items-center justify-between transition-colors duration-1000 ${
      theme === 'cyberpunk' ? 'bg-cyan-950/80 border-cyan-500/20' : 
      theme === 'retro' ? 'bg-purple-950/80 border-pink-500/20' : 
      'bg-black/80 border-gold/20'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-1000 ${
          theme === 'cyberpunk' ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-600 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 
          theme === 'retro' ? 'bg-gradient-to-br from-pink-500 to-violet-600 shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 
          'bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
        }`}>
          <Trophy className="text-black w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter text-white uppercase hidden sm:block">
          Neon <span className={`transition-colors duration-1000 ${
            theme === 'cyberpunk' ? 'text-cyan-400' : 
            theme === 'retro' ? 'text-pink-400' : 
            'text-amber-400'
          }`}>Vault</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
           {(['neon', 'cyberpunk', 'retro'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                theme === t 
                  ? t === 'cyberpunk' ? 'bg-cyan-500 text-black' : t === 'retro' ? 'bg-pink-500 text-white' : 'bg-amber-400 text-black'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {t}
            </button>
           ))}
        </div>

        <motion.div 
          key={balance}
          initial={{ scale: 1.1, color: theme === 'cyberpunk' ? '#22d3ee' : theme === 'retro' ? '#ec4899' : '#fbbf24' }}
          animate={{ scale: 1, color: '#fff' }}
          className={`flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border transition-colors duration-1000 ${
            theme === 'cyberpunk' ? 'border-cyan-500/20' : 
            theme === 'retro' ? 'border-pink-500/20' : 
            'border-white/10'
          }`}
        >
          <Coins className={`w-5 h-5 transition-colors duration-1000 ${
            theme === 'cyberpunk' ? 'text-cyan-400' : 
            theme === 'retro' ? 'text-pink-400' : 
            'text-amber-400'
          }`} />
          <span className="font-mono font-bold text-lg">{balance.toLocaleString()}</span>
          <span className="text-xs text-white/40 font-medium uppercase tracking-widest ml-1">Tokens</span>
        </motion.div>

        <div className="flex items-center gap-4">
          {!isLeaderboard && (
            <button 
              onClick={() => onNavigate('leaderboard')}
              className={`flex items-center gap-2 transition-colors text-sm font-medium uppercase tracking-widest ${
                theme === 'cyberpunk' ? 'text-cyan-400/80 hover:text-cyan-400' : 
                theme === 'retro' ? 'text-pink-400/80 hover:text-pink-400' : 
                'text-amber-400/80 hover:text-amber-400'
              }`}
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
