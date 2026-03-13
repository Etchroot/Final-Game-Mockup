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
    <div className="p-4 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      {/* placeholder for bottle image */}
      <div className="w-32 h-40 mx-auto bg-purple-200 rounded-lg mb-4" />
      <div className="mb-2">
        <strong>레시피 비율</strong>
        <ul className="list-disc list-inside text-left">
          {recipe.map(r => (
            <li key={r.key}>
              {scents.find(s => s.key === r.key)?.name}: {r.percent}%
            </li>
          ))}
        </ul>
      </div>
      <p className="italic mb-4">{description}</p>
      {/* TODO: 결과 카드 이미지 저장 기능 구현 */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleCopyLink}
        >
          링크 복사
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => window.open('https://example.com/buy', '_blank')}
        >
          구매하기
        </button>
      </div>
      <button
        className="text-sm text-blue-600 underline"
        onClick={handleRestart}
      >
        다시 만들기
      </button>
    </div>
  );
}
