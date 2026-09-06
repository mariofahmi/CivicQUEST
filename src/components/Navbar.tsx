import React from 'react';
import { Volume2, VolumeX, BookOpen, Swords, Sparkles, Music, Music2 } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isBgmMuted: boolean;
  onToggleBgmMute: () => void;
  onOpenRules: () => void;
  onOpenBookInfo: () => void;
  onReturnHome?: () => void;
  isInGame?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMuted,
  onToggleMute,
  isBgmMuted,
  onToggleBgmMute,
  onOpenRules,
  onOpenBookInfo,
  onReturnHome,
  isInGame,
}) => {
  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md bg-slate-900/85 border-b border-slate-800/80 px-4 lg:px-8 ${isInGame ? 'py-1.5 sm:py-2' : 'py-3'} transition-all`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReturnHome}
          className={`flex items-center gap-2.5 cursor-pointer group select-none ${isInGame ? 'hover:opacity-90' : ''}`}
          title={isInGame ? 'Klik untuk kembali ke lobby' : undefined}
        >
          <img 
            src="./logo-unirow.png" 
            alt="Logo Universitas PGRI Ronggolawe" 
            className={`${isInGame ? 'w-7 h-7' : 'w-9 h-9'} object-contain drop-shadow transition-transform group-hover:scale-105`} 
          />
          <div className={`${isInGame ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 rounded-xl'} bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform`}>
            <Swords className={`${isInGame ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`${isInGame ? 'text-lg' : 'text-xl'} font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent`}>
                PyDuel
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                S1 Edition
              </span>
            </div>
            {!isInGame && (
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Battle of Algorithms &bull; Mario Fahmi Syahrial dkk.
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Info Buku Button */}
          <button
            onClick={() => {
              soundEngine.playPowerup();
              onOpenBookInfo();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all shadow-sm"
            aria-label="Info Buku & Penulis"
            title="Lihat Judul Buku & Tim Penulis"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Info Buku</span>
          </button>

          {/* Rules Guide Button */}
          <button
            onClick={() => {
              soundEngine.playPowerup();
              onOpenRules();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all hover:border-slate-600 shadow-sm cursor-pointer"
            aria-label="Panduan Game"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Panduan</span>
          </button>

          {/* BGM Music Toggle Button */}
          <button
            onClick={onToggleBgmMute}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
              isBgmMuted
                ? 'bg-slate-800/80 border-slate-700/70 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-emerald-500/10'
            }`}
            title={isBgmMuted ? 'Putar Musik Latar (BGM Unmute)' : 'Matikan Musik Latar (BGM Mute)'}
            aria-label="Toggle Musik BGM"
          >
            {isBgmMuted ? (
              <Music2 className="w-4 h-4 text-slate-400" />
            ) : (
              <Music className="w-4 h-4 text-emerald-400 animate-pulse" />
            )}
            <span className="hidden sm:inline">
              {isBgmMuted ? 'BGM Off' : 'BGM On'}
            </span>
          </button>

          {/* SFX Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
            }`}
            title={isMuted ? 'Aktifkan Efek Suara (SFX Unmute)' : 'Matikan Efek Suara (SFX Mute)'}
            aria-label="Toggle Efek Suara"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* S1 Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Python 3.x Arcade</span>
          </div>
        </div>
      </div>
    </header>
  );
};
