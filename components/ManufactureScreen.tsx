'use client';

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
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center relative"
      style={{ backgroundImage: "url('/images/background/main_background.png')" }}
    >
      {/* Fallback background if image fails */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-50" />

      {/* Sentence above cauldron */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h2 className="text-xl font-semibold bg-white bg-opacity-80 px-4 py-2 rounded-lg shadow">
          {sentence}
        </h2>
        <button
          className="mt-2 text-sm text-blue-600 underline bg-white bg-opacity-80 px-2 py-1 rounded"
          onClick={pickRandomSentence}
        >
          다른 문장
        </button>
      </div>

      {/* Cauldron in center */}
      <div className="flex items-center justify-center flex-1">
        <div className="w-48 h-48 rounded-full bg-purple-800 border-8 border-purple-600 flex items-center justify-center shadow-2xl">
          <span className="text-white text-2xl font-bold">{clicks}/10</span>
        </div>
      </div>

      {/* Progress below cauldron */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center z-10">
        <div className="bg-white bg-opacity-80 px-4 py-2 rounded-lg shadow">
          향을 선택하세요 ({clicks}/10)
        </div>
      </div>

      {/* Scent buttons on sides */}
      <div className="absolute inset-0 flex justify-between items-center px-8 pointer-events-none">
        <div className="grid grid-cols-1 gap-4 pointer-events-auto">
          {scents.slice(0, 5).map(s => (
            <ScentButton
              key={s.key}
              scent={s}
              onClick={() => handleChoose(s.key)}
              disabled={clicks >= 10}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 pointer-events-auto">
          {scents.slice(5).map(s => (
            <ScentButton
              key={s.key}
              scent={s}
              onClick={() => handleChoose(s.key)}
              disabled={clicks >= 10}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
