import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Terminal,
  Sliders,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Award,
  BookOpen,
  ChevronRight,
  Layers,
  Grid,
  Image as ImageIcon,
  Cpu,
  AlertCircle,
  Home
} from 'lucide-react';
import { PatternId, PatternCharType, PlayerInfo } from '../types/game';
import { PATTERN_LIST, PATTERN_DETECTIVE_QUESTIONS } from '../data/pystarData';
import { soundEngine } from '../utils/soundEngine';
import { triggerComboConfetti, triggerVictoryConfetti } from '../utils/confetti';
import { CertificateModal } from './CertificateModal';

interface PyStarPatternGameProps {
  playerInfo?: PlayerInfo;
  onBackToLobby?: () => void;
}

export const PyStarPatternGame: React.FC<PyStarPatternGameProps> = ({
  playerInfo,
  onBackToLobby,
}) => {
  // Mode Active Tab: 'lab' (Pattern Laboratory) or 'quiz' (Pattern Detective)
  const [activeSubTab, setActiveSubTab] = useState<'lab' | 'quiz'>('lab');
  const [isCertOpen, setIsCertOpen] = useState(false);

  // --- LAB STATE ---
  const [selectedPatternId, setSelectedPatternId] = useState<PatternId>('pola1_ascending');
  const [patternHeight, setPatternHeight] = useState<number>(5);
  const [patternChar, setPatternChar] = useState<PatternCharType>('*');
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedOutput, setIsCopiedOutput] = useState(false);
  const [showConceptCard, setShowConceptCard] = useState(true);

  // Animation Step-by-Step Tracer
  const [isTracing, setIsTracing] = useState(false);
  const [traceStep, setTraceStep] = useState<number>(0);
  const [traceSpeed, setTraceSpeed] = useState<number>(60); // ms per char
  const animationTimerRef = useRef<number | null>(null);

  // Current Selected Pattern
  const currentPattern = PATTERN_LIST.find((p) => p.id === selectedPatternId) || PATTERN_LIST[0];

  // Generated Code and Full Output
  const generatedPythonCode = currentPattern.generateCode(patternHeight, patternChar);
  const generatedOutputData = currentPattern.generateOutput(patternHeight, patternChar);

  // Flattened characters for step-by-step trace animation
  const totalCharactersToTrace = generatedOutputData.lines.join('\n');
  const maxSteps = totalCharactersToTrace.length;

  // Stop animation on unmount or pattern change
  useEffect(() => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    setIsTracing(false);
    setTraceStep(0);
  }, [selectedPatternId, patternHeight, patternChar]);

  // Handle Animation Play/Pause
  const handleToggleTraceAnimation = () => {
    soundEngine.playPowerup();
    if (isTracing) {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      setIsTracing(false);
    } else {
      setIsTracing(true);
      let currentIdx = traceStep >= maxSteps ? 0 : traceStep;
      setTraceStep(currentIdx);

      animationTimerRef.current = window.setInterval(() => {
        currentIdx++;
        if (currentIdx > maxSteps) {
          if (animationTimerRef.current) clearInterval(animationTimerRef.current);
          setIsTracing(false);
          soundEngine.playCorrect();
        } else {
          setTraceStep(currentIdx);
        }
      }, traceSpeed);
    }
  };

  const handleResetTrace = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setIsTracing(false);
    setTraceStep(0);
  };

  // Copy Code to Clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedPythonCode);
      setIsCopiedCode(true);
      soundEngine.playPowerup();
      setTimeout(() => setIsCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Copy Output to Clipboard
  const handleCopyOutput = async () => {
    try {
      await navigator.clipboard.writeText(generatedOutputData.lines.join('\n'));
      setIsCopiedOutput(true);
      soundEngine.playPowerup();
      setTimeout(() => setIsCopiedOutput(false), 2000);
    } catch {
      // Fallback
    }
  };

  // --- QUIZ (PATTERN DETECTIVE) STATE ---
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number>(() => {
    const saved = localStorage.getItem('pyduel_pystar_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  const currentQuestion = PATTERN_DETECTIVE_QUESTIONS[currentQuizIndex];
  const isCurrentAnswered = selectedAnswers[currentQuestion.id] !== undefined;
  const isCurrentCorrect = isCurrentAnswered && selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer;

  const handleSelectQuizAnswer = (optionIdx: number) => {
    if (isCurrentAnswered) return;

    const isCorrect = optionIdx === currentQuestion.correctAnswer;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIdx }));

    if (isCorrect) {
      soundEngine.playCorrect();
      triggerComboConfetti();
      const newScore = quizScore + 50;
      setQuizScore(newScore);
      localStorage.setItem('pyduel_pystar_xp', newScore.toString());

      if (!completedQuestions.includes(currentQuestion.id)) {
        setCompletedQuestions((prev) => [...prev, currentQuestion.id]);
      }
    } else {
      soundEngine.playWrong();
    }
  };

  const handleNextQuizQuestion = () => {
    soundEngine.playPowerup();
    if (currentQuizIndex < PATTERN_DETECTIVE_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setShowQuizResult(true);
      triggerVictoryConfetti();
      soundEngine.playVictory();
    }
  };

  const handleRestartQuiz = () => {
    soundEngine.playPowerup();
    setSelectedAnswers({});
    setCurrentQuizIndex(0);
    setShowQuizResult(false);
  };

  // Display Text for Output (Full or Animated)
  const displayedConsoleText = isTracing || traceStep > 0
    ? totalCharactersToTrace.slice(0, traceStep) + (isTracing ? '▋' : '')
    : generatedOutputData.lines.join('\n');

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Game 3 */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-300 text-xs font-black tracking-wider uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                [Studi Kasus 5.4 Buku Algoritma]
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
                S1 Teknik Informatika &bull; Universitas PGRI Ronggolawe
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                Game 3: PyStar Pattern Simulator
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Eksplorasi interaktif perulangan bersarang (<strong className="text-amber-300">Nested Loops</strong>), 
              matriks koordinat kursor <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">(i, j)</code>, 
              serta kontrol argumen format <code className="text-emerald-300 bg-slate-800 px-1 py-0.5 rounded">print(..., end="")</code> berdasarkan 
              Buku Ajar resmi karya Mario Fahmi Syahrial dkk.
            </p>
          </div>

          {/* Student Status & Accumulated XP Badge */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/30 backdrop-blur-sm min-w-[200px]">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Peserta / Mahasiswa
              </span>
              <p className="text-xs font-bold text-white truncate max-w-[160px]">
                {playerInfo?.name || 'Mahasiswa S1'}
              </p>
              <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                {playerInfo?.institution || 'Universitas PGRI Ronggolawe'}
              </p>
            </div>

            <div className="flex items-center gap-2 pl-3 md:pl-0 border-l md:border-l-0 border-slate-800">
              <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-300 font-mono font-black text-sm flex items-center gap-1.5 shadow-sm">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{quizScore} XP Pola</span>
              </div>

              <button
                onClick={() => {
                  soundEngine.playPowerup();
                  setIsCertOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                title="Lihat &amp; Cetak Sertifikat Penghargaan Studi Kasus 5.4"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Sertifikat 🎓</span>
              </button>

              {onBackToLobby && (
                <button
                  onClick={onBackToLobby}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Kembali ke Game 1 & 2"
                >
                  <Home className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Lobby</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs (Lab vs Detective) */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              soundEngine.playPowerup();
              setActiveSubTab('lab');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeSubTab === 'lab'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-black scale-[1.02]'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Fitur A: Live Pattern Laboratory (Bab 5.4)</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPowerup();
              setActiveSubTab('quiz');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeSubTab === 'quiz'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 font-black scale-[1.02]'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Fitur B: Pattern Code Detective (Kuis Soal)</span>
            {completedQuestions.length > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                {completedQuestions.length}/5 Selesai
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FITUR A: LIVE INTERACTIVE PATTERN LABORATORY */}
      {/* ========================================================================= */}
      {activeSubTab === 'lab' && (
        <div className="space-y-6">
          {/* Pattern Selection Grid (5 Pilihan Pola Autentik dari Bab 5.4) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                1. Pilih Pola Bersarang (Rujukan Resmi Studi Kasus 5.4):
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                Pola Aktif: <strong className="text-amber-300">{currentPattern.title}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PATTERN_LIST.map((pattern) => {
                const isSelected = pattern.id === selectedPatternId;
                return (
                  <div
                    key={pattern.id}
                    onClick={() => {
                      soundEngine.playPowerup();
                      setSelectedPatternId(pattern.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none space-y-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border-amber-500 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {pattern.codeRef}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {pattern.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Controls Bar: Slider N + Karakter Selector + Step Tracer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-200">
                  2. Parameter Interaktif Simulator
                </span>
              </div>

              {/* Step-by-Step Animation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleTraceAnimation}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer ${
                    isTracing
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-emerald-500/20'
                  }`}
                  title={isTracing ? 'Jeda Animasi' : 'Jalankan Animasi Cetak Kursor (i, j)'}
                >
                  {isTracing ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda Cetak</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Animasi Matriks (Trace)</span>
                    </>
                  )}
                </button>

                {(isTracing || traceStep > 0) && (
                  <button
                    onClick={handleResetTrace}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 cursor-pointer"
                    title="Tampilkan Pola Penuh Seketika (Reset Trace)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Speed Controls */}
                <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-800">
                  <span className="text-[10px] text-slate-500 font-semibold">Speed:</span>
                  {[
                    { label: '1x', spd: 90 },
                    { label: '2x', spd: 50 },
                    { label: '3x', spd: 20 },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setTraceSpeed(s.spd)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                        traceSpeed === s.spd
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Slider Dinamis Tinggi Pola (N) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">
                    Tinggi Pola (Nilai N):
                  </span>
                  <span className="font-mono font-black text-sm px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    N = {patternHeight}
                  </span>
                </div>
                
                <input
                  type="range"
                  min={3}
                  max={10}
                  step={1}
                  value={patternHeight}
                  onChange={(e) => setPatternHeight(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Min (3)</span>
                  <span>5 (Default)</span>
                  <span>7</span>
                  <span>Max (10)</span>
                </div>
              </div>

              {/* Pemilih Karakter Cetak */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Karakter Cetak (Print Glyphs):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { val: '*', label: '* (Bintang)' },
                    { val: '#', label: '# (Pagar)' },
                    { val: '★', label: '★ (Glyph)' },
                    { val: 'j', label: 'j (Indeks Kolom)' },
                    { val: 'i', label: 'i (Indeks Baris)' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => {
                        soundEngine.playPowerup();
                        setPatternChar(item.val as PatternCharType);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        patternChar === item.val
                          ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20 scale-105'
                          : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dual-Screen Real-Time Renderer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Layar Kiri: Terminal Gelap macOS (Kode Python yang di-generate) */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
              {/* macOS Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono ml-2 font-semibold">
                    pattern_5_4.py
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition cursor-pointer"
                  title="Salin Kode Python Bersih"
                >
                  {isCopiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Editor Body with Clean Monospace Syntax View */}
              <div className="p-4 sm:p-5 font-mono text-xs text-slate-200 overflow-x-auto flex-grow bg-slate-950/50 leading-relaxed">
                <pre className="space-y-1">
                  {generatedPythonCode.split('\n').map((line, idx) => {
                    const isComment = line.trim().startsWith('#');
                    return (
                      <div key={idx} className="flex gap-4">
                        <span className="text-slate-600 select-none w-6 text-right font-light">
                          {idx + 1}
                        </span>
                        <span
                          className={
                            isComment
                              ? 'text-slate-500 italic'
                              : line.includes('for ')
                              ? 'text-indigo-300 font-semibold'
                              : line.includes('print(')
                              ? 'text-emerald-400'
                              : line.includes('range(')
                              ? 'text-cyan-300'
                              : 'text-slate-200'
                          }
                        >
                          {line}
                        </span>
                      </div>
                    );
                  })}
                </pre>
              </div>

              {/* Code Info Footer */}
              <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>Python 3.11 Standard</span>
                <span className="text-indigo-400">Nested Loop Structure</span>
              </div>
            </div>

            {/* Layar Kanan: Layar Output Konsol Monospaced */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
              {/* Console Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-300 font-mono font-bold">
                    Terminal Output (stdout)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isTracing && (
                    <span className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Printing...
                    </span>
                  )}

                  <button
                    onClick={handleCopyOutput}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition cursor-pointer"
                    title="Salin Hasil Output Konsol"
                  >
                    {isCopiedOutput ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Output</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Console Body: Glowing Amber/Cyan Monospaced Pattern */}
              <div className="p-5 sm:p-6 font-mono text-sm sm:text-base overflow-x-auto flex-grow bg-slate-950 flex items-center justify-center min-h-[220px]">
                <pre className="text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] tracking-widest leading-relaxed whitespace-pre font-bold select-all">
                  {displayedConsoleText}
                </pre>
              </div>

              {/* Metrics Calculation Bar */}
              <div className="p-3 sm:p-3.5 bg-slate-900/80 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Total Baris
                  </span>
                  <span className="font-mono font-bold text-white">
                    {generatedOutputData.totalLines} Baris
                  </span>
                </div>

                <div className="space-y-0.5 border-x border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Karakter Bintang
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {generatedOutputData.totalChars} Glyph
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Kompleksitas Iterasi
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    O(N²) &bull; {generatedOutputData.totalLoopIterations}x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Kartu Penjelasan Konsep Bab 5.4 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  Mengapa Belajar Nested Loops Penting untuk Matriks &amp; Pengolahan Citra Digital?
                </h3>
              </div>
              <button
                onClick={() => setShowConceptCard(!showConceptCard)}
                className="text-xs text-indigo-300 hover:text-white font-medium cursor-pointer"
              >
                {showConceptCard ? 'Sembunyikan' : 'Tampilkan Konsep'}
              </button>
            </div>

            {showConceptCard && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                    <Grid className="w-4 h-4 text-indigo-400" />
                    <span>1. Matriks 2D (i, j)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Loop luar <code className="text-indigo-300">i</code> mengontrol indeks baris, dan loop dalam <code className="text-cyan-300">j</code> mengontrol indeks kolom pada tabel matriks data.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>2. Piksel Citra RGB</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Setiap gambar digital tersusun atas matriks piksel lebar &times; tinggi yang dibaca secara raster menggunakan perulangan bersarang.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>3. Algoritma Sorting</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Metode pengurutan seperti Bubble Sort dan Insertion Sort membandingkan pasangan elemen melalui pola perulangan bersarang O(N²).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>4. Logika Game Board</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Papan catur, peta labirin, dan grid koordinat mini-game di-render dengan memeriksa status sel pada koordinat <code className="text-cyan-300">(i, j)</code>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FITUR B: "PATTERN CODE DETECTIVE" (KUIS & TANTANGAN BUKU BAB 5.4) */}
      {/* ========================================================================= */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6">
          {!showQuizResult ? (
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Stepper Soal 1 s.d. 10 */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
                  {PATTERN_DETECTIVE_QUESTIONS.map((q, idx) => {
                    const isDone = selectedAnswers[q.id] !== undefined;
                    const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                    const isCurrent = idx === currentQuizIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          soundEngine.playPowerup();
                          setCurrentQuizIndex(idx);
                        }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold text-xs flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 shadow-md shadow-amber-500/30 scale-105'
                            : isDone
                            ? isCorrect
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    Soal {currentQuizIndex + 1} dari {PATTERN_DETECTIVE_QUESTIONS.length}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    +50 XP
                  </span>
                </div>
              </div>

              {/* Question Card */}
              <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {currentQuestion.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Rujukan Bab 5.4 Buku Ajar
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Code Snippet if Available */}
                {currentQuestion.codeSnippet && (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
                    <div className="px-3.5 py-1.5 bg-slate-900/80 border-b border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-semibold">
                      <span>Cuplikan Kode Python Bab 5.4</span>
                      <span className="text-indigo-400">Analisis Sintaks</span>
                    </div>
                    <pre className="p-3.5 text-cyan-300 overflow-x-auto leading-relaxed">
                      {currentQuestion.codeSnippet}
                    </pre>
                  </div>
                )}

                {/* 4 Options Grid */}
                <div className="space-y-2.5">
                  <label className="text-xs uppercase font-bold text-slate-400 block">
                    Pilih Jawaban Anda:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentQuestion.options.map((optionText, optIdx) => {
                      const letter = ['A', 'B', 'C', 'D'][optIdx];
                      const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                      const isCorrect = optIdx === currentQuestion.correctAnswer;

                      let btnStyle = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-200';
                      if (isCurrentAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/20';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-500/20';
                        } else {
                          btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isCurrentAnswered}
                          onClick={() => handleSelectQuizAnswer(optIdx)}
                          className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center flex-shrink-0 ${
                            isCurrentAnswered && isCorrect
                              ? 'bg-emerald-500 text-slate-950 font-black'
                              : isCurrentAnswered && isSelected
                              ? 'bg-rose-500 text-white font-black'
                              : 'bg-slate-900 text-slate-300 border border-slate-700'
                          }`}>
                            {letter}
                          </span>

                          <span className="text-xs font-medium leading-relaxed pt-0.5">
                            {optionText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Explanation Card after Answer */}
                {isCurrentAnswered && (
                  <div className={`p-4 rounded-2xl border space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    isCurrentCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : 'bg-rose-950/30 border-rose-500/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCurrentCorrect ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                              Jawaban Tepat! (+50 XP Pola)
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-rose-400" />
                            <span className="text-xs font-black text-rose-300 uppercase tracking-wide">
                              Jawaban Kurang Tepat
                            </span>
                          </>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {currentQuestion.formulaNote}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        <span>
                          {currentQuizIndex < PATTERN_DETECTIVE_QUESTIONS.length - 1
                            ? 'Lanjut ke Soal Berikutnya'
                            : 'Lihat Rekap Hasil Detektif Pola'}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Rekap Skor Detektif Pola Selesai */
            <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                  Evaluasi Studi Kasus 5.4 Selesai
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Master Algoritma Nested Loop S1!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Selamat, <strong className="text-white">{playerInfo?.name || 'Mahasiswa'}</strong>! Anda telah berhasil menuntaskan seluruh 5 tantangan analisis kode perulangan bersarang Bab 5.4.
                </p>
              </div>

              {/* Score Recap Card */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Soal Terjawab Benar
                  </span>
                  <span className="font-mono font-black text-xl text-emerald-400">
                    {completedQuestions.length} / {PATTERN_DETECTIVE_QUESTIONS.length}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Total XP Terkumpul
                  </span>
                  <span className="font-mono font-black text-xl text-amber-400">
                    {quizScore} XP
                  </span>
                </div>
              </div>

              {/* Tombol Emas Klaim & Cetak Sertifikat Penghargaan Resmi */}
              <button
                onClick={() => {
                  soundEngine.playPowerup();
                  setIsCertOpen(true);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-amber-400/40 cursor-pointer"
              >
                <Award className="w-5 h-5 text-slate-950" />
                <span>KLAIM &amp; CETAK SERTIFIKAT PENGHARGAAN RESMI 🎓</span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 cursor-pointer"
                >
                  Ulangi Tantangan
                </button>
                <button
                  onClick={() => {
                    soundEngine.playPowerup();
                    setActiveSubTab('lab');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  Buka Laboratorium Pola
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Sertifikat Penghargaan Resmi Studi Kasus 5.4 */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        stats={{
          score: Math.min(100, Math.round((completedQuestions.length / PATTERN_DETECTIVE_QUESTIONS.length) * 100)),
          comboStreak: completedQuestions.length,
          maxCombo: completedQuestions.length,
          totalAnswered: PATTERN_DETECTIVE_QUESTIONS.length,
          correctCount: completedQuestions.length,
          wrongCount: PATTERN_DETECTIVE_QUESTIONS.length - completedQuestions.length,
          timeTakenSec: 0,
        }}
        mode="pystar"
        playerInfo={playerInfo}
      />
    </div>
  );
};
