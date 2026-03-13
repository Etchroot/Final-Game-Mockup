'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import sentences from '../data/sentences';
import scents, { Scent } from '../data/scents';
import ScentButton from './ScentButton';
import { useGame } from './GameContext';

const MAX_SELECTIONS = 10;
const leftColumnKeys = ['orange', 'sandalwood', 'musk', 'cotton', 'petrichor'];
const rightColumnKeys = ['lemon', 'lavender', 'rose', 'vanilla', 'pine'];
const scentLookup = new Map(scents.map((scent) => [scent.key, scent]));

const bubbleSpecs = [
  { left: '24%', top: '17%', size: '0.85rem', color: '#ffd07d', delay: '0s', duration: '4.8s' },
  { left: '34%', top: '20%', size: '0.75rem', color: '#fd9cf4', delay: '0.9s', duration: '5.4s' },
  { left: '49%', top: '16%', size: '1rem', color: '#b2ff9f', delay: '0.4s', duration: '4.5s' },
  { left: '61%', top: '19%', size: '0.9rem', color: '#a4fff7', delay: '1.2s', duration: '5.1s' },
  { left: '71%', top: '17%', size: '0.8rem', color: '#f5a4ff', delay: '1.8s', duration: '4.9s' }
];

const steamSpecs = [
  { left: '29%', bottom: '63%', width: '1.35rem', height: '5.9rem', delay: '0s', duration: '4.4s' },
  { left: '44%', bottom: '66%', width: '1.55rem', height: '6.8rem', delay: '0.8s', duration: '4.9s' },
  { left: '58%', bottom: '64%', width: '1.45rem', height: '6.1rem', delay: '1.3s', duration: '4.6s' }
];

const sparkSpecs = [
  { left: '16%', top: '24%', color: '#f8d37f', delay: '0s' },
  { left: '21%', top: '34%', color: '#8af8ff', delay: '0.7s' },
  { left: '33%', top: '12%', color: '#f4a7ff', delay: '1.1s' },
  { left: '65%', top: '14%', color: '#f4a7ff', delay: '0.3s' },
  { left: '77%', top: '31%', color: '#9cfca7', delay: '1.5s' },
  { left: '82%', top: '21%', color: '#f8d37f', delay: '0.9s' }
];

const flameSpecs = [
  { left: '14%', width: '15%', height: '20%', color: '#ffb850', delay: '0s' },
  { left: '26%', width: '18%', height: '25%', color: '#ffd36e', delay: '0.4s' },
  { left: '41%', width: '18%', height: '30%', color: '#ff964f', delay: '0.9s' },
  { left: '56%', width: '17%', height: '26%', color: '#ffd36e', delay: '0.3s' },
  { left: '69%', width: '14%', height: '22%', color: '#ffb850', delay: '1.1s' }
];

const leftScents = leftColumnKeys
  .map((key) => scentLookup.get(key))
  .filter((scent): scent is Scent => Boolean(scent));

const rightScents = rightColumnKeys
  .map((key) => scentLookup.get(key))
  .filter((scent): scent is Scent => Boolean(scent));

function createAudio(src: string, volume: number) {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.volume = volume;
  return audio;
}

