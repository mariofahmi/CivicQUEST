import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MultipleChoiceQuestion } from '../types/game';

interface MultipleChoiceViewProps {
  question: MultipleChoiceQuestion;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  eliminatedIndices: number[];
  isAnswered: boolean;
  disabled: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const MultipleChoiceView: React.FC<MultipleChoiceViewProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  eliminatedIndices,
  isAnswered,
  disabled,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 w-full animate-in fade-in duration-200">
      {question.options.map((optionText, index) => {
        const isEliminated = eliminatedIndices.includes(index);
        const isSelected = selectedAnswer === index;
        const isCorrect = index === question.correctAnswer;

        // Visual status styling
        let cardStyle = 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/70 hover:bg-slate-800/80 text-slate-200';
        let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';

        if (isAnswered) {
          if (isCorrect) {
            cardStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20';
            badgeStyle = 'bg-emerald-500 text-slate-950 font-black border-emerald-400';
          } else if (isSelected && !isCorrect) {
            cardStyle = 'bg-rose-500/15 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/20';
            badgeStyle = 'bg-rose-500 text-white font-black border-rose-400';
          } else {
            cardStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-40';
            badgeStyle = 'bg-slate-900 text-slate-600 border-slate-800';
          }
        } else if (isEliminated) {
          cardStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 line-through opacity-30 cursor-not-allowed';
          badgeStyle = 'bg-slate-900 text-slate-700 border-slate-800';
        }

        return (
          <button
            key={index}
            onClick={() => {
              if (!disabled && !isAnswered && !isEliminated) {
                onSelectAnswer(index);
              }
            }}
            disabled={disabled || isAnswered || isEliminated}
            className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all duration-200 relative group select-none ${cardStyle}`}
          >
            {/* Letter Badge */}
            <div
              className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-black transition-transform flex-shrink-0 ${badgeStyle} ${
                !isAnswered && !isEliminated ? 'group-hover:scale-105' : ''
              }`}
            >
              {OPTION_LETTERS[index]}
            </div>

            {/* Option Text */}
            <span className="flex-grow leading-tight line-clamp-2">{optionText}</span>

            {/* Indicator Icon Post Answer */}
            {isAnswered && isCorrect && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce-short" />
            )}
            {isAnswered && isSelected && !isCorrect && (
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};
