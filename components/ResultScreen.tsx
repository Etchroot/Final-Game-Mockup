'use client';

import { useEffect, useState } from 'react';
import { useGame } from './GameContext';
import {
  calculateRecipe,
  generateDescription,
  generateName
} from '../lib/recipeUtils';
import scents from '../data/scents';

export default function ResultScreen() {
  const { sentence, counts, reset } = useGame();
  const [recipe, setRecipe] = useState<{ key: string; percent: number }[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const nextRecipe = calculateRecipe(counts);
    setRecipe(nextRecipe);
    setName(generateName(sentence, nextRecipe));
    setDescription(generateDescription(sentence, nextRecipe));
  }, [counts, sentence]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('결과 페이지 링크를 복사했어요.');
  };

  const handleRestart = () => {
    reset();
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fff0d0] via-[#fbe7fb] to-[#d8e9ff] p-8">
      <div className="w-full max-w-md rounded-[2rem] bg-white/92 p-8 text-center shadow-2xl backdrop-blur-sm">
        <h2 className="mb-4 text-3xl font-black text-[#6f3c8f]">{name}</h2>

        <div className="mx-auto mb-6 flex h-48 w-32 items-center justify-center rounded-[1.75rem] bg-gradient-to-b from-[#c688ff] to-[#7b4dd0] shadow-lg">
          <span className="text-4xl text-white">향수</span>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-lg font-bold text-[#5b355d]">배합 비율</h3>
          <div className="space-y-1.5">
            {recipe.map((entry) => (
              <div
                key={entry.key}
                className="flex justify-between rounded-full bg-[#f8f1ff] px-4 py-2 text-sm text-[#4f3758]"
              >
                <span>{scents.find((scent) => scent.key === entry.key)?.name}</span>
                <span>{entry.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mb-6 italic leading-relaxed text-[#6a5a73]">{description}</p>

        <div className="flex justify-center gap-4">
          <button
            className="rounded-full bg-[#5e8df8] px-6 py-3 text-white shadow transition hover:bg-[#4a7be8]"
            onClick={handleCopyLink}
          >
            결과 링크 복사
          </button>
          <button
            className="rounded-full bg-[#5ebf8b] px-6 py-3 text-white shadow transition hover:bg-[#49a979]"
            onClick={() => window.open('https://example.com/buy', '_blank')}
          >
            구매 페이지
          </button>
        </div>

        <button
          className="mt-4 text-sm font-bold text-[#5a63d8] underline"
          onClick={handleRestart}
        >
          다시 제조하기
        </button>
      </div>
    </div>
  );
}
