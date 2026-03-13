export interface Scent {
  key: string;
  name: string;
  color: string;
}

const scents: Scent[] = [
  { key: 'lavender', name: '라벤더', color: 'bg-purple-300' },
  { key: 'lemon', name: '레몬', color: 'bg-yellow-300' },
  { key: 'vanilla', name: '바닐라', color: 'bg-yellow-100' },
  { key: 'pine', name: '소나무', color: 'bg-green-500' },
  { key: 'rose', name: '장미', color: 'bg-pink-400' },
  { key: 'orange', name: '오렌지', color: 'bg-orange-400' },
  { key: 'sandalwood', name: '샌달우드', color: 'bg-amber-200' },
  { key: 'musk', name: '머스크', color: 'bg-violet-700' },
  { key: 'cotton', name: '코튼', color: 'bg-blue-200' },
  { key: 'petrichor', name: '페트리코르', color: 'bg-gray-400' }
];

export default scents;