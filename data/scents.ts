export interface Scent {
  key: string;
  name: string;
  note: string;
  icon: string;
  accent: string;
}

const scents: Scent[] = [
  {
    key: 'orange',
    name: '오렌지',
    note: '햇살 시트러스',
    icon: '/images/scents/orange.png',
    accent: '#f39a2f'
  },
  {
    key: 'sandalwood',
    name: '샌달우드',
    note: '따뜻한 나무결',
    icon: '/images/scents/sandalwood.png',
    accent: '#b17946'
  },
  {
    key: 'musk',
    name: '머스크',
    note: '부드러운 야성',
    icon: '/images/scents/musk.png',
    accent: '#c1a37b'
  },
  {
    key: 'cotton',
    name: '코튼',
    note: '보송한 구름결',
    icon: '/images/scents/cotton.png',
    accent: '#cfd7eb'
  },
  {
    key: 'petrichor',
    name: '비 내린 흙',
    note: '젖은 흙내음',
    icon: '/images/scents/petrichor.png',
    accent: '#7e90b6'
  },
  {
    key: 'lemon',
    name: '레몬',
    note: '반짝이는 산미',
    icon: '/images/scents/lemon.png',
    accent: '#f4c62d'
  },
  {
    key: 'lavender',
    name: '라벤더',
    note: '포근한 허브결',
    icon: '/images/scents/lavender.png',
    accent: '#b78df2'
  },
  {
    key: 'rose',
    name: '로즈',
    note: '붉은 꽃잎',
    icon: '/images/scents/rose.png',
    accent: '#d95a71'
  },
  {
    key: 'vanilla',
    name: '바닐라',
    note: '달콤한 크림향',
    icon: '/images/scents/vanilla.png',
    accent: '#f1d7a2'
  },
  {
    key: 'pine',
    name: '솔잎',
    note: '서늘한 숲기운',
    icon: '/images/scents/pine-tree.png',
    accent: '#49946b'
  }
];

export default scents;
