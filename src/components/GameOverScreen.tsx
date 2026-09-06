import React, { useState, useEffect } from 'react';
import { AlertOctagon, RotateCcw, Home, Award, CheckCircle, Flame, FileCheck } from 'lucide-react';
import { PlayerStats, GameMode, GameOverReason, PlayerInfo } from '../types/game';
import { CertificateModal } from './CertificateModal';
import { soundEngine } from '../utils/soundEngine';

interface GameOverScreenProps {
  mode: GameMode;
  stats: PlayerStats;
  reason: GameOverReason;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
  playerInfo?: PlayerInfo;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  mode,
  stats,
  reason,
  onPlayAgain,
  onBackToLobby,
  playerInfo,
}) => {
  const [isCertOpen, setIsCertOpen] = useState(false);

  useEffect(() => {
    soundEngine.playDefeat();
  }, []);

  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
    : 0;

  const getReasonMessage = () => {
    if (reason === 'quit') {
      return 'Anda telah memilih untuk berhenti bermain. Nilai dan progres yang telah Anda raih selama sesi ini tetap tercatat dan tersimpan.';
    }
    if (reason === 'timeout') {
      return 'Waktu menjawab 60 detik telah habis! Anda dinyatakan kalah dalam pertandingan.';
    }
    if (reason === 'xp_depleted' || reason === 'lives_depleted') {
      return 'XP Anda telah habis (0 XP) sebelum menyelesaikan seluruh 20 soal! Game berhenti.';
    }
    if (reason === 'hp_depleted') {
      return 'HP Anda telah habis akibat serangan kompilasi cepat dari PyBot S1.';
    }
    return 'Pertandingan berakhir. Tingkatkan kecepatan dan ketelitian Anda!';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-in zoom-in-95 duration-300">
      {/* Game Over Banner */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shadow-2xl shadow-rose-500/20">
          <AlertOctagon className="w-10 h-10 text-rose-400 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-rose-400">
            {mode === 'duel' ? '⚔️ Mode Duel AI' : '❤️ Mode Survival'} &bull; {reason === 'quit' ? 'Pertandingan Selesai' : 'Pertandingan Berakhir'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {reason === 'quit' ? 'Evaluasi Hasil Bermain' : 'Jangan Menyerah, Mahasiswa!'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {getReasonMessage()} {reason !== 'quit' && 'Evaluasi kembali konsep algoritma dan struktur Python untuk menaklukkan ronde berikutnya!'}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 shadow-lg">
          <Award className="w-5 h-5 text-amber-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Nilai Ujian</span>
          <span className="text-xl font-extrabold text-amber-400">{stats.score} <span className="text-xs text-slate-400">/ 100</span></span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 shadow-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Akurasi</span>
          <span className="text-xl font-extrabold text-emerald-400">{accuracy}%</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1 shadow-lg">
          <Flame className="w-5 h-5 text-amber-400 mx-auto" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Streak</span>
          <span className="text-xl font-extrabold text-amber-300">{stats.maxCombo}x</span>
        </div>
      </div>

      {/* Detail list */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex justify-between py-1 border-b border-slate-800/80">
          <span>Soal Berhasil Dijawab:</span>
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
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-amber-400/40 cursor-pointer"
      >
        <FileCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        <span>KLAIM &amp; CETAK SERTIFIKAT PENGHARGAAN RESMI 🎓</span>
      </button>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Coba Bertanding Lagi</span>
        </button>

        <button
          onClick={onBackToLobby}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
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
