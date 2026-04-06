import React from 'react';
import { motion } from 'motion/react';
import { GameType } from '../types';
import { Dices, Spade, Disc } from 'lucide-react';

interface LobbyProps {
  onSelectGame: (game: GameType) => void;
  balance: number;
}

const GAMES = [
  {
    id: 'slots' as GameType,
    name: 'Neon Slots',
    description: 'Classic 3-reel high stakes slot machine.',
    icon: <Dices className="w-12 h-12" />,
    color: 'from-purple-500 to-indigo-600',
    accent: 'text-purple-300',
    shadow: 'shadow-purple-500/20'
  },
  {
    id: 'blackjack' as GameType,
    name: 'Vault Blackjack',
    description: 'Beat the dealer in this classic card game.',
    icon: <Spade className="w-12 h-12" />,
    color: 'from-emerald-500 to-teal-600',
    accent: 'text-emerald-300',
    shadow: 'shadow-emerald-500/20'
  },
  {
    id: 'roulette' as GameType,
    name: 'Cyber Roulette',
    description: 'Spin the wheel and test your luck.',
    icon: <Disc className="w-12 h-12" />,
    color: 'from-rose-500 to-pink-600',
    accent: 'text-rose-300',
    shadow: 'shadow-rose-500/20'
  }
];

export default function Lobby({ onSelectGame, balance }: LobbyProps) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-black tracking-tighter text-white uppercase mb-4">
          Choose Your <span className="text-amber-400">Game</span>
        </h2>
        <p className="text-white/40 text-lg max-w-md mx-auto font-medium">
          Step into the vault and try your luck. Free tokens, high stakes, neon atmosphere.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {GAMES.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame(game.id)}
            className={`relative group h-96 rounded-3xl overflow-hidden bg-gradient-to-br ${game.color} p-1 ${game.shadow} shadow-2xl flex flex-col items-center justify-center text-center`}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-0" />
            <div className="relative z-10 p-8 flex flex-col items-center">
              <div className={`mb-6 ${game.accent} group-hover:scale-110 transition-transform duration-500`}>
                {game.icon}
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                {game.name}
              </h3>
              <p className="text-white/70 font-medium mb-8">
                {game.description}
              </p>
              <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-bold uppercase tracking-widest text-xs">
                Play Now
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-2xl w-full text-center"
      >
        <h4 className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-4">Vault Status</h4>
        <div className="flex justify-around items-center">
          <div>
            <div className="text-3xl font-black text-white">{balance.toLocaleString()}</div>
            <div className="text-white/40 text-xs uppercase font-bold tracking-widest">Total Balance</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div>
            <div className="text-3xl font-black text-white">3</div>
            <div className="text-white/40 text-xs uppercase font-bold tracking-widest">Games Active</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div>
            <div className="text-3xl font-black text-white">0%</div>
            <div className="text-white/40 text-xs uppercase font-bold tracking-widest">House Edge</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
