import { useState, useEffect } from 'react';
import './index.css';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';

export function App() {
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Set direction for Arabic text
  useEffect(() => {
    document.body.classList.add('rtl');
    return () => document.body.classList.remove('rtl');
  }, []);

  const startGame = (playerNames: string[]) => {
    setPlayers(playerNames);
    setGameStarted(true);
  };

  const resetGame = () => {
    setPlayers([]);
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-4 py-5 md:px-6 md:py-8">
        {!gameStarted ? (
          <HomePage onStartGame={startGame} />
        ) : (
          <GamePage players={players} onResetGame={resetGame} />
        )}
      </div>
      <div className="game-decoration mt-4">
        <div className="h-3 w-20 bg-red-600 rounded-full mx-1"></div>
        <div className="h-3 w-3 bg-red-600 rounded-full mx-1"></div>
        <div className="h-3 w-3 bg-red-600 rounded-full mx-1"></div>
      </div>
    </div>
  );
}

export default App;
