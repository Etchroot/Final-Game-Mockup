import '../styles/globals.css';
import { ReactNode } from 'react';
import { GameProvider } from '../components/GameContext';

export const metadata = {
  title: '마녀 공방 향수 제조실',
  description: '문장에 어울리는 향료를 골라 나만의 향수를 만드는 게임'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen overflow-x-hidden bg-[#120b16] text-[#fff5de]">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
