import React from 'react';
import { User, Bot } from 'lucide-react';
import { DuelState, PlayerInfo } from '../types/game';

interface StatusBarDuelProps {
  duelState: DuelState;
  turnScore: number;
  timeLeft?: number;
  maxTime?: number;
  playerInfo?: PlayerInfo;
}

export const StatusBarDuel: React.FC<StatusBarDuelProps> = ({
  duelState,
  turnScore,
  playerInfo,
}) => {
  const { playerHp, botHp, isBotThinking } = duelState;

  // HP Color logic
  const getHpColor = (hp: number) => {
    if (hp > 50) return 'from-emerald-500 to-teal-400';
    if (hp > 25) return 'from-amber-500 to-yellow-400';
    return 'from-rose-600 to-red-500';
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 sm:p-3 shadow-lg">
      {/* Top vs HP Row */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 items-center">
        {/* Player HP */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 truncate">
                <span className="text-xs font-bold text-slate-100 truncate block leading-tight">
                  {playerInfo?.name || 'Mahasiswa (Anda)'}
                </span>
                <span className="text-[10px] text-emerald-400 font-extrabold block leading-tight">Nilai: {turnScore} / 100</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`text-xs sm:text-sm font-extrabold ${playerHp <= 25 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {playerHp} <span className="text-[9px] text-slate-400 font-normal">HP</span>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getHpColor(playerHp)} transition-all duration-500 ease-out`}
              style={{ width: `${Math.max(0, playerHp)}%` }}
            />
          </div>
        </div>

        {/* Rival PyBot HP */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 truncate">
                <span className="text-xs font-bold text-slate-100 truncate block leading-tight">PyBot S1 (AI)</span>
                <span className="text-[10px] text-indigo-300 font-medium truncate block leading-tight">
                  {isBotThinking ? '⚡ Berpikir...' : 'Menunggu'}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`text-xs sm:text-sm font-extrabold ${botHp <= 25 ? 'text-rose-400 animate-pulse' : 'text-indigo-400'}`}>
                {botHp} <span className="text-[9px] text-slate-400 font-normal">HP</span>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getHpColor(botHp)} transition-all duration-500 ease-out`}
              style={{ width: `${Math.max(0, botHp)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

