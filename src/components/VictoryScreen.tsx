import React, { useEffect, useState } from 'react';
import { Trophy, Award, Flame, CheckCircle, RotateCcw, Home, Clock, FileCheck } from 'lucide-react';
import { PlayerStats, GameMode, PlayerInfo } from '../types/game';
import { triggerVictoryConfetti } from '../utils/confetti';
import { soundEngine } from '../utils/soundEngine';
import { CertificateModal } from './CertificateModal';

interface VictoryScreenProps {
  mode: GameMode;
  stats: PlayerStats;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
  playerInfo?: PlayerInfo;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  mode,
  stats,
  onPlayAgain,
  onBackToLobby,
  playerInfo,
}) => {
  const [isCertOpen, setIsCertOpen] = useState(false);

  useEffect(() => {
    soundEngine.playVictory();
    triggerVictoryConfetti();
  }, []);

  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-in zoom-in-95 duration-300">
      {/* Victory Banner */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-bounce-short">
          <Trophy className="w-10 h-10 text-slate-950 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            {mode === 'duel' ? '⚔️ Duel Won • Rival AI Defeated' : '🌟 Survival Master • Challenge Complete'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Kemenangan Gemilang!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            {mode === 'duel'
              ? 'Anda berhasil menumbangkan HP PyBot S1 dengan ketepatan logika dan kecepatan kompilasi kode yang luar biasa!'
              : 'Anda berhasil menyelesaikan tantangan bertahan hidup dengan efisiensi logika algoritma yang memukau!'}
          </p>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Score */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 shadow-lg">
          <Award className="w-5 h-5 text-amber-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Nilai Ujian</span>
          <span className="text-xl font-extrabold text-amber-400">{stats.score} <span className="text-xs text-slate-400">/ 100</span></span>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 shadow-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Akurasi</span>
          <span className="text-xl font-extrabold text-emerald-400">{accuracy}%</span>
        </div>

        {/* Max Combo */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 shadow-lg">
          <Flame className="w-5 h-5 text-amber-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Streak</span>
          <span className="text-xl font-extrabold text-amber-300">{stats.maxCombo}x</span>
        </div>

        {/* Total Time */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 shadow-lg">
          <Clock className="w-5 h-5 text-cyan-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Durasi</span>
          <span className="text-xl font-extrabold text-white">{stats.timeTakenSec}s</span>
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex justify-between py-1 border-b border-slate-800/80">
          <span>Jumlah Soal Selesai:</span>
          <span className="font-bold text-white">{stats.totalAnswered} / 20 Soal</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-800/80">
          <span>Jawaban Benar (+5 Poin):</span>
          <span className="font-bold text-emerald-400">{stats.correctCount} Soal</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Jawaban Salah / Timeout:</span>
          <span className="font-bold text-rose-400">{stats.wrongCount} Soal</span>
        </div>
      </div>

      {/* Tombol Klaim & Cetak Sertifikat Resmi */}
      <button
        onClick={() => setIsCertOpen(true)}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-amber-400/40"
      >
        <FileCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        <span>KLAIM &amp; CETAK SERTIFIKAT PENGHARGAAN RESMI 🎓</span>
      </button>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mainkan Lagi</span>
        </button>

        <button
          onClick={onBackToLobby}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </button>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        stats={stats}
        mode={mode}
        playerInfo={playerInfo}
      />
    </div>
  );
};
