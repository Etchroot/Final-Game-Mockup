import Link from 'next/link';

export default function StartScreen() {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-extrabold mb-4">마녀의 향수 공방</h1>
      <p className="mb-6">문장으로 향을 만들어보세요.</p>
      <Link href="/game">
        <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
          시작하기
        </button>
      </Link>
    </div>
  );
}
