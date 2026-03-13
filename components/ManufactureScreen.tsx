import { useState, useEffect } from 'react';
import sentences from '../data/sentences';
import scents from '../data/scents';
import ScentButton from './ScentButton';
import { useRouter } from 'next/navigation';
import { useGame } from './GameContext';

export default function ManufactureScreen() {
  const { sentence, setSentence, addSelection } = useGame();
  const [clicks, setClicks] = useState(0);
  const router = useRouter();

  useEffect(() => {
    pickRandomSentence();
  }, []);

  const pickRandomSentence = () => {
    const idx = Math.floor(Math.random() * sentences.length);
    setSentence(sentences[idx]);
  };

  const handleChoose = (key: string) => {
    if (clicks >= 10) return;
    addSelection(key);
    setClicks(prev => prev + 1);
  };

  useEffect(() => {
    if (clicks === 10) {
      // move to result with state via query or router.push
      router.push('/result');
    }
  }, [clicks, router]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{sentence}</h2>
        <button
          className="text-sm text-blue-600 underline"
          onClick={pickRandomSentence}
        >
          다른 문장
        </button>
      </div>
      <div className="flex justify-center mb-4">
        {/* placeholder for cauldron */}
          {/* TODO: 클릭할 때마다 색 혼합 애니메이션 추가 */}
        <div className="w-40 h-40 rounded-full bg-purple-200 flex items-center justify-center">
          {clicks}/10
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {scents.map(s => (
          <ScentButton
            key={s.key}
            scent={s}
            onClick={() => handleChoose(s.key)}
            disabled={clicks >= 10}
          />
        ))}
      </div>
    </div>
  );
}
