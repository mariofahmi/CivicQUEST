import React from 'react';
import { Heart, Flame, Shield, Clock, Lightbulb, Zap, AlertCircle } from 'lucide-react';
import { SurvivalState, QuestionType } from '../types/game';
import { soundEngine } from '../utils/soundEngine';

interface StatusBarSurvivalProps {
  survivalState: SurvivalState;
  score: number;
  comboStreak: number;
  currentQuestionType: QuestionType;
  onUseFiftyFifty: () => void;
  onUseFreezeTime: () => void;
  onUseShield: () => void;
  isFiftyFiftyUsedForCurrent: boolean;
}

export const StatusBarSurvival: React.FC<StatusBarSurvivalProps> = ({
  survivalState,
  score,
  comboStreak,
  currentQuestionType,
  onUseFiftyFifty,
  onUseFreezeTime,
  onUseShield,
  isFiftyFiftyUsedForCurrent,
}) => {
  const { lives, xp = 100, shieldActive, powerups } = survivalState;
  const isTrueFalse = currentQuestionType === 'true_false';

  const isComboFrenzy = comboStreak >= 3;

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3">
      {/* Top Bar: XP + Lives + Score + Combo Multiplier */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* XP Status & Lives */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">XP:</span>
            <span className={`font-mono font-black text-sm px-2 py-0.5 rounded-lg border ${
              xp > 50 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                : xp > 25 
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                : 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
            }`}>
              {xp} / 100
            </span>
          </div>

          {/* Hearts indicator */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-4 h-4 transition-all duration-300 ${
                  heartIndex <= lives
                    ? 'text-rose-500 fill-rose-500 scale-100 drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]'
                    : 'text-slate-700 fill-slate-800/40 scale-90'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Combo Streak & Multiplier */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold transition-all ${
              isComboFrenzy
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/20 animate-pulse'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
            }`}
          >
            <Flame className={`w-4 h-4 ${isComboFrenzy ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span>Combo: {comboStreak}x</span>
            {isComboFrenzy && (
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold uppercase tracking-wide">
                1.5x Frenzy
              </span>
            )}
          </div>

          {/* Score Badge */}
          <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            Nilai: {score} / 100
          </div>
        </div>
      </div>

      {/* Visual XP Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Ketahanan XP Pemain</span>
          <span className="text-[10px] text-amber-400/90 font-medium">
            ⚠️ Salah jawab: -5 XP &bull; Jika XP habis sebelum 20 soal, game berhenti!
          </span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-300 ${
              xp > 50
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                : xp > 25
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                : 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, xp))}%` }}
          />
        </div>
      </div>

      {/* Power-Up Controls Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Bantuan Power-Ups:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 1. 50:50 Lifeline Button with TF Protection Tooltip */}
          <div className="relative group">
            <button
              onClick={() => {
                if (powerups.fiftyFifty > 0 && !isTrueFalse && !isFiftyFiftyUsedForCurrent) {
                  soundEngine.playPowerup();
                  onUseFiftyFifty();
                }
              }}
              disabled={powerups.fiftyFifty <= 0 || isTrueFalse || isFiftyFiftyUsedForCurrent}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isTrueFalse
                  ? 'bg-slate-800/30 border-slate-700/30 text-slate-500 cursor-not-allowed'
                  : powerups.fiftyFifty > 0 && !isFiftyFiftyUsedForCurrent
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400 shadow-sm'
                  : 'bg-slate-800/40 border-slate-700/40 text-slate-500 cursor-not-allowed'
              }`}
              title={isTrueFalse ? '50:50 hanya berlaku untuk soal pilihan ganda' : 'Gunakan 50:50 Lifeline'}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>50:50 ({powerups.fiftyFifty})</span>
            </button>

            {/* Educational Tooltip on Hover for True/False */}
            {isTrueFalse && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-amber-500/40 text-amber-200 text-[10px] whitespace-nowrap shadow-xl z-20 pointer-events-none">
                <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span>50:50 hanya berlaku untuk soal pilihan ganda</span>
              </div>
            )}
          </div>

          {/* 2. Freeze Time (+10s) */}
          <button
            onClick={() => {
              if (powerups.freezeTime > 0) {
                soundEngine.playPowerup();
                onUseFreezeTime();
              }
            }}
            disabled={powerups.freezeTime <= 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              powerups.freezeTime > 0
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400 shadow-sm'
                : 'bg-slate-800/40 border-slate-700/40 text-slate-500 cursor-not-allowed'
            }`}
            title="Tambah 5 detik & Jeda waktu sementara"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Freeze +5s ({powerups.freezeTime})</span>
          </button>

          {/* 3. Shield */}
          <button
            onClick={() => {
              if (powerups.shield > 0 && !shieldActive) {
                soundEngine.playShield();
                onUseShield();
              }
            }}
            disabled={powerups.shield <= 0 || shieldActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              shieldActive
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400 animate-pulse'
                : powerups.shield > 0
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400 shadow-sm'
                : 'bg-slate-800/40 border-slate-700/40 text-slate-500 cursor-not-allowed'
            }`}
            title={shieldActive ? 'Perisai sedang aktif!' : 'Aktifkan Perisai Pelindung'}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{shieldActive ? 'Shield Aktif 🛡️' : `Shield (${powerups.shield})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
