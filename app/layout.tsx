import '../styles/globals.css';
import { ReactNode } from 'react';
import { GameProvider } from '../components/GameContext';

export const metadata = {
  title: '마녀의 향수 공방',
  description: '문장으로 향을 빚는 웹 미니게임'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-50">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
