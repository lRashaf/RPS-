import { useState, useEffect } from 'react';
import { Hand, RotateCcw, Star } from 'lucide-react';
import PlayerCard from './PlayerCard';
import WinnerScreen from './WinnerScreen';

type Move = 'rock' | 'paper' | 'scissors';
type PlayerState = {
  name: string;
  move: Move | null;
  isEliminated: boolean;
  result?: 'win' | 'lose' | 'draw';
};

interface GamePageProps {
  players: string[];
  onResetGame: () => void;
}

const GamePage = ({ players, onResetGame }: GamePageProps) => {
  const [playerStates, setPlayerStates] = useState<PlayerState[]>([]);
  const [round, setRound] = useState(1);
  const [gameStatus, setGameStatus] = useState<'preparing' | 'revealing' | 'complete'>('preparing');
  const [winner, setWinner] = useState<string | null>(null);

  // Initialize player states
  useEffect(() => {
    setPlayerStates(
      players.map((name) => ({
        name,
        move: null,
        isEliminated: false,
      }))
    );
  }, [players]);

  // Play sound effect for elimination
  const playSound = (sound: 'win' | 'lose' | 'reveal') => {
    const audio = new Audio();
    switch (sound) {
      case 'win':
        audio.src = 'https://freesound.org/data/previews/270/270402_5123827-lq.mp3';
        break;
      case 'lose':
        audio.src = 'https://freesound.org/data/previews/362/362205_6629905-lq.mp3';
        break;
      case 'reveal':
        audio.src = 'https://freesound.org/data/previews/242/242503_4414128-lq.mp3';
        break;
    }
    audio.volume = 0.25;
    audio.play().catch(e => console.log('Audio error:', e));
  };

  const moves: Move[] = ['rock', 'paper', 'scissors'];

  // Improved random function to ensure better distribution
  const getRandomMove = (): Move => {
    // Use a more sophisticated random number generation
    // Adding time component to improve entropy
    const randomSeed = Date.now() + Math.random() * 10000;
    const randomIndex = Math.floor((randomSeed % 1) * 3);
    return moves[randomIndex];
  };

  const assignRandomMoves = () => {
    const activePlayers = playerStates.filter((p) => !p.isEliminated);
    
    if (activePlayers.length <= 1) {
      if (activePlayers.length === 1) {
        setWinner(activePlayers[0].name);
        playSound('win');
      }
      setGameStatus('complete');
      return;
    }

    playSound('reveal');
    const updatedPlayers = [...playerStates];
    
    // Assign truly random moves to active players
    updatedPlayers.forEach((player) => {
      if (!player.isEliminated) {
        // Use improved random move function
        player.move = getRandomMove();
        player.result = undefined;
      }
    });
    
    setPlayerStates(updatedPlayers);
    setTimeout(() => handleRoundCompletion(updatedPlayers), 1500);
  };

  const handleRoundCompletion = (playersWithMoves: PlayerState[]) => {
    const activePlayers = playersWithMoves.filter((p) => !p.isEliminated);
    
    // Count how many of each move exists
    const moveCounts = {
      rock: activePlayers.filter((p) => p.move === 'rock').length,
      paper: activePlayers.filter((p) => p.move === 'paper').length,
      scissors: activePlayers.filter((p) => p.move === 'scissors').length,
    };
    
    // Determine which moves lose this round (enhanced logic)
    const losingMoves: Move[] = [];
    
    // All three moves present - special case
    if (moveCounts.rock > 0 && moveCounts.paper > 0 && moveCounts.scissors > 0) {
      // With all three present, we can eliminate the move with the fewest players
      // Or randomly choose one if they're tied
      const minCount = Math.min(moveCounts.rock, moveCounts.paper, moveCounts.scissors);
      
      const candidateMoves: Move[] = [];
      if (moveCounts.rock === minCount) candidateMoves.push('rock');
      if (moveCounts.paper === minCount) candidateMoves.push('paper');
      if (moveCounts.scissors === minCount) candidateMoves.push('scissors');
      
      // Randomly select one of the candidate moves to lose
      if (candidateMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * candidateMoves.length);
        losingMoves.push(candidateMoves[randomIndex]);
      }
    } 
    // Two moves present - traditional RPS rules
    else if (moveCounts.rock > 0 && moveCounts.paper > 0 && moveCounts.scissors === 0) {
      losingMoves.push('rock'); // Paper beats rock
    } 
    else if (moveCounts.rock > 0 && moveCounts.scissors > 0 && moveCounts.paper === 0) {
      losingMoves.push('scissors'); // Rock beats scissors
    } 
    else if (moveCounts.paper > 0 && moveCounts.scissors > 0 && moveCounts.rock === 0) {
      losingMoves.push('paper'); // Scissors beats paper
    }
    // Only one move type - randomly eliminate some players in that group
    else if (moveCounts.rock > 0 && moveCounts.paper === 0 && moveCounts.scissors === 0 && moveCounts.rock > 1) {
      losingMoves.push('rock');
    }
    else if (moveCounts.paper > 0 && moveCounts.rock === 0 && moveCounts.scissors === 0 && moveCounts.paper > 1) {
      losingMoves.push('paper');
    }
    else if (moveCounts.scissors > 0 && moveCounts.rock === 0 && moveCounts.paper === 0 && moveCounts.scissors > 1) {
      losingMoves.push('scissors');
    }
    
    // For two players - increase randomness by occasionally flipping the results (20% chance)
    if (activePlayers.length === 2 && losingMoves.length > 0 && Math.random() < 0.2) {
      // Flip the losing move
      const currentLosingMove = losingMoves[0];
      losingMoves.length = 0; // Clear the array
      
      if (currentLosingMove === 'rock') losingMoves.push('paper');
      else if (currentLosingMove === 'paper') losingMoves.push('scissors');
      else if (currentLosingMove === 'scissors') losingMoves.push('rock');
    }

    const updatedPlayers = [...playersWithMoves];
    
    // Mark players as eliminated if they have a losing move
    updatedPlayers.forEach((player) => {
      if (!player.isEliminated && player.move) {
        if (losingMoves.includes(player.move)) {
          player.result = 'lose';
        } else if (losingMoves.length > 0) {
          player.result = 'win';
        } else {
          player.result = 'draw';
        }
      }
    });
    
    setPlayerStates(updatedPlayers);
    setGameStatus('revealing');
    
    // After a delay, eliminate losers and prepare for next round
    setTimeout(() => {
      const finalUpdatedPlayers = [...updatedPlayers];
      let hasEliminations = false;
      
      // Special case for only one move type (all same move) - randomly eliminate one player
      const singleMoveCase = activePlayers.length > 1 && 
                            ((moveCounts.rock > 0 && moveCounts.paper === 0 && moveCounts.scissors === 0) ||
                             (moveCounts.paper > 0 && moveCounts.rock === 0 && moveCounts.scissors === 0) ||
                             (moveCounts.scissors > 0 && moveCounts.rock === 0 && moveCounts.paper === 0));
      
      if (singleMoveCase && losingMoves.length === 0) {
        // Choose a random player to eliminate
        const activePlayers = finalUpdatedPlayers.filter(p => !p.isEliminated);
        const randomIndex = Math.floor(Math.random() * activePlayers.length);
        
        finalUpdatedPlayers.forEach((player) => {
          if (!player.isEliminated) {
            const activeIndex = finalUpdatedPlayers.filter(p => !p.isEliminated).indexOf(player);
            if (activeIndex === randomIndex) {
              player.result = 'lose';
              player.isEliminated = true;
              hasEliminations = true;
            } else {
              player.result = 'win';
            }
          }
        });
      } else {
        // Normal elimination based on losing moves
        finalUpdatedPlayers.forEach((player) => {
          if (player.result === 'lose') {
            player.isEliminated = true;
            hasEliminations = true;
          }
        });
      }
      
      if (hasEliminations) {
        playSound('lose');
      }
      
      const remainingPlayers = finalUpdatedPlayers.filter((p) => !p.isEliminated);
      
      if (remainingPlayers.length === 1) {
        setWinner(remainingPlayers[0].name);
        playSound('win');
        setGameStatus('complete');
      } else if (remainingPlayers.length === 0) {
        // In case of a tie with all players eliminated
        setGameStatus('complete');
      } else {
        setPlayerStates(finalUpdatedPlayers);
        setRound((prev) => prev + 1);
        setGameStatus('preparing');
      }
    }, 2500);
  };

  const startNextRound = () => {
    assignRandomMoves();
  };

  if (gameStatus === 'complete') {
    return <WinnerScreen winner={winner} onPlayAgain={onResetGame} />;
  }

  return (
    <div className="game-container bg-white rounded-xl p-6 shadow-xl border-2 border-gray-200 transition-all animate-fadeIn">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">الجولة {round}</h2>
            <div className="flex mr-3">
              {[...Array(Math.min(round, 3))].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
              ))}
            </div>
          </div>
          <button
            onClick={onResetGame}
            className="flex items-center gap-1 text-red-700 hover:text-red-900"
          >
            <RotateCcw size={16} />
            إعادة اللعب
          </button>
        </div>

        <div className="player-grid mb-6">
          {playerStates.map((player, index) => (
            <PlayerCard key={index} player={player} revealMove={gameStatus === 'revealing'} />
          ))}
        </div>
      </div>

      <div className="game-footer">
        {gameStatus === 'preparing' && (
          <div className="text-center bg-gray-50 p-4 rounded-lg">
            <button
              onClick={startNextRound}
              className="btn-red flex items-center gap-2 mx-auto"
            >
              <Hand size={20} />
              {round === 1 ? 'ابدأ الجولة الأولى' : 'الجولة التالية'}
            </button>
            <p className="mt-4 text-gray-600 font-medium">
              متبقي {playerStates.filter(p => !p.isEliminated).length} لاعبين
            </p>
          </div>
        )}

        {gameStatus === 'revealing' && (
          <div className="text-center p-5 border-t-2 border-red-200">
            <p className="text-xl font-bold text-red-700 animate-pulse">جاري إقصاء الخاسرين...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