export default function ManufactureScreen() {
  const { sentence, setSentence, addSelection, counts } = useGame();
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const completeAudioRef = useRef<HTMLAudioElement | null>(null);
  const hoverCooldownRef = useRef(0);
  const completionTimerRef = useRef<number | null>(null);

  const totalSelections = Object.values(counts).reduce(
    (sum, current) => sum + current,
    0
  );

  const highlightedSelections = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
    .slice(0, 2)
    .map(([key, count]) => {
      const scent = scentLookup.get(key);
      return scent ? `${scent.name} x${count}` : null;
    })
    .filter((entry): entry is string => Boolean(entry));

  const pickRandomSentence = () => {
    const index = Math.floor(Math.random() * sentences.length);
    setSentence(sentences[index]);
  };

  useEffect(() => {
    if (!sentence) {
      pickRandomSentence();
    }
  }, [sentence, setSentence]);

  useEffect(() => {
    hoverAudioRef.current = createAudio('/sounds/glass-clink.mp3', 0.34);
    clickAudioRef.current = createAudio('/sounds/water-pouring.mp3', 0.45);
    completeAudioRef.current = createAudio('/sounds/magic-wand.mp3', 0.56);

    return () => {
      [hoverAudioRef.current, clickAudioRef.current, completeAudioRef.current].forEach(
        (audio) => {
          if (!audio) {
            return;
          }

          audio.pause();
          audio.currentTime = 0;
        }
      );

      if (completionTimerRef.current) {
        window.clearTimeout(completionTimerRef.current);
      }
    };
  }, []);

  const playSound = (audio: HTMLAudioElement | null, waitForEnd = false) =>
    new Promise<void>((resolve) => {
      if (!audio) {
        resolve();
        return;
      }

      const finish = () => {
        audio.removeEventListener('ended', finish);
        audio.removeEventListener('error', finish);
        resolve();
      };

      audio.pause();
      audio.currentTime = 0;

      if (waitForEnd) {
        audio.addEventListener('ended', finish, { once: true });
        audio.addEventListener('error', finish, { once: true });
        window.setTimeout(finish, Number.isFinite(audio.duration) ? Math.max(audio.duration * 1000 + 120, 1200) : 1800);
      }

      audio.play().then(() => {
        if (!waitForEnd) {
          resolve();
        }
      }).catch(() => {
        finish();
      });
    });

  const handleHoverSound = () => {
    const now = Date.now();

    if (now - hoverCooldownRef.current < 90) {
      return;
    }

    hoverCooldownRef.current = now;
    void playSound(hoverAudioRef.current);
  };

  const handleChoose = (key: string) => {
    if (totalSelections >= MAX_SELECTIONS || isCompleting) {
      return;
    }

    const nextTotal = totalSelections + 1;
    addSelection(key);
    void playSound(clickAudioRef.current);

    if (nextTotal === MAX_SELECTIONS) {
      setIsCompleting(true);

      completionTimerRef.current = window.setTimeout(async () => {
        await playSound(completeAudioRef.current, true);
        router.push('/result');
      }, 160);
    }
  };

  return (
    <div className="relative isolate min-h-screen w-full overflow-hidden bg-[#120b16] text-[#fff5de]">
      <Image
        src="/images/background/main_background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-center select-none"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,239,185,0.12),transparent_24%),linear-gradient(180deg,rgba(22,12,27,0.14)_0%,rgba(23,12,28,0.44)_54%,rgba(13,7,16,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(213,122,255,0.16),transparent_18%),radial-gradient(circle_at_50%_74%,rgba(255,180,94,0.22),transparent_16%)]" />
      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(14,8,18,0.9)]" />
      <div className="lantern-pulse absolute left-[9%] top-[17%] h-24 w-24 rounded-full bg-[#ffb45b]/20 blur-3xl" />
      <div className="lantern-pulse absolute right-[9%] top-[17%] h-24 w-24 rounded-full bg-[#82ecff]/16 blur-3xl" />

      {sparkSpecs.map((spark, index) => (
        <span
          key={`${spark.left}-${spark.top}-${index}`}
          className="lantern-pulse absolute h-2.5 w-2.5 rounded-full opacity-80 blur-[1px]"
          style={{
            left: spark.left,
            top: spark.top,
            backgroundColor: spark.color,
            animationDelay: spark.delay,
            boxShadow: `0 0 18px ${spark.color}`
          }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[112rem] flex-col px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
        <header className="game-container mx-auto flex w-full flex-col items-center gap-3">
          <div className="prompt w-full max-w-[min(92vw,44rem)] rounded-[1.5rem] border border-white/15 bg-[rgba(0,0,0,0.45)] px-5 py-4 text-center text-white shadow-[0_20px_45px_rgba(8,4,12,0.28)] backdrop-blur-[10px] sm:rounded-[1.75rem] sm:px-6 sm:py-4">
            <p className="mb-1 text-[0.58rem] font-bold uppercase tracking-[0.42em] text-[#ffe0ad] sm:text-[0.65rem]">
              spell prompt
            </p>
            <h2 className="text-[1rem] font-black leading-snug sm:text-[1.35rem] lg:text-[1.9rem]">
              {sentence || '오늘의 향을 불러오는 중...'}
            </h2>
          </div>

          <button
            type="button"
            onClick={pickRandomSentence}
            className="rounded-full border border-white/25 bg-[rgba(24,14,28,0.72)] px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.18em] text-[#ffe4b0] shadow-[0_10px_18px_rgba(18,8,18,0.32)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[rgba(43,28,47,0.8)] hover:text-white sm:text-[0.75rem]"
          >
            문장 다시 뽑기
          </button>
        </header>

        <main className="mx-auto flex w-full flex-1 flex-col justify-center gap-4 lg:gap-6">
          <section className="game-stage grid flex-1 grid-cols-[minmax(4.1rem,1fr)_minmax(10.75rem,15rem)_minmax(4.1rem,1fr)] items-center gap-2 sm:grid-cols-[minmax(5.6rem,1fr)_minmax(13rem,18rem)_minmax(5.6rem,1fr)] sm:gap-3 md:grid-cols-[minmax(7rem,1fr)_minmax(16rem,22rem)_minmax(7rem,1fr)] md:gap-4 lg:grid-cols-[minmax(8.5rem,14rem)_minmax(18rem,30rem)_minmax(8.5rem,14rem)] lg:gap-7">
            <aside className="scent-column-left flex flex-col items-end justify-center gap-2 sm:gap-3 lg:gap-4">
              {leftScents.map((scent) => (
                <div key={scent.key} className="w-full max-w-[clamp(4.3rem,18vw,13.5rem)]">
                  <ScentButton
                    scent={scent}
                    side="left"
                    onHover={handleHoverSound}
                    onClick={() => handleChoose(scent.key)}
                    disabled={isCompleting || totalSelections >= MAX_SELECTIONS}
                  />
                </div>
              ))}
            </aside>

            <div className="cauldron-column flex min-h-0 flex-col items-center justify-center gap-4 sm:gap-5 lg:gap-6">
              <div className="relative flex w-full max-w-[clamp(12rem,34vw,29rem)] items-end justify-center">
                <div className="pointer-events-none absolute inset-x-[10%] bottom-[9%] h-16 rounded-full bg-[#12090f]/75 blur-2xl sm:h-20 lg:h-28" />

                <div className="cauldron-float relative flex aspect-[4/5] w-full items-end justify-center">
                  {steamSpecs.map((steam, index) => (
                    <span
                      key={`${steam.left}-${index}`}
                      className="magic-steam absolute z-30 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(240,225,255,0.42),rgba(240,225,255,0))] blur-[1px]"
                      style={{
                        left: steam.left,
                        bottom: steam.bottom,
                        width: steam.width,
                        height: steam.height,
                        animationDelay: steam.delay,
                        animationDuration: steam.duration
                      }}
                    />
                  ))}

                  {bubbleSpecs.map((bubble, index) => (
                    <span
                      key={`${bubble.left}-${index}`}
                      className="magic-bubble absolute z-30 rounded-full border border-white/40"
                      style={{
                        left: bubble.left,
                        top: bubble.top,
                        width: bubble.size,
                        height: bubble.size,
                        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, ${bubble.color} 78%)`,
                        boxShadow: `0 0 16px ${bubble.color}`,
                        animationDelay: bubble.delay,
                        animationDuration: bubble.duration
                      }}
                    />
                  ))}

                  <div className="absolute inset-x-[15%] bottom-[5%] z-0 h-[16%] rounded-full bg-[#1a0d0d]/65 blur-xl" />

                  <div className="absolute inset-x-[17%] bottom-[7%] z-10 h-[20%]">
                    {flameSpecs.map((flame, index) => (
                      <span
                        key={`${flame.left}-${index}`}
                        className="ember-glow absolute bottom-0 rounded-[50%_50%_45%_45%/78%_78%_24%_24%]"
                        style={{
                          left: flame.left,
                          width: flame.width,
                          height: flame.height,
                          background: `radial-gradient(circle at 50% 30%, #fff6d9 0%, ${flame.color} 48%, rgba(255,138,58,0) 100%)`,
                          filter: 'drop-shadow(0 0 14px rgba(255, 168, 89, 0.78))',
                          animationDelay: flame.delay
                        }}
                      />
                    ))}
                  </div>

                  <div className="absolute left-1/2 top-[15%] z-20 h-[9%] w-[80%] -translate-x-1/2 rounded-full bg-[#6f2d6f]/30 blur-md" />

                  <div className="absolute right-[20%] top-[13%] z-20 h-[26%] w-[2.5%] rotate-[22deg] rounded-full bg-[linear-gradient(180deg,#8f6241_0%,#50311f_100%)] shadow-[0_4px_10px_rgba(0,0,0,0.25)]" />

                  <div className="absolute left-1/2 top-[15%] z-20 h-[12%] w-[84%] -translate-x-1/2 rounded-[999px] border-[5px] border-[#1f1119] bg-[linear-gradient(180deg,#5e4258_0%,#23131d_100%)] shadow-[0_18px_28px_rgba(0,0,0,0.45)] lg:border-[7px]" />
                  <div className="absolute left-1/2 top-[18%] z-20 h-[7%] w-[72%] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.72),rgba(255,255,255,0)_42%),linear-gradient(90deg,#7ff0d5_0%,#d57cff_42%,#a1ff94_100%)] shadow-[0_0_24px_rgba(211,130,255,0.62)]" />

                  <div className="absolute right-[17.5%] top-[21%] z-20 h-[9%] w-[6%] rounded-b-full bg-[linear-gradient(180deg,#d57cff_0%,#8e3f9c_100%)] shadow-[0_12px_16px_rgba(159,74,178,0.32)]" />
                  <div className="absolute right-[21%] top-[24%] z-20 h-[5%] w-[4.2%] rounded-b-full bg-[linear-gradient(180deg,#d57cff_0%,#8e3f9c_100%)] shadow-[0_8px_14px_rgba(159,74,178,0.28)]" />

                  <div className="absolute inset-x-[11%] top-[25%] bottom-[18%] z-10 rounded-[44%_44%_38%_38%/34%_34%_60%_60%] border-[6px] border-[#1b1016] bg-[linear-gradient(180deg,#7c7082_0%,#40303f_45%,#251720_100%)] shadow-[inset_0_10px_28px_rgba(255,255,255,0.08),0_28px_42px_rgba(0,0,0,0.5)] lg:border-[8px]" />
                  <div className="absolute inset-x-[20%] top-[31%] bottom-[24%] z-10 rounded-[50%] bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.18),rgba(255,255,255,0)_62%)] opacity-70" />

                  <div className="absolute left-[4%] top-[36%] z-0 h-[20%] w-[14%] rounded-full border-[6px] border-[#26151e] bg-transparent opacity-90 lg:border-[7px]" />
                  <div className="absolute right-[4%] top-[36%] z-0 h-[20%] w-[14%] rounded-full border-[6px] border-[#26151e] bg-transparent opacity-90 lg:border-[7px]" />

                  <div className="absolute bottom-[13%] left-[24%] z-0 h-[16%] w-[6%] rotate-[12deg] rounded-full bg-[linear-gradient(180deg,#3b2320_0%,#1a0e11_100%)]" />
                  <div className="absolute bottom-[12%] left-1/2 z-0 h-[18%] w-[6.5%] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#402824_0%,#1a0e11_100%)]" />
                  <div className="absolute bottom-[13%] right-[24%] z-0 h-[16%] w-[6%] -rotate-[12deg] rounded-full bg-[linear-gradient(180deg,#3b2320_0%,#1a0e11_100%)]" />

                  {[
                    'left-[19%] top-[47%]',
                    'left-1/2 top-[55%] -translate-x-1/2',
                    'right-[19%] top-[47%]'
                  ].map((position, index) => (
                    <div
                      key={position}
                      className={`absolute z-20 h-[15%] w-[18%] rounded-full border-[4px] border-[#24131b] bg-[linear-gradient(180deg,#52404d_0%,#2a1822_100%)] shadow-[inset_0_4px_12px_rgba(255,255,255,0.06)] ${position}`}
                    >
                      <span className="absolute left-[27%] top-[34%] h-[11%] w-[11%] rounded-full bg-[#a8d2ce]" />
                      <span className="absolute right-[27%] top-[34%] h-[11%] w-[11%] rounded-full bg-[#a8d2ce]" />
                      <span className="absolute left-1/2 top-[54%] h-[12%] w-[18%] -translate-x-1/2 rounded-full bg-[#a8d2ce]/85" />
                      {index === 1 && (
                        <span className="absolute left-1/2 top-[22%] h-[14%] w-[14%] -translate-x-1/2 rounded-full bg-[#b9e5e0]/40 blur-[1px]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="progress w-full max-w-[min(92vw,23rem)] rounded-[1.55rem] border border-[#f2ca84] bg-[rgba(20,10,23,0.72)] px-4 py-4 shadow-[0_18px_34px_rgba(12,5,15,0.32)] backdrop-blur-md sm:px-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.34em] text-[#f3d18a] sm:text-[0.62rem]">
                      brew status
                    </p>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="text-[1.7rem] font-black leading-none sm:text-[2rem] lg:text-[2.3rem]">
                        {totalSelections}
                      </span>
                      <span className="pb-1 text-[0.82rem] text-[#f8e4bf] sm:text-[0.92rem] lg:text-[1rem]">
                        / {MAX_SELECTIONS}
                      </span>
                    </div>
                  </div>
                  {isCompleting && (
                    <div className="rounded-full bg-[#f0b259]/20 px-3 py-1 text-[0.66rem] font-bold text-[#ffe0a8]">
                      완성 중...
                    </div>
                  )}
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="brew-progress h-full rounded-full bg-[linear-gradient(90deg,#ffe195_0%,#ff9d5c_55%,#c66cff_100%)] shadow-[0_0_18px_rgba(255,199,126,0.6)] transition-all duration-300"
                    style={{ width: `${Math.min(totalSelections, MAX_SELECTIONS) * 10}%` }}
                  />
                </div>

                <p className="mt-3 text-[0.68rem] leading-relaxed text-[#f7dfbf] sm:text-[0.74rem]">
                  {highlightedSelections.length > 0
                    ? `주요 향료: ${highlightedSelections.join(' · ')}`
                    : '왼쪽과 오른쪽 재료를 골라 가마솥에 향을 채워 보세요.'}
                </p>
              </div>
            </div>

            <aside className="scent-column-right flex flex-col items-start justify-center gap-2 sm:gap-3 lg:gap-4">
              {rightScents.map((scent) => (
                <div key={scent.key} className="w-full max-w-[clamp(4.3rem,18vw,13.5rem)]">
                  <ScentButton
                    scent={scent}
                    side="right"
                    onHover={handleHoverSound}
                    onClick={() => handleChoose(scent.key)}
                    disabled={isCompleting || totalSelections >= MAX_SELECTIONS}
                  />
                </div>
              ))}
            </aside>
          </section>

          <div className="mx-auto flex w-full justify-center">
            <div className="rounded-full border border-white/18 bg-[rgba(28,18,33,0.72)] px-4 py-2 text-center text-[0.68rem] text-[#f6e7cf] shadow-[0_10px_18px_rgba(10,4,12,0.2)] backdrop-blur-md sm:text-[0.78rem]">
              향 버튼에 마우스를 올리면 유리 소리, 선택하면 물방울 소리, 완성 시 마법 소리가 재생됩니다.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
