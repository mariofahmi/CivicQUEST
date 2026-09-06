import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Question,
  GameMode,
  DuelState,
  SurvivalState,
  PlayerStats,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  GameOverReason,
  PlayerInfo,
} from '../types/game';
import { StatusBarDuel } from './StatusBarDuel';
import { StatusBarSurvival } from './StatusBarSurvival';
import { QuestionCard } from './QuestionCard';
import { MultipleChoiceView } from './MultipleChoiceView';
import { TrueFalseView } from './TrueFalseView';
import { ExplanationModal } from './ExplanationModal';
import { soundEngine } from '../utils/soundEngine';
import { triggerComboConfetti } from '../utils/confetti';
import { AlertOctagon } from 'lucide-react';

interface BattleArenaProps {
  mode: GameMode;
  questions: Question[];
  onVictory: (finalStats: PlayerStats) => void;
  onGameOver: (finalStats: PlayerStats, reason: GameOverReason) => void;
  onExitMatch?: () => void;
  playerInfo?: PlayerInfo;
}

interface QuestionRecord {
  selectedMCAnswer: number | null;
  selectedTFAnswer: boolean | null;
  isAnswered: boolean;
  isCorrect: boolean;
  isTimeout: boolean;
  shieldSaved: boolean;
  duelDamageMessage: string;
  eliminatedIndices: number[];
  isFiftyFiftyUsedForCurrent: boolean;
  timeLeft: number;
}

const DUEL_TIME_LIMIT = 60; // 60s per question in Speed Duel
const SURVIVAL_TIME_LIMIT = 10; // 10s per question in Survival Run

