import { RotateCcw, Trophy } from 'lucide-react';
import confetti from './confetti';
import { useEffect } from 'react';

interface WinnerScreenProps {
  winner: string | null;
  onPlayAgain: () => void;
}

const WinnerScreen = ({ winner, onPlayAgain }: WinnerScreenProps) => {
  useEffect(() => {
    // Create a canvas element for the confetti
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '100';
    document.body.appendChild(canvas);

    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });

    // Play victory sound
    const audio = new Audio('https://freesound.org/data/previews/417/417756_5121236-lq.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio error:', e));

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

  return (
    <div className="page-container bg-white rounded-xl p-6 md:p-10 shadow-xl text-center transition-all animate-fadeIn border-2 border-gray-200">
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="bg-yellow-500/20 p-5 rounded-full mb-4 border-4 border-yellow-500 pixel-border animate-pulse-custom">
          <Trophy size={80} className="text-yellow-500" />
        </div>
        
        {winner ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
              {winner} فاز!
            </h1>
            <p className="text-gray-600 font-medium">
              بطل لعبة حجرة ورقة مقص !
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
              تعادل!
            </h1>
            <p className="text-gray-600 font-medium">
              لا أحد فاز هذه المرة. حاول مرة أخرى!
            </p>
          </>
        )}
      </div>
      
      <div className="mt-6 border-t-2 border-gray-100 pt-6">
        <div className="flex justify-center items-center mb-4">
          <div className="flex px-4 py-2 bg-red-200 rounded-lg mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-red-700 rounded-full mx-1"></div>
            ))}
          </div>
        </div>
        
        <button
          onClick={onPlayAgain}
          className="btn-red flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={20} />
          العب مرة أخرى
        </button>
      </div>
    </div>
  );
};

export default WinnerScreen;
