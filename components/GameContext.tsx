'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface RecipeEntry {
  key: string;
  count: number;
}

interface GameState {
  sentence: string;
  counts: Record<string, number>;
  reset: () => void;
  setSentence: (s: string) => void;
  addSelection: (key: string) => void;
}

const defaultState: GameState = {
  sentence: '',
  counts: {},
  reset: () => {},
  setSentence: () => {},
  addSelection: () => {}
};

const GameContext = createContext<GameState>(defaultState);

export function GameProvider({ children }: { children: ReactNode }) {
  const [sentence, _setSentence] = useState('');
  const [counts, _setCounts] = useState<Record<string, number>>({});

  const setSentence = (s: string) => {
    _setSentence(s);
  };

  const addSelection = (key: string) => {
    _setCounts(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const reset = () => {
    _setSentence('');
    _setCounts({});
  };

  return (
    <GameContext.Provider value={{ sentence, counts, reset, setSentence, addSelection }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