export const BattleArena: React.FC<BattleArenaProps> = ({
  mode,
  questions,
  onVictory,
  onGameOver,
  onExitMatch,
  playerInfo,
}) => {
  const questionTimeLimit = mode === 'survival' ? SURVIVAL_TIME_LIMIT : DUEL_TIME_LIMIT;

  // Current question index
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];

  // Timer state (10s in Survival, 60s in Duel)
  const [timeLeft, setTimeLeft] = useState(questionTimeLimit);
  const [isTimerFrozen, setIsTimerFrozen] = useState(false);

  // Ref to forward handleNextQuestion to handleAnswer without cyclical dependencies
  const handleNextQuestionRef = useRef<() => void>(() => {});

  // User answer state
  const [selectedMCAnswer, setSelectedMCAnswer] = useState<number | null>(null);
  const [selectedTFAnswer, setSelectedTFAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [shieldSaved, setShieldSaved] = useState(false);
  const [duelDamageMessage, setDuelDamageMessage] = useState<string>('');

  // 50:50 Lifeline state for current question
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);
  const [isFiftyFiftyUsedForCurrent, setIsFiftyFiftyUsedForCurrent] = useState(false);

  // History records for back-navigation ('Mundur')
  const [questionRecords, setQuestionRecords] = useState<Record<number, QuestionRecord>>({});

  // Confirmation modal state for 'Berhenti Bermain'
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Duel State
  const [duelState, setDuelState] = useState<DuelState>({
    playerHp: 100,
    botHp: 100,
    botStatus: 'PyBot sedang menganalisis kode...',
    isBotThinking: true,
  });

  // Survival State
  const [survivalState, setSurvivalState] = useState<SurvivalState>({
    lives: 3,
    xp: 100, // 100 XP Ketahanan
    shieldActive: false,
    powerups: {
      fiftyFifty: 2,
      freezeTime: 2,
      shield: 1,
    },
  });

  // Overall Match Stats
  const [stats, setStats] = useState<PlayerStats>({
    score: 0,
    comboStreak: 0,
    maxCombo: 0,
    totalAnswered: 0,
    correctCount: 0,
    wrongCount: 0,
    timeTakenSec: 0,
  });

  // Stable references for timer, callbacks, and history recording
  const isAnsweredRef = useRef(isAnswered);
  isAnsweredRef.current = isAnswered;

  const isTimerFrozenRef = useRef(isTimerFrozen);
  isTimerFrozenRef.current = isTimerFrozen;

  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  const selectedMCAnswerRef = useRef(selectedMCAnswer);
  selectedMCAnswerRef.current = selectedMCAnswer;

  const selectedTFAnswerRef = useRef(selectedTFAnswer);
  selectedTFAnswerRef.current = selectedTFAnswer;

  const isCorrectRef = useRef(isCorrect);
  isCorrectRef.current = isCorrect;

  const isTimeoutRef = useRef(isTimeout);
  isTimeoutRef.current = isTimeout;

  const shieldSavedRef = useRef(shieldSaved);
  shieldSavedRef.current = shieldSaved;

  const duelDamageMessageRef = useRef(duelDamageMessage);
  duelDamageMessageRef.current = duelDamageMessage;

  const eliminatedIndicesRef = useRef(eliminatedIndices);
  eliminatedIndicesRef.current = eliminatedIndices;

  const isFiftyFiftyUsedForCurrentRef = useRef(isFiftyFiftyUsedForCurrent);
  isFiftyFiftyUsedForCurrentRef.current = isFiftyFiftyUsedForCurrent;

  const questionRecordsRef = useRef(questionRecords);
  questionRecordsRef.current = questionRecords;

  const statsRef = useRef(stats);
  statsRef.current = stats;

  const duelStateRef = useRef(duelState);
  duelStateRef.current = duelState;

  const survivalStateRef = useRef(survivalState);
  survivalStateRef.current = survivalState;

  const botTimerRef = useRef<number | null>(null);
  const matchStartTimeRef = useRef<number>(Date.now());

  // Save current question state snapshot
  const saveCurrentQuestionState = useCallback((idx: number) => {
    const record: QuestionRecord = {
      selectedMCAnswer: selectedMCAnswerRef.current,
      selectedTFAnswer: selectedTFAnswerRef.current,
      isAnswered: isAnsweredRef.current,
      isCorrect: isCorrectRef.current,
      isTimeout: isTimeoutRef.current,
      shieldSaved: shieldSavedRef.current,
      duelDamageMessage: duelDamageMessageRef.current,
      eliminatedIndices: eliminatedIndicesRef.current,
      isFiftyFiftyUsedForCurrent: isFiftyFiftyUsedForCurrentRef.current,
      timeLeft: timeLeftRef.current,
    };
    setQuestionRecords((prev) => ({
      ...prev,
      [idx]: record,
    }));
    questionRecordsRef.current[idx] = record;
  }, []);

  // Check victory / gameover conditions
  const checkEndGameConditions = useCallback(
    (
      updatedDuel: DuelState,
      updatedSurvival: SurvivalState,
      updatedStats: PlayerStats,
      isFinalQuestion: boolean
    ) => {
      if (mode === 'duel') {
        if (updatedDuel.botHp <= 0) {
          onVictory(updatedStats);
          return true;
        }
        if (updatedDuel.playerHp <= 0) {
          onGameOver(updatedStats, 'hp_depleted');
          return true;
        }
      } else {
        if (updatedSurvival.xp <= 0 || updatedSurvival.lives <= 0) {
          onGameOver(updatedStats, 'xp_depleted');
          return true;
        }
      }

      if (isFinalQuestion) {
        if (mode === 'duel') {
          if (updatedDuel.playerHp > updatedDuel.botHp) {
            onVictory(updatedStats);
          } else {
            onGameOver(updatedStats, 'hp_depleted');
          }
        } else {
          onVictory(updatedStats);
        }
        return true;
      }

      return false;
    },
    [mode, onVictory, onGameOver]
  );

  // Handle Player Answer Submission
  const handleAnswer = useCallback(
    (answerVal: number | boolean) => {
      if (isAnsweredRef.current) return;

      // Stop bot timer immediately
      if (botTimerRef.current) clearTimeout(botTimerRef.current);

      setIsAnswered(true);

      let correct = false;
      if (currentQuestion.type === 'multiple_choice') {
        setSelectedMCAnswer(answerVal as number);
        correct = (answerVal as number) === (currentQuestion as MultipleChoiceQuestion).correctAnswer;
      } else {
        setSelectedTFAnswer(answerVal as boolean);
        correct = (answerVal as boolean) === (currentQuestion as TrueFalseQuestion).correctAnswer;
      }

      setIsCorrect(correct);

      // Calculate score & combo using stable refs (20 questions x 5 points = 100 max score)
      const currentStats = statsRef.current;
      const timeSpent = Math.round((Date.now() - matchStartTimeRef.current) / 1000);
      const newStreak = correct ? currentStats.comboStreak + 1 : 0;
      const newMaxCombo = Math.max(currentStats.maxCombo, newStreak);
      const pointsPerQuestion = questions.length > 0 ? Math.round(100 / questions.length) : 5;
      const newCorrectCount = currentStats.correctCount + (correct ? 1 : 0);
      const newScore = Math.min(100, newCorrectCount * pointsPerQuestion);

      const newStats: PlayerStats = {
        score: newScore,
        comboStreak: newStreak,
        maxCombo: newMaxCombo,
        totalAnswered: currentStats.totalAnswered + 1,
        correctCount: newCorrectCount,
        wrongCount: currentStats.wrongCount + (correct ? 0 : 1),
        timeTakenSec: timeSpent,
      };
      setStats(newStats);

      // Play sound & visual effects
      if (correct) {
        soundEngine.playCorrect();
        if (newStreak >= 3) {
          triggerComboConfetti();
        }
      } else {
        soundEngine.playWrong();
      }

      let nextDuelState = { ...duelStateRef.current };
      let nextSurvivalState = { ...survivalStateRef.current };
      let damageMsg = '';
      if (mode === 'duel') {
        if (correct) {
          // Player attacks PyBot! (5 HP per correct hit, so 20 correct answers = 100 HP defeated)
          const newBotHp = Math.max(0, nextDuelState.botHp - 5);
          nextDuelState = {
            ...nextDuelState,
            botHp: newBotHp,
            isBotThinking: false,
          };
          damageMsg = '💥 Analisis Tepat! (+5 Nilai) PyBot kehilangan 5 HP.';
          setDuelDamageMessage(damageMsg);
        } else {
          // Player made a mistake; PyBot counters with 5 HP damage
          const newPlayerHp = Math.max(0, nextDuelState.playerHp - 5);
          nextDuelState = {
            ...nextDuelState,
            playerHp: newPlayerHp,
            isBotThinking: false,
          };
          damageMsg = '⚡ Jawaban Keliru! Serangan balik PyBot mengurangi 5 HP Anda.';
          setDuelDamageMessage(damageMsg);
        }
        setDuelState(nextDuelState);
      } else {
        // Survival mode: Jawaban salah mengurangi 5 XP (atau diserap perisai)
        if (!correct) {
          if (nextSurvivalState.shieldActive) {
            setShieldSaved(true);
            nextSurvivalState = {
              ...nextSurvivalState,
              shieldActive: false,
            };
            soundEngine.playShield();
          } else {
            const newXp = Math.max(0, (nextSurvivalState.xp ?? 100) - 5);
            const newLives = Math.ceil(newXp / 33.4);
            nextSurvivalState = {
              ...nextSurvivalState,
              xp: newXp,
              lives: newLives,
            };
          }
        } else {
          // Jawaban Benar di Survival: Combo streak >= 3x memulihkan +5 XP (maksimal 100 XP)
          if (newStreak >= 3 && (nextSurvivalState.xp ?? 100) < 100) {
            const recoveredXp = Math.min(100, (nextSurvivalState.xp ?? 100) + 5);
            nextSurvivalState = {
              ...nextSurvivalState,
              xp: recoveredXp,
              lives: Math.ceil(recoveredXp / 33.4),
            };
          }
        }
        setSurvivalState(nextSurvivalState);
      }

      // Record question answer state in history
      const record: QuestionRecord = {
        selectedMCAnswer: currentQuestion.type === 'multiple_choice' ? (answerVal as number) : null,
        selectedTFAnswer: currentQuestion.type === 'true_false' ? (answerVal as boolean) : null,
        isAnswered: true,
        isCorrect: correct,
        isTimeout: false,
        shieldSaved: !correct && nextSurvivalState.shieldActive,
        duelDamageMessage: damageMsg,
        eliminatedIndices,
        isFiftyFiftyUsedForCurrent,
        timeLeft: timeLeftRef.current,
      };
      setQuestionRecords((prev) => ({ ...prev, [currentIndex]: record }));
      questionRecordsRef.current[currentIndex] = record;

      // Check if match ends immediately on this turn
      const isFinal = currentIndex >= questions.length - 1;
      checkEndGameConditions(
        nextDuelState,
        nextSurvivalState,
        newStats,
        isFinal && (nextDuelState.botHp <= 0 || nextDuelState.playerHp <= 0 || nextSurvivalState.lives <= 0)
      );

      // Mode Survival Run: Tanpa modal pembahasan jawaban, auto-advance cepat ke soal berikutnya!
      if (mode === 'survival') {
        if (nextSurvivalState.xp <= 0 || nextSurvivalState.lives <= 0) {
          const gameOverTimer = window.setTimeout(() => {
            onGameOver(newStats, 'xp_depleted');
          }, 750);
          return () => clearTimeout(gameOverTimer);
        }

        if (isFinal) {
          const victoryTimer = window.setTimeout(() => {
            onVictory(newStats);
          }, 750);
          return () => clearTimeout(victoryTimer);
        }

        const autoNextTimer = window.setTimeout(() => {
          handleNextQuestionRef.current();
        }, 800);
        return () => clearTimeout(autoNextTimer);
      }
    },
    [currentQuestion, mode, currentIndex, questions.length, checkEndGameConditions, eliminatedIndices, isFiftyFiftyUsedForCurrent, onGameOver, onVictory]
  );

  // 1. Core Reliable 1-Second Countdown Timer
  useEffect(() => {
    const existingRec = questionRecordsRef.current[currentIndex];
    if (existingRec && existingRec.isAnswered) {
      // Question already answered previously; keep recorded timeLeft and do not tick
      return;
    }

    // Reset timer when question starts or advances to a fresh question
    setTimeLeft(questionTimeLimit);
    setIsTimerFrozen(false);

    const timer = window.setInterval(() => {
      // Pause if frozen, question already answered, or confirmation modal open
      if (isTimerFrozenRef.current || isAnsweredRef.current || showQuitConfirm) return;

      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        // Ticking sound when <= 4s in Survival or <= 7s in Duel
        if (mode === 'survival' ? prev <= 4 : prev <= 7) {
          soundEngine.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [currentIndex, questionTimeLimit, mode, showQuitConfirm]);

  // 2. ATURAN: JIKA WAKTU HABIS (timeLeft === 0), MAKA LANGSUNG KALAH (GAME OVER)!
  useEffect(() => {
    if (timeLeft === 0 && !isAnsweredRef.current) {
      // Set answered & timeout states
      setIsAnswered(true);
      setIsTimeout(true);
      soundEngine.playWrong();

      // Cancel rival bot action
      if (botTimerRef.current) clearTimeout(botTimerRef.current);

      const currentStats = statsRef.current;
      const timeSpent = Math.round((Date.now() - matchStartTimeRef.current) / 1000);
      const updatedStats: PlayerStats = {
        ...currentStats,
        totalAnswered: currentStats.totalAnswered + 1,
        wrongCount: currentStats.wrongCount + 1,
        comboStreak: 0,
        timeTakenSec: timeSpent,
      };
      setStats(updatedStats);

      if (mode === 'duel') {
        setDuelState((prev) => ({
          ...prev,
          playerHp: 0,
          isBotThinking: false,
        }));

        // Kalah langsung! Trigger game over screen with 'timeout' reason
        const gameOverTimer = window.setTimeout(() => {
          onGameOver(updatedStats, 'timeout');
        }, 700);

        return () => clearTimeout(gameOverTimer);
      } else {
        // Survival Run: Waktu habis (10 detik) mengurangi 5 XP (atau diserap perisai)
        let nextSurvival = { ...survivalStateRef.current };
        if (nextSurvival.shieldActive) {
          setShieldSaved(true);
          nextSurvival = {
            ...nextSurvival,
            shieldActive: false,
          };
          soundEngine.playShield();
        } else {
          const newXp = Math.max(0, (nextSurvival.xp ?? 100) - 5);
          const newLives = Math.ceil(newXp / 33.4);
          nextSurvival = {
            ...nextSurvival,
            xp: newXp,
            lives: newLives,
          };
        }
        setSurvivalState(nextSurvival);

        if (nextSurvival.xp <= 0 || nextSurvival.lives <= 0) {
          const gameOverTimer = window.setTimeout(() => {
            onGameOver(updatedStats, 'xp_depleted');
          }, 700);
          return () => clearTimeout(gameOverTimer);
        }

        const isFinal = currentIndex >= questions.length - 1;
        if (isFinal) {
          const victoryTimer = window.setTimeout(() => {
            onVictory(updatedStats);
          }, 700);
          return () => clearTimeout(victoryTimer);
        }

        // Auto-advance ke soal berikutnya tanpa modal pembahasan
        const nextTimer = window.setTimeout(() => {
          handleNextQuestionRef.current();
        }, 800);
        return () => clearTimeout(nextTimer);
      }
    }
  }, [timeLeft, mode, onGameOver, onVictory, currentIndex, questions.length]);

  // 3. Handle PyBot AI Thinking & Action Simulation
  useEffect(() => {
    if (mode !== 'duel' || isAnswered) return;

    setDuelState((prev) => ({
      ...prev,
      isBotThinking: true,
    }));

    // PyBot thinking delay: 25 to 45 seconds (dari total 60 detik)
    const botThinkingDelay = (Math.floor(Math.random() * 21) + 25) * 1000;

    botTimerRef.current = window.setTimeout(() => {
      if (isAnsweredRef.current) return;

      const isBotCorrect = Math.random() < 0.75; // ~75% accuracy

      if (isBotCorrect) {
        // Bot answers correctly before the player!
        setDuelState((prev) => ({
          ...prev,
          isBotThinking: false,
        }));
        // Player penalized as bot hit first
        handleAnswer(currentQuestion.type === 'multiple_choice' ? -1 : false);
      } else {
        // Bot made a mistake! Gives player remaining time to attack
        setDuelState((prev) => ({
          ...prev,
          isBotThinking: false,
        }));
      }
    }, botThinkingDelay);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [currentIndex, mode, isAnswered, handleAnswer, currentQuestion.type]);

  // Always ensure viewport scrolls to top when changing question so top is never cut off
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentIndex]);

  // Navigate to Previous Question (Mundur)
  const handlePrevQuestion = useCallback(() => {
    if (currentIndex <= 0) return;

    soundEngine.playPowerup();

    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    // Save current question state
    saveCurrentQuestionState(currentIndex);

    const prevIndex = currentIndex - 1;
    const prevRecord = questionRecordsRef.current[prevIndex];

    if (prevRecord) {
      setSelectedMCAnswer(prevRecord.selectedMCAnswer);
      setSelectedTFAnswer(prevRecord.selectedTFAnswer);
      setIsAnswered(prevRecord.isAnswered);
      setIsCorrect(prevRecord.isCorrect);
      setIsTimeout(prevRecord.isTimeout);
      setShieldSaved(prevRecord.shieldSaved);
      setDuelDamageMessage(prevRecord.duelDamageMessage);
      setEliminatedIndices(prevRecord.eliminatedIndices);
      setIsFiftyFiftyUsedForCurrent(prevRecord.isFiftyFiftyUsedForCurrent);
      setTimeLeft(prevRecord.timeLeft);
    } else {
      setSelectedMCAnswer(null);
      setSelectedTFAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setIsTimeout(false);
      setShieldSaved(false);
      setDuelDamageMessage('');
      setEliminatedIndices([]);
      setIsFiftyFiftyUsedForCurrent(false);
      setTimeLeft(questionTimeLimit);
    }

    setCurrentIndex(prevIndex);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentIndex, saveCurrentQuestionState]);

  // Advance to Next Question
  const handleNextQuestion = useCallback(() => {
    soundEngine.playPowerup();

    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    // Check if match should terminate
    const isFinal = currentIndex >= questions.length - 1;
    if (isFinal) {
      const ended = checkEndGameConditions(duelState, survivalState, stats, isFinal);
      if (ended) return;
    }

    // Save current question state
    saveCurrentQuestionState(currentIndex);

    const nextIndex = currentIndex + 1;
    const nextRecord = questionRecordsRef.current[nextIndex];

    if (nextRecord) {
      // Previously visited / answered question
      setSelectedMCAnswer(nextRecord.selectedMCAnswer);
      setSelectedTFAnswer(nextRecord.selectedTFAnswer);
      setIsAnswered(nextRecord.isAnswered);
      setIsCorrect(nextRecord.isCorrect);
      setIsTimeout(nextRecord.isTimeout);
      setShieldSaved(nextRecord.shieldSaved);
      setDuelDamageMessage(nextRecord.duelDamageMessage);
      setEliminatedIndices(nextRecord.eliminatedIndices);
      setIsFiftyFiftyUsedForCurrent(nextRecord.isFiftyFiftyUsedForCurrent);
      setTimeLeft(nextRecord.timeLeft);
    } else {
      // Fresh unanswered question
      setSelectedMCAnswer(null);
      setSelectedTFAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setIsTimeout(false);
      setShieldSaved(false);
      setDuelDamageMessage('');
      setEliminatedIndices([]);
      setIsFiftyFiftyUsedForCurrent(false);
      setTimeLeft(questionTimeLimit);
    }

    setCurrentIndex(nextIndex);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentIndex, questions.length, checkEndGameConditions, duelState, survivalState, stats, saveCurrentQuestionState, questionTimeLimit]);

  handleNextQuestionRef.current = handleNextQuestion;

  // Power-up 1: 50:50 Lifeline
  const handleUseFiftyFifty = () => {
    if (
      survivalState.powerups.fiftyFifty <= 0 ||
      currentQuestion.type !== 'multiple_choice' ||
      isFiftyFiftyUsedForCurrent
    ) {
      return;
    }

    const mcQ = currentQuestion as MultipleChoiceQuestion;
    const wrongIndices = [0, 1, 2, 3].filter((idx) => idx !== mcQ.correctAnswer);

    // Shuffle & pick 2 wrong indices to eliminate
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
    const toEliminate = shuffledWrong.slice(0, 2);

    setEliminatedIndices(toEliminate);
    setIsFiftyFiftyUsedForCurrent(true);
    setSurvivalState((prev) => ({
      ...prev,
      powerups: {
        ...prev.powerups,
        fiftyFifty: prev.powerups.fiftyFifty - 1,
      },
    }));
  };

  // Power-up 2: Freeze Time (+10s and pause for 3s)
  const handleUseFreezeTime = () => {
    if (survivalState.powerups.freezeTime <= 0) return;

    const addTime = mode === 'survival' ? 5 : 10;
    setTimeLeft((prev) => Math.min(questionTimeLimit, prev + addTime));
    setIsTimerFrozen(true);
    isTimerFrozenRef.current = true;

    setSurvivalState((prev) => ({
      ...prev,
      powerups: {
        ...prev.powerups,
        freezeTime: prev.powerups.freezeTime - 1,
      },
    }));

    // Unfreeze after 3 seconds
    setTimeout(() => {
      setIsTimerFrozen(false);
      isTimerFrozenRef.current = false;
    }, 3000);
  };

  // Power-up 3: Shield Activation
  const handleUseShield = () => {
    if (survivalState.powerups.shield <= 0 || survivalState.shieldActive) return;

    setSurvivalState((prev) => ({
      ...prev,
      shieldActive: true,
      powerups: {
        ...prev.powerups,
        shield: prev.powerups.shield - 1,
      },
    }));
  };

  // Open quit confirmation modal
  const handleOpenQuitConfirm = () => {
    setShowQuitConfirm(true);
  };

  // Confirm quitting / stopping the match
  const handleConfirmQuit = () => {
    setShowQuitConfirm(false);
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    const currentStats = statsRef.current;
    const timeSpent = Math.round((Date.now() - matchStartTimeRef.current) / 1000);
    const finalScoreStats: PlayerStats = {
      ...currentStats,
      timeTakenSec: timeSpent,
    };
    onGameOver(finalScoreStats, 'quit');
  };

  return (
    <div
      className={`max-w-4xl mx-auto px-2.5 sm:px-4 py-1 sm:py-2 space-y-2 sm:space-y-2.5 transition-all ${
        mode === 'duel' && isAnswered && !isTimeout ? 'pb-28 sm:pb-32' : 'pb-4'
      }`}
    >
      {/* Dynamic Status Bar based on Mode */}
      {mode === 'duel' ? (
        <StatusBarDuel
          duelState={duelState}
          turnScore={stats.score}
          timeLeft={timeLeft}
          maxTime={DUEL_TIME_LIMIT}
          playerInfo={playerInfo}
        />
      ) : (
        <StatusBarSurvival
          survivalState={survivalState}
          score={stats.score}
          comboStreak={stats.comboStreak}
          currentQuestionType={currentQuestion.type}
          onUseFiftyFifty={handleUseFiftyFifty}
          onUseFreezeTime={handleUseFreezeTime}
          onUseShield={handleUseShield}
          isFiftyFiftyUsedForCurrent={isFiftyFiftyUsedForCurrent}
        />
      )}

      {/* Main Question Card with macOS terminal snippet, timer, and Mundur navigation */}
      <QuestionCard
        question={currentQuestion}
        questionIndex={currentIndex}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
        maxTime={questionTimeLimit}
        onPrevQuestion={handlePrevQuestion}
        canGoPrev={mode === 'duel' && currentIndex > 0}
        onStopPlaying={handleOpenQuitConfirm}
      />

      {/* Answer Options View (Multiple Choice vs True/False) */}
      <div className="pt-0.5">
        {currentQuestion.type === 'multiple_choice' ? (
          <MultipleChoiceView
            question={currentQuestion as MultipleChoiceQuestion}
            selectedAnswer={selectedMCAnswer}
            onSelectAnswer={(idx) => handleAnswer(idx)}
            eliminatedIndices={eliminatedIndices}
            isAnswered={isAnswered}
            disabled={isAnswered}
          />
        ) : (
          <TrueFalseView
            question={currentQuestion as TrueFalseQuestion}
            selectedAnswer={selectedTFAnswer}
            onSelectAnswer={(val) => handleAnswer(val)}
            isAnswered={isAnswered}
            disabled={isAnswered}
          />
        )}
      </div>

      {/* Theoretical Explanation & Next/Prev Step Modal (Hanya pada mode Duel) */}
      {mode === 'duel' && isAnswered && !isTimeout && (
        <ExplanationModal
          question={currentQuestion}
          isCorrect={isCorrect}
          isTimeout={isTimeout}
          shieldSaved={shieldSaved}
          onNextQuestion={handleNextQuestion}
          onPrevQuestion={handlePrevQuestion}
          canGoPrev={currentIndex > 0}
          onStopPlaying={handleOpenQuitConfirm}
          isLastQuestion={currentIndex >= questions.length - 1}
          duelDamageMessage={duelDamageMessage}
        />
      )}

      {/* Confirmation Modal for Berhenti Bermain */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Berhenti Bermain?</h3>
                <p className="text-xs text-slate-400">Apakah Anda yakin ingin mengakhiri sesi bermain ini?</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <p>
                Pertandingan akan disudahi sekarang. Nilai yang telah Anda kumpulkan (<span className="text-amber-400 font-bold">{stats.score} / 100</span>) dan statistik akurasi tetap tersimpan untuk dievaluasi.
              </p>
              <p className="text-[11px] text-slate-400">
                Anda juga tetap dapat mengklaim &amp; mencetak sertifikat resmi berdasarkan nilai sesi ini.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowQuitConfirm(false)}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer border border-slate-700 hover:border-slate-600"
              >
                Lanjut Bermain
              </button>
              <button
                type="button"
                onClick={handleConfirmQuit}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition shadow-lg shadow-rose-600/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Ya, Berhenti Bermain
              </button>
            </div>

            {onExitMatch && (
              <button
                type="button"
                onClick={() => {
                  setShowQuitConfirm(false);
                  if (botTimerRef.current) clearTimeout(botTimerRef.current);
                  onExitMatch();
                }}
                className="w-full py-1 text-center text-[11px] text-slate-400 hover:text-slate-200 underline transition cursor-pointer"
              >
                Atau keluar langsung ke Menu Utama
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
