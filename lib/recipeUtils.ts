import { Scent } from '../data/scents';

export function calculateRecipe(counts: Record<string, number>): { key: string; percent: number }[] {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const arr = Object.entries(counts).map(([key, count]) => ({ key, percent: Math.round((count / total) * 100) }));
  return arr;
}

export function generateName(sentence: string, recipe: { key: string; percent: number }[]): string {
  if (recipe.length === 0) return '무명의 향수';
  const top = recipe.sort((a, b) => b.percent - a.percent)[0];
  const mapping: Record<string, string> = {
    lavender: 'Lavender',
    lemon: 'Lemon',
    vanilla: 'Vanilla',
    pine: 'Forest',
    rose: 'Rose',
    orange: 'Orange',
    sandalwood: 'Sandal',
    musk: 'Mystic',
    cotton: 'Cotton',
    petrichor: 'Rain'
  };
  const base = mapping[top.key] || top.key;
  // simple name; could incorporate sentence keywords
  return `${base} ${sentence.split(' ')[0]}`;
}

export function generateDescription(sentence: string, recipe: { key: string; percent: number }[]): string {
  if (recipe.length === 0) return '';
  const keys = recipe
    .sort((a, b) => b.percent - a.percent)
    .map(r => r.key)
    .slice(0, 2);
  return `이 향수는 ${keys.join('과')}의 조화로 이루어져 있으며, ${sentence}의 분위기를 담고 있습니다.`;
}
