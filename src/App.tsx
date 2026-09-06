import React, { useState, useEffect } from 'react';
import { GameScreen, GameMode, GameFilter, PlayerStats, Question, GameOverReason, PlayerInfo, MiniGameId } from './types/game';
import { questionBank } from './data/questionBank';
import { Navbar } from './components/Navbar';
import { RulesModal } from './components/RulesModal';
import { BookInfoModal } from './components/BookInfoModal';
import { LobbyScreen } from './components/LobbyScreen';
import { BattleArena } from './components/BattleArena';
import { VictoryScreen } from './components/VictoryScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { MiniGameTabBar } from './components/MiniGameTabBar';
import { PyStarPatternGame } from './components/PyStarPatternGame';
import { soundEngine } from './utils/soundEngine';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<GameScreen>('lobby');
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameId>('game1');
  const [mode, setMode] = useState<GameMode>('duel');
  const [filter, setFilter] = useState<GameFilter>({
    bab: 'all',
    type: 'all',
  });
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>(() => {
    const savedName = localStorage.getItem('pyduel_player_name') || '';
    const savedInst = localStorage.getItem('pyduel_player_institution') || '';
    return { name: savedName, institution: savedInst };
  });

  const handleUpdatePlayerInfo = (info: PlayerInfo) => {
    setPlayerInfo(info);
    localStorage.setItem('pyduel_player_name', info.name);
    localStorage.setItem('pyduel_player_institution', info.institution);
  };

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isBookInfoOpen, setIsBookInfoOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundEngine.getIsMuted());
  const [isBgmMuted, setIsBgmMuted] = useState(() => soundEngine.getIsBgmMuted());
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('pyduel_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Inisialisasi BGM latar belakang otomatis
  useEffect(() => {
    soundEngine.initBgm('./bgm.mp3');
  }, []);

  // Handle BGM Toggle
  const handleToggleBgmMute = () => {
    const newBgmMute = soundEngine.toggleBgmMute();
    setIsBgmMuted(newBgmMute);
  };

  // Active match questions & stats
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [finalStats, setFinalStats] = useState<PlayerStats>({
    score: 0,
    comboStreak: 0,
    maxCombo: 0,
    totalAnswered: 0,
    correctCount: 0,
    wrongCount: 0,
    timeTakenSec: 0,
  });
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>('hp_depleted');

  // Handle SFX Mute Toggle
  const handleToggleMute = () => {
    const newMute = soundEngine.toggleMute();
    setIsMuted(newMute);
  };

  // Start new match with exactly 20 questions (Nilai Maksimal 100 Poin)
  const handleStartGame = () => {
    const filtered = questionBank.filter((q) => {
      const babMatches = filter.bab === 'all' || q.bab === filter.bab;
      const typeMatches = filter.type === 'all' || q.type === filter.type;
      return babMatches && typeMatches;
    });

    if (filtered.length === 0) return;

    // Shuffle questions
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    
    // Tepat 20 soal agar nilai maksimal adalah 100 (5 poin per soal benar)
    let matchQuestions: Question[] = [];
    if (shuffled.length >= 20) {
      matchQuestions = shuffled.slice(0, 20);
    } else {
      // Jika filter bab memiliki < 20 soal, susun siklus acak sampai genap 20 soal
      while (matchQuestions.length < 20) {
        const remaining = 20 - matchQuestions.length;
        const addChunk = [...shuffled].sort(() => 0.5 - Math.random()).slice(0, remaining);
        matchQuestions = [...matchQuestions, ...addChunk];
      }
    }

    setActiveQuestions(matchQuestions);
    setScreen('battle');
  };

  // Handle Victory
  const handleVictory = (stats: PlayerStats) => {
    setFinalStats(stats);
    if (stats.score > highScore) {
      setHighScore(stats.score);
      localStorage.setItem('pyduel_high_score', stats.score.toString());
    }
    setScreen('victory');
  };

  // Handle Game Over
  const handleGameOver = (
    stats: PlayerStats,
    reason: GameOverReason
  ) => {
    setFinalStats(stats);
    if (stats.score > highScore) {
      setHighScore(stats.score);
      localStorage.setItem('pyduel_high_score', stats.score.toString());
    }
    setGameOverReason(reason);
    setScreen('gameover');
  };

  const handleReturnToLobby = () => {
    setScreen('lobby');
  };

  const handleSelectMiniGameTab = (tabId: MiniGameId) => {
    setActiveMiniGame(tabId);
    if (tabId === 'game1') {
      setMode('duel');
      setScreen('lobby');
    } else if (tabId === 'game2') {
      setMode('survival');
      setScreen('lobby');
    } else if (tabId === 'game3') {
      setScreen('lobby');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isBgmMuted={isBgmMuted}
        onToggleBgmMute={handleToggleBgmMute}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenBookInfo={() => setIsBookInfoOpen(true)}
        onReturnHome={screen !== 'lobby' || activeMiniGame !== 'game1' ? () => handleSelectMiniGameTab('game1') : undefined}
        isInGame={screen === 'battle'}
      />

      {/* Mini-Game Segmented Navigation Bar (Visible in Lobby & Exploration) */}
      {screen === 'lobby' && (
        <MiniGameTabBar
          activeTab={activeMiniGame}
          onSelectTab={handleSelectMiniGameTab}
        />
      )}

      {/* Main Content Viewport */}
      <main
        className={`flex-grow flex flex-col ${
          screen === 'lobby' ? 'justify-start' : 'justify-start'
        } py-2 sm:py-4`}
      >
        {screen === 'lobby' && activeMiniGame === 'game3' && (
          <PyStarPatternGame
            playerInfo={playerInfo}
            onBackToLobby={() => handleSelectMiniGameTab('game1')}
          />
        )}

        {screen === 'lobby' && activeMiniGame !== 'game3' && (
          <LobbyScreen
            selectedMode={mode}
            onSelectMode={(newMode) => {
              setMode(newMode);
              setActiveMiniGame(newMode === 'duel' ? 'game1' : 'game2');
            }}
            filter={filter}
            onChangeFilter={setFilter}
            playerInfo={playerInfo}
            onUpdatePlayerInfo={handleUpdatePlayerInfo}
            onStartGame={handleStartGame}
            highScore={highScore}
            onSelectGame3={() => handleSelectMiniGameTab('game3')}
          />
        )}

        {screen === 'battle' && (
          <BattleArena
            key={activeQuestions.map(q => q.id).join('-')}
            mode={mode}
            questions={activeQuestions}
            onVictory={handleVictory}
            onGameOver={handleGameOver}
            onExitMatch={handleReturnToLobby}
            playerInfo={playerInfo}
          />
        )}

        {screen === 'victory' && (
          <VictoryScreen
            mode={mode}
            stats={finalStats}
            onPlayAgain={handleStartGame}
            onBackToLobby={handleReturnToLobby}
            playerInfo={playerInfo}
          />
        )}

        {screen === 'gameover' && (
          <GameOverScreen
            mode={mode}
            stats={finalStats}
            reason={gameOverReason}
            onPlayAgain={handleStartGame}
            onBackToLobby={handleReturnToLobby}
            playerInfo={playerInfo}
          />
        )}
      </main>

      {/* Footer (Only rendered outside active battle to maximize screen visibility) */}
      {screen !== 'battle' && (
        <footer className="py-6 border-t border-slate-900/80 bg-slate-950/60 text-center text-xs text-slate-400 space-y-2 px-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <img src="./logo-unirow.png" alt="Logo Universitas PGRI Ronggolawe" className="w-5 h-5 object-contain" />
            <span className="font-semibold text-slate-300">
              Universitas PGRI Ronggolawe
            </span>
          </div>
          <p className="font-medium text-slate-300">
            PyDuel: Battle of Algorithms &bull; Adaptasi Buku Ajar S1: <span className="text-white font-bold">&ldquo;ALGORITMA dan Pemrograman dengan Python&rdquo;</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Penulis Buku: Andy Haryoko, Moh. Muhyidin Agus Wibowo, Anggia Kalista, Krishna Tri Sanjaya, Mario Fahmi Syahrial
          </p>
        </footer>
      )}

      {/* Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <BookInfoModal isOpen={isBookInfoOpen} onClose={() => setIsBookInfoOpen(false)} />
    </div>
  );
};

export default App;
