'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useGame } from './GameContext';
import {
  calculateRecipe,
  generateDescription,
  generateName,
  RecipeNote
} from '../lib/recipeUtils';
import scents from '../data/scents';

export default function ResultScreen() {
  const { sentence, counts, reset } = useGame();
  const [recipe, setRecipe] = useState<RecipeNote[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const nextRecipe = calculateRecipe(counts);
    const fallback = generateDescription(sentence, nextRecipe);

    setRecipe(nextRecipe);
    setName(generateName(sentence, nextRecipe));
    setDescription(fallback);

    if (!sentence || nextRecipe.length === 0) {
      return;
    }

    let cancelled = false;

    const fetchDescription = async () => {
      setIsGenerating(true);

      try {
        const response = await fetch('/api/perfume-copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sentence,
            recipe: nextRecipe
          })
        });

        if (!response.ok) {
          throw new Error('copy generation failed');
        }

        const data = (await response.json()) as { description?: string };

        if (!cancelled && data.description) {
          setDescription(data.description);
        }
      } catch {
        if (!cancelled) {
          setDescription(fallback);
        }
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    };

    void fetchDescription();

    return () => {
      cancelled = true;
    };
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
    <div className="relative min-h-screen overflow-hidden bg-[#120b16] text-[#fff5de]">
      <Image
        src="/images/background/main_background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,8,20,0.38)_0%,rgba(16,8,20,0.84)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(214,152,255,0.18),transparent_20%),radial-gradient(circle_at_50%_70%,rgba(255,201,122,0.16),transparent_18%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="grid w-full max-w-5xl gap-6 rounded-[2rem] border border-[#f0d4a2]/45 bg-[rgba(20,11,26,0.68)] p-5 shadow-[0_28px_70px_rgba(5,3,8,0.42)] backdrop-blur-md md:grid-cols-[minmax(18rem,23rem)_1fr] md:p-8">
          <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-[rgba(255,255,255,0.04)] px-5 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="mb-5 rounded-full border border-[#ffe7b9]/30 bg-[rgba(255,233,190,0.08)] px-4 py-1 text-[0.72rem] font-bold tracking-[0.22em] text-[#ffe4b0]">
              FINAL PERFUME
            </div>

            <div className="relative flex h-[20rem] w-full max-w-[14rem] items-center justify-center">
              <div className="absolute inset-x-[15%] bottom-[8%] h-12 rounded-full bg-[#bb76ff]/35 blur-2xl" />
              {!imageFailed ? (
                <img
                  src="/images/ui/perfume-bottle.png"
                  alt="향수 병"
                  className="relative z-10 h-full w-auto object-contain drop-shadow-[0_0_26px_rgba(200,146,255,0.45)]"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="relative z-10 flex h-full w-full items-center justify-center">
                  <div className="h-[15rem] w-[9rem] rounded-[2rem] border-[5px] border-[#f9e3c1] bg-[linear-gradient(180deg,rgba(255,247,255,0.95)_0%,rgba(188,127,250,0.86)_100%)] shadow-[0_0_25px_rgba(200,146,255,0.55)]" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.4em] text-[#f3d18a]">
              perfume result
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-[#fff2da] sm:text-4xl">
              {name}
            </h2>
            <p className="mt-2 text-sm text-[#f7dfbf]">{sentence}</p>

            <div className="mt-5 rounded-[1.5rem] border border-white/12 bg-[rgba(0,0,0,0.28)] p-5 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-[#ffe5bc]">향수 설명</h3>
                {isGenerating && (
                  <span className="rounded-full bg-[#f0b259]/20 px-3 py-1 text-[0.7rem] font-bold text-[#ffe0a8]">
                    생성 중...
                  </span>
                )}
              </div>

              <p className="whitespace-pre-line text-[1rem] leading-relaxed text-[#fff5de]">
                {description}
              </p>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-white/12 bg-[rgba(255,255,255,0.05)] p-5">
              <h3 className="mb-3 text-lg font-bold text-[#ffe5bc]">레시피</h3>
              <div className="space-y-2">
                {recipe.map((entry) => (
                  <div
                    key={entry.key}
                    className="flex items-center justify-between rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[#f9ecd7]"
                  >
                    <span>{scents.find((scent) => scent.key === entry.key)?.name}</span>
                    <span>{entry.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-full border border-[#ffe2a0] bg-[linear-gradient(180deg,#ffdc8b_0%,#f2a24c_100%)] px-6 py-3 text-sm font-black tracking-[0.18em] text-[#4a291b] shadow-[0_16px_26px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5"
                onClick={handleCopyLink}
              >
                링크 복사
              </button>
              <button
                className="rounded-full border border-white/20 bg-[rgba(35,20,39,0.78)] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[#fff0d3] shadow-[0_16px_26px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:bg-[rgba(49,29,56,0.84)]"
                onClick={handleRestart}
              >
                다시 제조하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
