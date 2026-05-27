import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex items-center gap-2 text-sm text-fd-muted-foreground">
        <span className="rounded-full border px-2.5 py-0.5 font-semibold text-fd-primary">
          beta
        </span>
        wallet-based comments
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Quipier</h1>
      <p className="max-w-xl leading-relaxed text-fd-muted-foreground">
        어떤 웹사이트에든 붙이는 임베드 댓글 위젯. 끝 사용자는 로그인 없이
        패스포트(익명 신원)로 댓글을 답니다.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/docs"
          className="rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground"
        >
          문서 보기
        </Link>
        <Link href="/example" className="rounded-lg border px-5 py-2.5 font-medium">
          플레이그라운드
        </Link>
      </div>
    </main>
  );
}
