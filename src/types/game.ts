export type QuestionType = 'multiple_choice' | 'true_false';
export type BabNumber = 1 | 2 | 3 | 4 | 5;
export type GameMode = 'duel' | 'survival';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BaseQuestion {
  id: string;
  bab: BabNumber;
  babTitle: string;
  difficulty: Difficulty;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0..3 index
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  statement: string;
  codeSnippet?: string;
  correctAnswer: boolean;
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion;

export interface PlayerInfo {
  name: string;
  institution: string;
}

export interface GameFilter {
  bab: BabNumber | 'all';
  type: QuestionType | 'all';
}

export interface PlayerStats {
  score: number;
  comboStreak: number;
  maxCombo: number;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  timeTakenSec: number;
}

export interface DuelState {
  playerHp: number;
  botHp: number;
  botStatus: string;
  isBotThinking: boolean;
}

export interface SurvivalState {
  lives: number;
  xp: number;
  shieldActive: boolean;
  powerups: {
    fiftyFifty: number;
    freezeTime: number;
    shield: number;
  };
}

export type GameOverReason = 'hp_depleted' | 'lives_depleted' | 'xp_depleted' | 'timeout' | 'out_of_questions' | 'quit';
export type GameScreen = 'lobby' | 'battle' | 'victory' | 'gameover';

// Sistem Tab Navigasi Mini-Game
export type MiniGameId = 'game1' | 'game2' | 'game3';

// Tipe Data Game 3: PyStar Pattern Simulator
export type PatternId = 'pola1_ascending' | 'pola2_descending' | 'pola3_right_aligned' | 'pola4_pyramid' | 'pola5_diamond' | 'pola5_number_triangle';

export type PatternCharType = '*' | '#' | '★' | 'j' | 'i';

export interface PatternDefinition {
  id: PatternId;
  codeRef: string;
  title: string;
  subtitle: string;
  description: string;
  generateCode: (n: number, char: PatternCharType) => string;
  generateOutput: (n: number, char: PatternCharType) => {
    lines: string[];
    totalChars: number;
    totalLines: number;
    totalLoopIterations: number;
  };
}

export interface PatternDetectiveQuestion {
  id: number;
  badge: string;
  title: string;
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  formulaNote: string;
}
