import React, { useState } from 'react';
import { Clock, Copy, Check, Terminal, Code2, AlertTriangle, ArrowLeft, LogOut } from 'lucide-react';
import { Question } from '../types/game';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  maxTime: number;
  onPrevQuestion?: () => void;
  canGoPrev?: boolean;
  onStopPlaying?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  timeLeft,
  maxTime,
  onPrevQuestion,
  canGoPrev = false,
  onStopPlaying,
}) => {
  const [copied, setCopied] = useState(false);

  const isUrgent = maxTime <= 10 ? timeLeft <= 3 : timeLeft <= 5;
  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  const handleCopyCode = () => {
    if (question.codeSnippet) {
      navigator.clipboard.writeText(question.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">Mudah</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">Sedang</span>;
      case 'hard':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">Tantangan</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 sm:p-4 shadow-xl space-y-2.5">
      {/* Top Header: Progress, Badges & Timer */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        {/* Question Counter, Navigation, Bab, and Badges */}
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          {canGoPrev && onPrevQuestion && (
            <button
              type="button"
              onClick={onPrevQuestion}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition shadow-sm cursor-pointer hover:border-slate-500 active:scale-95"
              title="Kembali ke soal sebelumnya"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-300" />
              <span>Mundur</span>
            </button>
          )}

          {onStopPlaying && (
            <button
              type="button"
              onClick={onStopPlaying}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-bold transition shadow-sm cursor-pointer hover:border-rose-500/50 active:scale-95"
              title="Berhenti bermain dan selesaikan pertandingan"
            >
              <LogOut className="w-3 h-3 text-rose-400" />
              <span>Berhenti</span>
            </button>
          )}

          <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex-shrink-0">
            Soal {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline truncate max-w-[180px]">
            {question.babTitle}
          </span>
          {getDifficultyBadge(question.difficulty)}

          {/* Inline Format Badge */}
          {question.type === 'true_false' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Benar / Salah</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold">
              <Code2 className="w-3 h-3 text-indigo-400" />
              <span>Pilihan Ganda</span>
            </span>
          )}
        </div>

        {/* Dynamic Countdown Timer Pill */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-black transition-all ${
              isUrgent
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse-fast ring-1 ring-rose-500/50'
                : 'bg-slate-800/80 border-slate-700 text-slate-200'
            }`}
          >
            <Clock className={`w-3 h-3 ${isUrgent ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
            <span className="tabular-nums font-mono text-xs">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-linear ${
            isUrgent ? 'bg-rose-500' : timeLeft <= 8 ? 'bg-amber-400' : 'bg-indigo-500'
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      {/* Question Text or Statement */}
      <div className="text-slate-100 text-xs sm:text-sm font-semibold leading-relaxed">
        {question.type === 'true_false' ? (
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-200">
            <span className="text-amber-400 font-bold block mb-0.5 text-[10px] uppercase tracking-wider">
              Analisis Pernyataan Berikut:
            </span>
            <p className="italic text-slate-100 font-medium text-xs sm:text-sm">
              &ldquo;{question.statement}&rdquo;
            </p>
          </div>
        ) : (
          <p className="whitespace-pre-line text-slate-100">{question.question}</p>
        )}
      </div>

      {/* macOS Terminal Python Code Snippet (Compact) */}
      {question.codeSnippet && (
        <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-md font-mono text-xs">
          {/* macOS Terminal Bar */}
          <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-800 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
              <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
              <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
              <span className="ml-1.5 text-[10px] text-slate-400 font-sans flex items-center gap-1">
                <Terminal className="w-3 h-3 text-slate-500" />
                main.py
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 transition"
              title="Salin Cuplikan Kode"
            >
              {copied ? (
                <>
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-2.5 h-2.5" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>

          {/* Code Content */}
          <div className="p-2.5 sm:p-3 overflow-x-auto text-slate-200 leading-snug font-mono text-xs max-h-40 overflow-y-auto">
            <pre className="text-emerald-300">
              <code>{question.codeSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
