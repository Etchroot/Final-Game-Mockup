export interface Scent {
  key: string;
  name: string;
  color: string;
  icon: string;
}

const scents: Scent[] = [
  { key: 'lavender', name: '라벤더', color: 'bg-purple-300', icon: '/images/scents/lavender.png' },
  { key: 'lemon', name: '레몬', color: 'bg-yellow-300', icon: '/images/scents/lemon.png' },
  { key: 'vanilla', name: '바닐라', color: 'bg-yellow-100', icon: '/images/scents/vanilla.png' },
  { key: 'pine', name: '소나무', color: 'bg-green-500', icon: '/images/scents/pine.png' },
  { key: 'rose', name: '장미', color: 'bg-pink-400', icon: '/images/scents/rose.png' },
  { key: 'orange', name: '오렌지', color: 'bg-orange-400', icon: '/images/scents/orange.png' },
  { key: 'sandalwood', name: '샌달우드', color: 'bg-amber-200', icon: '/images/scents/sandalwood.png' },
  { key: 'musk', name: '머스크', color: 'bg-violet-700', icon: '/images/scents/musk.png' },
  { key: 'cotton', name: '코튼', color: 'bg-blue-200', icon: '/images/scents/cotton.png' },
  { key: 'petrichor', name: '페트리코르', color: 'bg-gray-400', icon: '/images/scents/petrichor.png' }
];

export default scents;