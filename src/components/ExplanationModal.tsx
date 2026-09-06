import React, { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, ArrowLeft, ShieldCheck, BookOpen, LogOut } from 'lucide-react';
import { Question } from '../types/game';

interface ExplanationModalProps {
  question: Question;
  isCorrect: boolean;
  isTimeout: boolean;
  shieldSaved: boolean;
  onNextQuestion: () => void;
  onPrevQuestion?: () => void;
  canGoPrev?: boolean;
  onStopPlaying?: () => void;
  isLastQuestion: boolean;
  duelDamageMessage?: string;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  question,
  isCorrect,
  isTimeout,
  shieldSaved,
  onNextQuestion,
  onPrevQuestion,
  canGoPrev = false,
  onStopPlaying,
  isLastQuestion,
  duelDamageMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll into view smoothly so the explanation and context are clear
  useEffect(() => {
    const timer = setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut: Press Enter/Space/ArrowRight to proceed, ArrowLeft to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        onNextQuestion();
      } else if (e.key === 'ArrowLeft' && canGoPrev && onPrevQuestion) {
        e.preventDefault();
        onPrevQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextQuestion, onPrevQuestion, canGoPrev]);

  return (
    <>
      {/* 1. Main In-Flow Theoretical Card */}
      <div
        ref={containerRef}
        className="w-full bg-slate-900/95 border border-slate-700/90 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom-2 duration-200"
      >
        {/* Result Status Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            {isCorrect ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : isTimeout ? (
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
            )}

            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {isCorrect
                  ? 'Analisis Tepat! (+XP)'
                  : isTimeout
                  ? 'Waktu Berpikir Habis!'
                  : 'Jawaban Kurang Tepat!'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {shieldSaved
                  ? '🛡️ Perisai Pelindung berhasil menyerap penalti!'
                  : duelDamageMessage || (isCorrect ? 'Kerja bagus, terus pertahankan fokus!' : 'Pelajari penjelasan teoritis berikut:')}
              </p>
            </div>
          </div>

          {/* Shield Saved Tag */}
          {shieldSaved && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Shield Activated</span>
            </div>
          )}
        </div>

        {/* Deep Theoretical Explanation */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs sm:text-sm max-h-48 overflow-y-auto">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pembahasan Teori &amp; Konsep ({question.babTitle})</span>
          </div>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line text-xs">
            {question.explanation}
          </p>
        </div>

        {/* In-Card Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            {canGoPrev && onPrevQuestion && (
              <button
                type="button"
                onClick={onPrevQuestion}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700/80 transition shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Kembali ke soal sebelumnya (Keyboard: Panah Kiri ←)"
              >
                <ArrowLeft className="w-4 h-4 text-slate-300" />
                <span>← Soal Sebelumnya</span>
                <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                  ←
                </span>
              </button>
            )}

            {onStopPlaying && (
              <button
                type="button"
                onClick={onStopPlaying}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 font-bold text-xs sm:text-sm border border-rose-500/30 transition shadow-sm cursor-pointer hover:border-rose-500/50 hover:scale-[1.02] active:scale-[0.98]"
                title="Berhenti bermain dan akhiri pertandingan"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Berhenti Bermain</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onNextQuestion}
            className="flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-white font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-indigo-400/40 cursor-pointer ml-auto"
          >
            <span>{isLastQuestion ? 'Lihat Rangkuman Hasil' : 'Lanjut ke Soal Berikutnya'}</span>
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
              Enter ↵
            </span>
          </button>
        </div>
      </div>

      {/* 2. Floating Persistent Bottom Dock (ALWAYS VISIBLE & NEVER CUT OFF) */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/90 shadow-[0_-10px_35px_rgba(0,0,0,0.85)] animate-in slide-in-from-bottom duration-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Quick status preview */}
          <div className="flex items-center gap-2.5 min-w-0">
            {isCorrect ? (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : isTimeout ? (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate">
                {isCorrect ? 'Analisis Tepat! (+XP)' : 'Jawaban Kurang Tepat!'}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                {shieldSaved
                  ? '🛡️ Perisai Pelindung berhasil melindungi!'
                  : duelDamageMessage || (isCorrect ? 'Poin berhasil didapatkan!' : 'Simak pembahasan di atas.')}
              </p>
            </div>
          </div>

          {/* Action Buttons (Fixed Dock) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {canGoPrev && onPrevQuestion && (
              <button
                type="button"
                onClick={onPrevQuestion}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition shadow-md cursor-pointer"
                title="Kembali ke soal sebelumnya"
              >
                <ArrowLeft className="w-4 h-4 text-slate-300" />
                <span className="hidden sm:inline">← Soal Sebelumnya</span>
                <span className="sm:hidden">← Mundur</span>
              </button>
            )}

            {onStopPlaying && (
              <button
                type="button"
                onClick={onStopPlaying}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 font-bold text-xs sm:text-sm border border-rose-500/30 transition shadow-sm cursor-pointer hover:border-rose-500/50"
                title="Berhenti bermain dan akhiri pertandingan"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Berhenti Bermain</span>
                <span className="sm:hidden">Berhenti</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNextQuestion}
              className="flex-shrink-0 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-white font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-indigo-400/50 cursor-pointer"
            >
              <span>{isLastQuestion ? 'Lihat Hasil' : 'Lanjut ke Soal Berikutnya'}</span>
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
                Enter ↵
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

