'use client';

import Image from 'next/image';
import { Scent } from '../data/scents';
import { useGame } from './GameContext';

interface Props {
  scent: Scent;
  onClick: () => void;
  disabled?: boolean;
}

export default function ScentButton({ scent, onClick, disabled }: Props) {
  const { counts } = useGame();
  const count = counts[scent.key] || 0;
  const isSelected = count > 0;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center justify-center p-4 rounded-lg shadow-lg transition-all duration-300 ${
        scent.color
      } hover:scale-105 ${isSelected ? 'ring-4 ring-yellow-400 shadow-yellow-400/50' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="w-12 h-12 mb-2 relative">
        <Image
          src={scent.icon}
          alt={scent.name}
          fill
          className="object-contain"
          onError={(e) => {
            // fallback to text if image fails
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200 rounded">${scent.name[0]}</div>`;
            }
          }}
        />
      </div>
      <span className="text-sm font-semibold text-center">{scent.name}</span>
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
