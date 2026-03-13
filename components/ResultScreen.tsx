'use client';

import { useEffect, useState } from 'react';
import { useGame } from './GameContext';
import { calculateRecipe, generateName, generateDescription } from '../lib/recipeUtils';
import scents from '../data/scents';

export default function ResultScreen() {
  const { sentence, counts, reset } = useGame();
  const [recipe, setRecipe] = useState<{ key: string; percent: number }[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const r = calculateRecipe(counts);
    setRecipe(r);
    setName(generateName(sentence, r));
    setDescription(generateDescription(sentence, r));
  }, [counts, sentence]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('링크가 복사되었습니다!');
  };

  const handleRestart = () => {
    reset();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4 text-purple-800">{name}</h2>
        {/* Perfume bottle image placeholder */}
        <div className="w-32 h-48 mx-auto bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg mb-6 flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl">🧴</span>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">레시피</h3>
          <div className="space-y-1">
            {recipe.map(r => (
              <div key={r.key} className="flex justify-between">
                <span>{scents.find(s => s.key === r.key)?.name}:</span>
                <span>{r.percent}%</span>
              </div>
            ))}
          </div>
        </div>
        <p className="italic text-gray-700 mb-6">{description}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow"
            onClick={handleCopyLink}
          >
            링크 복사
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow"
            onClick={() => window.open('https://example.com/buy', '_blank')}
          >
            구매하기
          </button>
        </div>
        <button
          className="mt-4 text-sm text-blue-600 underline"
          onClick={handleRestart}
        >
          다시 만들기
        </button>
      </div>
    </div>
  );
}
