import React, { useState, useRef } from 'react';
import {
  Swords,
  Heart,
  Filter,
  BookMarked,
  Play,
  Sparkles,
  CheckCircle2,
  Users,
  User,
  Building2,
  GraduationCap,
  AlertTriangle,
} from 'lucide-react';
import { GameMode, GameFilter, BabNumber, QuestionType, PlayerInfo } from '../types/game';
import { questionBank } from '../data/questionBank';
import { soundEngine } from '../utils/soundEngine';

interface LobbyScreenProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  filter: GameFilter;
  onChangeFilter: (newFilter: GameFilter) => void;
  playerInfo: PlayerInfo;
  onUpdatePlayerInfo: (info: PlayerInfo) => void;
  onStartGame: () => void;
  highScore?: number;
  onSelectGame3?: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  selectedMode,
  onSelectMode,
  filter,
  onChangeFilter,
  playerInfo,
  onUpdatePlayerInfo,
  onStartGame,
  onSelectGame3,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const identityInputRef = useRef<HTMLDivElement>(null);

  // Compute available questions count based on active filter
  const availableQuestionsCount = questionBank.filter((q) => {
    const babMatches = filter.bab === 'all' || q.bab === filter.bab;
    const typeMatches = filter.type === 'all' || q.type === filter.type;
    return babMatches && typeMatches;
  }).length;

  const handleModeChange = (mode: GameMode) => {
    soundEngine.playPowerup();
    onSelectMode(mode);
  };

  const handleLaunch = () => {
    // Validasi kelengkapan identitas pemain (Nama & Institusi Wajib Diisi)
    const nameTrimmed = playerInfo.name.trim();
    const instTrimmed = playerInfo.institution.trim();

    if (!nameTrimmed || !instTrimmed) {
      soundEngine.playWrong();
      setValidationError('⚠️ Mohon lengkapi Nama Lengkap dan Sekolah/Institusi sebelum memulai pertandingan!');
      if (identityInputRef.current) {
        identityInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setValidationError(null);
    soundEngine.playVictory();
    onStartGame();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">
            Arena Mini-Game Interaktif Perkuliahan S1
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          PyDuel: Battle of Algorithms
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Uji ketangkasan logika dan pemahaman sintaks pemrograman Python Anda dalam arena duel cepat dan simulator pola interaktif.
        </p>

        {/* Badge Penulis & Pengembang */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-bold text-indigo-300 shadow-sm">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            Perancang: Mario Fahmi Syahrial
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300 shadow-sm">
            <img src="./logo-unirow.png" alt="Logo Universitas PGRI Ronggolawe" className="w-4 h-4 object-contain" />
            Universitas PGRI Ronggolawe
          </span>
        </div>
      </div>

      {/* Kartu Informasi Buku Sumber & Penulis Lengkap */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/95 border border-indigo-500/30 shadow-xl space-y-3 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-indigo-400" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-300">
              Buku Sumber Perkuliahan S1 &bull; Universitas PGRI Ronggolawe
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
            Judul Buku:
          </span>
          <p className="text-base sm:text-lg font-black text-white tracking-tight">
            ALGORITMA dan Pemrograman dengan Python
          </p>
        </div>

        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Penulis:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Andy Haryoko',
              'Moh. Muhyidin Agus Wibowo',
              'Anggia Kalista',
              'Krishna Tri Sanjaya',
              'Mario Fahmi Syahrial',
            ].map((author, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-sm hover:border-indigo-500/40 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                {author}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Input Identitas Pemain (Wajib Sebelum Bermain) */}
      <div
        ref={identityInputRef}
        className={`p-5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/95 border transition-all duration-300 shadow-xl space-y-4 backdrop-blur-sm relative overflow-hidden ${
          validationError
            ? 'border-rose-500/80 ring-2 ring-rose-500/30'
            : 'border-indigo-500/30 hover:border-indigo-500/50'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-200">
              1. Identitas Peserta Ujian (Wajib Sebelum Bermain)
            </span>
          </div>
          {playerInfo.name.trim() && playerInfo.institution.trim() ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Identitas Lengkap
            </span>
          ) : (
            <span className="text-[11px] text-amber-300 font-semibold bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 rounded-full">
              Wajib Dilengkapi
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Mohon lengkapi data identitas Anda di bawah ini sebelum memulai pertandingan. Data ini akan dicetak secara otomatis pada <strong className="text-amber-300 font-bold">Sertifikat Penghargaan Resmi</strong> dan papan nama duel.
        </p>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* NAMA LENGKAP */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-extrabold flex items-center gap-1.5 tracking-wider uppercase">
              <User className="w-4 h-4 text-indigo-400" />
              NAMA LENGKAP:
            </label>
            <input
              type="text"
              value={playerInfo.name}
              onChange={(e) => {
                setValidationError(null);
                onUpdatePlayerInfo({ ...playerInfo, name: e.target.value });
              }}
              placeholder="Contoh: Mario Fahmi Syahrial"
              className="w-full bg-slate-800/90 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 font-medium transition outline-none"
            />
          </div>

          {/* KELAS/PROGRAM STUDI/SEKOLAH/INSTITUSI */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-extrabold flex items-center gap-1.5 tracking-wider uppercase">
              <Building2 className="w-4 h-4 text-emerald-400" />
              KELAS/PROGRAM STUDI/SEKOLAH/INSTITUSI:
            </label>
            <input
              type="text"
              value={playerInfo.institution}
              onChange={(e) => {
                setValidationError(null);
                onUpdatePlayerInfo({ ...playerInfo, institution: e.target.value });
              }}
              placeholder="Contoh: S1 Teknik Informatika / Kelas XII RPL / Universitas..."
              className="w-full bg-slate-800/90 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 font-medium transition outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Mode Selection Cards */}
      <div className="space-y-3">
        <label className="text-xs uppercase font-bold tracking-wider text-slate-400 block px-1">
          2. Pilih Mode Permainan
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode A: PyBot Speed Duel */}
          <div
            onClick={() => handleModeChange('duel')}
            className={`relative p-4 sm:p-5 rounded-2xl cursor-pointer border transition-all duration-200 select-none ${
              selectedMode === 'duel'
                ? 'bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/15 ring-2 ring-indigo-500/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <Swords className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                1 vs 1 Duel
              </span>
            </div>

            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
              PyBot Speed Duel
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Adu cepat melawan AI <strong className="text-slate-200">PyBot S1</strong>. Jawab benar untuk menguras HP lawan!
            </p>

            <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300 pt-2 border-t border-slate-700/50">
              <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700">100 HP</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700">Timer 60s</span>
            </div>
          </div>

          {/* Mode B: Survival Run */}
          <div
            onClick={() => handleModeChange('survival')}
            className={`relative p-4 sm:p-5 rounded-2xl cursor-pointer border transition-all duration-200 select-none ${
              selectedMode === 'survival'
                ? 'bg-slate-800/90 border-emerald-500 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100 XP &bull; 10s
              </span>
            </div>

            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
              Survival Run
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Waktu 10 detik per soal tanpa pembahasan. Salah jawab -5 XP. Jika XP habis, game berhenti!
            </p>

            <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300 pt-2 border-t border-slate-700/50">
              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold">Salah: -5 XP</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Combo (+5 XP)</span>
            </div>
          </div>

          {/* Mode C: Game 3 - PyStar Pattern Simulator */}
          <div
            onClick={() => {
              soundEngine.playPowerup();
              if (onSelectGame3) onSelectGame3();
            }}
            className="relative p-4 sm:p-5 rounded-2xl cursor-pointer border border-amber-500/60 bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 hover:border-amber-400 hover:bg-slate-800/70 shadow-lg shadow-amber-500/10 transition-all duration-200 select-none group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black mb-3 shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40 animate-pulse">
                Studi Kasus 5.4
              </span>
            </div>

            <h2 className="text-base font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              PyStar Simulator ⭐
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Laboratorium perulangan bersarang (Nested Loops), generator kode matriks, dan 5 kuis detektif pola!
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <span className="text-[10px] text-amber-400 font-bold">5 Pola Bintang</span>
              <span className="text-[10px] font-extrabold text-amber-300 group-hover:underline flex items-center gap-1">
                Buka Simulator &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Options */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
              3. Kustomisasi Filter Soal Ujian
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {availableQuestionsCount} Soal Tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bab Topic Filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
              Pilih Bab Perkuliahan:
            </label>
            <select
              value={filter.bab}
              onChange={(e) => {
                const val = e.target.value;
                onChangeFilter({
                  ...filter,
                  bab: val === 'all' ? 'all' : (Number(val) as BabNumber),
                });
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            >
              <option value="all">Semua Bab (Bab 1 s.d. Bab 5)</option>
              <option value="1">Bab 1: Konsep Algoritma & Flowchart</option>
              <option value="2">Bab 2: Tipe Data & Variabel</option>
              <option value="3">Bab 3: Searching & Sorting</option>
              <option value="4">Bab 4: Kontrol Alur & Penanganan Error</option>
              <option value="5">Bab 5: Studi Kasus Praktis</option>
            </select>
          </div>

          {/* Question Format Filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Format Soal:
            </label>
            <select
              value={filter.type}
              onChange={(e) => {
                const val = e.target.value as QuestionType | 'all';
                onChangeFilter({
                  ...filter,
                  type: val,
                });
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            >
              <option value="all">Semua Format (Pilihan Ganda & Benar/Salah)</option>
              <option value="multiple_choice">Hanya Pilihan Ganda (A, B, C, D)</option>
              <option value="true_false">Hanya Benar / Salah (True / False)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Start Button & 20 Soal Exam Badge */}
      <div className="pt-2 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold text-center">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Sesi Ujian: <strong>20 Soal</strong> &bull; Nilai Maksimal: <strong>100 Poin</strong> (5 Poin/Soal Benar) &bull; Dilengkapi Sertifikat Resmi 🎓</span>
        </div>

        {validationError && (
          <div className="w-full sm:w-80 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1 text-center">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <button
          onClick={handleLaunch}
          disabled={availableQuestionsCount === 0}
          className={`w-full sm:w-80 py-4 px-8 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-xl cursor-pointer ${
            availableQuestionsCount === 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Play className="w-5 h-5 fill-white" />
          <span>MULAI BERTANDING (20 SOAL)</span>
        </button>

        <p className="text-[11px] text-slate-500 text-center">
          Tekan tombol di atas untuk memulai sesi 20 soal dengan durasi waktu per soal sesuai mode yang dipilih.
        </p>
      </div>
    </div>
  );
};
