import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TrueFalseQuestion } from '../types/game';

interface TrueFalseViewProps {
  question: TrueFalseQuestion;
  selectedAnswer: boolean | null;
  onSelectAnswer: (value: boolean) => void;
  isAnswered: boolean;
  disabled: boolean;
}

export const TrueFalseView: React.FC<TrueFalseViewProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isAnswered,
  disabled,
}) => {
  const isTrueCorrect = question.correctAnswer === true;
  const isFalseCorrect = question.correctAnswer === false;

  // True Button Style
  let trueBtnStyle = 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/80 hover:bg-slate-800/80 text-slate-200';
  if (isAnswered) {
    if (isTrueCorrect) {
      trueBtnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-500/20';
    } else if (selectedAnswer === true && !isTrueCorrect) {
      trueBtnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 ring-2 ring-rose-500/60 shadow-lg shadow-rose-500/20';
    } else {
      trueBtnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-40';
    }
  }

  // False Button Style
  let falseBtnStyle = 'bg-slate-900/80 border-slate-800 hover:border-rose-500/80 hover:bg-slate-800/80 text-slate-200';
  if (isAnswered) {
    if (isFalseCorrect) {
      falseBtnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-500/20';
    } else if (selectedAnswer === false && !isFalseCorrect) {
      falseBtnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 ring-2 ring-rose-500/60 shadow-lg shadow-rose-500/20';
    } else {
      falseBtnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-40';
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full animate-in fade-in duration-200">
      {/* Tombol 1: Benar (True) */}
      <button
        onClick={() => {
          if (!disabled && !isAnswered) {
            onSelectAnswer(true);
          }
        }}
        disabled={disabled || isAnswered}
        className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm select-none group cursor-pointer ${trueBtnStyle}`}
      >
        <CheckCircle2 className={`w-5 h-5 ${isAnswered && isTrueCorrect ? 'text-emerald-400 animate-bounce-short' : 'text-emerald-400 group-hover:scale-110'} transition-transform flex-shrink-0`} />
        <div className="text-left">
          <span className="block text-white text-sm font-black">BENAR (TRUE)</span>
          <span className="text-[10px] text-slate-400 block leading-tight">Pernyataan sesuai teori Python</span>
        </div>
      </button>

      {/* Tombol 2: Salah (False) */}
      <button
        onClick={() => {
          if (!disabled && !isAnswered) {
            onSelectAnswer(false);
          }
        }}
        disabled={disabled || isAnswered}
        className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm select-none group cursor-pointer ${falseBtnStyle}`}
      >
        <XCircle className={`w-5 h-5 ${isAnswered && isFalseCorrect ? 'text-emerald-400 animate-bounce-short' : 'text-rose-400 group-hover:scale-110'} transition-transform flex-shrink-0`} />
        <div className="text-left">
          <span className="block text-white text-sm font-black">SALAH (FALSE)</span>
          <span className="text-[10px] text-slate-400 block leading-tight">Pernyataan bertentangan / keliru</span>
        </div>
      </button>
    </div>
  );
};
