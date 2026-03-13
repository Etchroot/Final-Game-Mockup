'use client';

import Image from 'next/image';
import { Scent } from '../data/scents';
import { useGame } from './GameContext';

interface Props {
  scent: Scent;
  onClick: () => void;
  onHover?: () => void;
  disabled?: boolean;
  side?: 'left' | 'right';
}

export default function ScentButton({
  scent,
  onClick,
  onHover,
  disabled,
  side = 'left'
}: Props) {
  const { counts } = useGame();
  const count = counts[scent.key] || 0;
  const isSelected = count > 0;
  const isRight = side === 'right';

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onFocus={onHover}
      disabled={disabled}
      aria-pressed={isSelected}
      className={[
        'group relative flex h-[4.2rem] w-full min-w-0 flex-col justify-between overflow-hidden rounded-[1.45rem] border-[3px] px-2 py-2 text-left transition-all duration-300',
        'sm:h-[5.15rem] sm:px-2.5 sm:py-2.5',
        'md:h-[6.15rem] md:rounded-[1.7rem] md:px-3 md:py-3',
        'lg:h-[7.25rem] lg:rounded-[2rem] lg:px-4 lg:py-3.5',
        isRight ? 'items-end text-right' : 'items-start text-left',
        isSelected
          ? 'scale-[1.03] border-[#ffe39d]'
          : 'border-[#f7d3a0]/70 hover:border-[#ffe39d]',
        disabled
          ? 'cursor-not-allowed grayscale-[0.18] opacity-70'
          : 'hover:-translate-y-1 hover:scale-[1.04] active:translate-y-[1px] active:scale-[0.98]'
      ].join(' ')}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,250,240,0.96) 0%, rgba(246,222,189,0.92) 100%)',
        boxShadow: isSelected
          ? `0 0 0 2px ${scent.accent}, 0 0 28px ${scent.accent}66, 0 18px 30px rgba(30, 15, 22, 0.35)`
          : '0 14px 26px rgba(30, 15, 22, 0.28)'
      }}
    >
      <span
        className="pointer-events-none absolute inset-[2px] rounded-[1.3rem] opacity-90 md:rounded-[1.55rem] lg:rounded-[1.8rem]"
        style={{
          background: isRight
            ? `linear-gradient(230deg, ${scent.accent}35 0%, rgba(255,255,255,0) 55%)`
            : `linear-gradient(130deg, ${scent.accent}35 0%, rgba(255,255,255,0) 55%)`
        }}
      />

      <span
        className={[
          'relative z-10 flex h-[2.2rem] w-[2.2rem] items-center justify-center rounded-[1rem] border border-white/80 shadow-[inset_0_2px_10px_rgba(255,255,255,0.35)]',
          'sm:h-[2.85rem] sm:w-[2.85rem]',
          'md:h-[3.45rem] md:w-[3.45rem] md:rounded-[1.2rem]',
          'lg:h-[4.1rem] lg:w-[4.1rem] lg:rounded-[1.45rem]',
          isRight ? 'self-end' : 'self-start'
        ].join(' ')}
        style={{
          background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98) 0%, ${scent.accent} 76%)`,
          boxShadow: isSelected
            ? `0 0 18px ${scent.accent}aa`
            : `0 10px 18px ${scent.accent}45`
        }}
      >
        <div className="relative h-[1.6rem] w-[1.6rem] sm:h-[2.05rem] sm:w-[2.05rem] md:h-[2.55rem] md:w-[2.55rem] lg:h-[3.1rem] lg:w-[3.1rem]">
          <Image
            src={scent.icon}
            alt={scent.name}
            fill
            sizes="(max-width: 768px) 64px, 96px"
            className={[
              'object-contain drop-shadow-[0_6px_12px_rgba(48,27,18,0.24)] transition-transform duration-300',
              isSelected ? 'scale-110' : 'scale-100 group-hover:scale-105'
            ].join(' ')}
          />
        </div>
      </span>

      <span className="relative z-10 mt-auto w-full rounded-[1rem] border border-[#f7d7a7]/80 bg-[#fff5e4]/75 px-1.5 py-1 shadow-[inset_0_1px_4px_rgba(255,255,255,0.45)] sm:px-2 md:rounded-[1.15rem] lg:px-2.5">
        <span className="block text-[0.42rem] uppercase tracking-[0.24em] text-[#8f6549] sm:text-[0.48rem] md:text-[0.54rem]">
          essence
        </span>
        <span className="block text-[0.6rem] font-bold text-[#4d2a21] sm:text-[0.72rem] md:text-[0.84rem] lg:text-[0.95rem]">
          {scent.name}
        </span>
        <span className="hidden text-[0.5rem] text-[#7a5642] md:block lg:text-[0.66rem]">
          {scent.note}
        </span>
      </span>

      {count > 0 && (
        <span
          className={[
            'absolute top-1.5 z-20 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border border-white/80 px-1 text-[0.65rem] font-bold text-white shadow-lg',
            'sm:h-5.5 sm:min-w-[1.35rem]',
            isRight ? 'left-1.5' : 'right-1.5'
          ].join(' ')}
          style={{
            background: `linear-gradient(180deg, ${scent.accent} 0%, #5b3048 100%)`,
            boxShadow: `0 0 16px ${scent.accent}88`
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
