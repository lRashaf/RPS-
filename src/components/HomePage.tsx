import { useState, useRef } from 'react';
import { Check, CirclePlus, Squircle, Sword, Users, X } from 'lucide-react';

interface HomePageProps {
  onStartGame: (players: string[]) => void;
}

const HomePage = ({ onStartGame }: HomePageProps) => {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [error, setError] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

 

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayerNames([...playerNames.filter(name => name.trim() !== ''), newPlayerName]);
      setNewPlayerName('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      // Add empty slot if there are none
      if (!playerNames.some(name => name.trim() === '')) {
        setPlayerNames([...playerNames, '']);
      }
    }
    setError('');
  };

  const removePlayer = (index: number) => {
    if (playerNames.length <= 2) {
      setError('يجب أن يكون هناك لاعبين على الأقل!');
      return;
    }
    
    const newPlayerNames = [...playerNames];
    newPlayerNames.splice(index, 1);
    setPlayerNames(newPlayerNames);
    setError('');
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(playerNames[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const newNames = [...playerNames];
      newNames[editingIndex] = editValue;
      setPlayerNames(newNames);
      setEditingIndex(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty names
    const trimmedNames = playerNames.filter(name => name.trim() !== '');
    
    if (trimmedNames.length < 2) {
      setError('يجب إدخال اسمين على الأقل!');
      return;
    }
    
    if (new Set(trimmedNames).size !== trimmedNames.length) {
      setError('يجب أن تكون جميع أسماء اللاعبين فريدة!');
      return;
    }
    
    onStartGame(trimmedNames);
  };

  return (
    <div className="page-container bg-white rounded-xl p-6 md:p-8 shadow-xl border-2 border-gray-200 transition-all animate-fadeIn">
      <div>
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black">حجرة ورقة مقص</h1>
          <h2 className="text-xl md:text-2xl font-medium mb-3 text-gray-800">التحدي الجماعي</h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">
            خلّك آخر لاعب يبقى، واحسمها بالحظ والضحك!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-200 rounded-lg">
                <Users size={24} className="text-red-700" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="اسم اللاعب"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={addPlayer}
                className="bg-red-700 hover:bg-red-800 text-white p-2 rounded-lg transition-colors"
              >
                <CirclePlus size={24} />
              </button>
            </div>
            
            <div className="space-y-3 mb-6 min-h-[200px] max-h-[300px] overflow-y-auto">
              {playerNames.filter(name => name.trim() !== '').map((name, index) => (
                <div key={index} className="flex items-center gap-2 card py-2 px-3">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="input-field flex-1"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="p-2 text-green-600 hover:text-green-800"
                      >
                        <Check size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center font-bold text-gray-700">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <span className="flex-1 font-medium">{name}</span>
                      <button
                        type="button"
                        onClick={() => startEditing(index)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <Squircle size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePlayer(index)}
                        className="p-2 text-red-700 hover:text-red-800"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {error && <p className="text-red-700 mb-4 text-center font-bold animate-shake">{error}</p>}

          <button
            type="submit"
            className="btn-red w-full text-xl flex items-center justify-center gap-2"
          >
            <Sword size={20} />
            ابدأ التحدي!
          </button>
        </form>
      </div>

      <div className="mt-6 text-sm text-gray-600 border-t-2 border-gray-100 pt-4">
        <h3 className="font-bold mb-2 text-gray-800">كيفية اللعب:</h3>
        <ol className="list-decimal pr-5 space-y-1 text-right">
          <li>أدخل أسماء جميع المشاركين.</li>
          <li>اضغط "ابدأ التحدي".</li>
          <li>سيتم تعيين حجرة، ورقة أو مقص عشوائياً لكل لاعب.</li>
          <li>سيتم إقصاء الخاسرين بعد كل جولة.</li>
          <li>تستمر اللعبة حتى يتبقى فائز واحد!</li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage;
