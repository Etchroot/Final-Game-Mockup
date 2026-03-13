import Image from 'next/image';
import Link from 'next/link';

export default function StartScreen() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/images/background/main_background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,11,26,0.28)_0%,rgba(13,7,16,0.78)_100%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="max-w-xl rounded-[2rem] border-[3px] border-[#f0d4a2] bg-[#221523]/74 px-8 py-10 text-center shadow-[0_26px_60px_rgba(8,4,12,0.4)] backdrop-blur-md">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.45em] text-[#f6dca8]">
            witch atelier
          </p>
          <h1 className="text-4xl font-black leading-tight text-[#fff3dc] sm:text-5xl">
            마녀 공방 향수 제조실
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#f6e3c0] sm:text-base">
            오늘의 문장에 어울리는 향료를 10번 골라, 동화 같은 공방에서
            나만의 향수를 완성해 보세요.
          </p>

          <Link
            href="/game"
            className="mt-8 inline-flex rounded-full border border-[#ffe2a0] bg-[linear-gradient(180deg,#ffdc8b_0%,#f2a24c_100%)] px-8 py-3 text-sm font-black tracking-[0.2em] text-[#4a291b] shadow-[0_18px_28px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:shadow-[0_22px_34px_rgba(0,0,0,0.34)]"
          >
            제조 시작
          </Link>
        </div>
      </div>
    </div>
  );
}
