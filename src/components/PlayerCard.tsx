import { Hand } from 'lucide-react';

type Move = 'rock' | 'paper' | 'scissors';
type PlayerState = {
  name: string;
  move: Move | null;
  isEliminated: boolean;
  result?: 'win' | 'lose' | 'draw';
};

interface PlayerCardProps {
  player: PlayerState;
  revealMove: boolean;
}

const PlayerCard = ({ player, revealMove }: PlayerCardProps) => {
  const getMoveIcon = () => {
    if (!player.move || !revealMove) {
      return '?';
    }
    
    switch (player.move) {
      case 'rock':
        return '✊';
      case 'paper':
        return '✋';
      case 'scissors':
        return '✌️';
      default:
        return '?';
    }
  };

  const getResultClass = () => {
    if (!revealMove) return '';
    
    switch (player.result) {
      case 'win':
        return 'border-4 border-green-500 scale-105';
      case 'lose':
        return 'border-4 border-red-700 opacity-70';
      case 'draw':
        return 'border-4 border-yellow-500';
      default:
        return '';
    }
  };

  const getMoveName = () => {
    if (!player.move) return 'انتظار...';
    if (player.isEliminated) return '—';
    
    if (!revealMove) return 'انتظار...';
    
    switch (player.move) {
      case 'rock':
        return 'حجرة';
      case 'paper':
        return 'ورقة';
      case 'scissors':
        return 'مقص';
      default:
        return 'انتظار...';
    }
  };

  return (
    <div
      className={`
        card pixel-border player-card 
        transition-all duration-300
        ${player.isEliminated ? 'opacity-40 grayscale' : 'hover:bg-gray-50'} 
        ${getResultClass()}
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-red-200 h-10 w-10 rounded-full flex items-center justify-center font-bold text-red-800 border-2 border-red-300">
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold">{player.name}</h3>
          <p className="text-xs text-gray-600">
            {player.isEliminated ? 'خرج من اللعبة' : 'يلعب'}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-2 flex justify-between items-center">
        <div className="bg-gray-100 px-3 py-2 rounded-md flex items-center gap-2 text-sm border border-gray-200">
          <Hand size={16} className="text-red-700" />
          <span className="font-medium">{getMoveName()}</span>
        </div>
        
        <div className="text-3xl">
          {!player.isEliminated && getMoveIcon()}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
