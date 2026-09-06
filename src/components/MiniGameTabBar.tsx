import React from 'react';
import { Swords, Flame, Sparkles } from 'lucide-react';
import { MiniGameId } from '../types/game';
import { soundEngine } from '../utils/soundEngine';

interface MiniGameTabBarProps {
  activeTab: MiniGameId;
  onSelectTab: (tab: MiniGameId) => void;
  className?: string;
}

export const MiniGameTabBar: React.FC<MiniGameTabBarProps> = ({
  activeTab,
  onSelectTab,
  className = '',
}) => {
  const handleTabClick = (tabId: MiniGameId) => {
    if (tabId !== activeTab) {
      soundEngine.playPowerup();
      onSelectTab(tabId);
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto px-3 sm:px-4 py-2 ${className}`}>
      {/* Container Bar with Glassmorphic Border */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-1.5 sm:p-2 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {/* Tab 1: Game 1 - Kuis PyDuel */}
          <button
            onClick={() => handleTabClick('game1')}
            className={`relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-300 text-left cursor-pointer select-none group ${
              activeTab === 'game1'
                ? 'bg-gradient-to-r from-indigo-600/30 via-indigo-500/20 to-indigo-900/40 border border-indigo-500/60 shadow-lg shadow-indigo-500/20 text-white'
                : 'bg-slate-950/40 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'game1'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/50 scale-105'
                  : 'bg-slate-800 text-indigo-400 group-hover:bg-slate-700'
              }`}
            >
              <Swords className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black tracking-tight truncate">
                  Game 1: Kuis PyDuel
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Pilihan Ganda &amp; True/False
              </p>
            </div>

            {activeTab === 'game1' && (
              <span className="hidden lg:inline-flex text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Aktif
              </span>
            )}
          </button>

          {/* Tab 2: Game 2 - Survival Run */}
          <button
            onClick={() => handleTabClick('game2')}
            className={`relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-300 text-left cursor-pointer select-none group ${
              activeTab === 'game2'
                ? 'bg-gradient-to-r from-rose-600/30 via-rose-500/20 to-emerald-900/40 border border-rose-500/60 shadow-lg shadow-rose-500/20 text-white'
                : 'bg-slate-950/40 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'game2'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/50 scale-105'
                  : 'bg-slate-800 text-rose-400 group-hover:bg-slate-700'
              }`}
            >
              <Flame className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black tracking-tight truncate">
                  Game 2: Survival Run
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                10s Blitz &amp; 100 XP
              </p>
            </div>

            {activeTab === 'game2' && (
              <span className="hidden lg:inline-flex text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Aktif
              </span>
            )}
          </button>

          {/* Tab 3: Game 3 - PyStar Pattern Simulator */}
          <button
            onClick={() => handleTabClick('game3')}
            className={`relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-300 text-left cursor-pointer select-none group ${
              activeTab === 'game3'
                ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-950/40 border border-amber-500/70 shadow-lg shadow-amber-500/25 text-white'
                : 'bg-slate-950/40 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'game3'
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/50 scale-105 font-black'
                  : 'bg-slate-800 text-amber-400 group-hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black tracking-tight truncate text-amber-300">
                  Game 3: PyStar Simulator
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Studi Kasus 5.4 Nested Loops
              </p>
            </div>

            <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse whitespace-nowrap">
              Bab 5.4
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
