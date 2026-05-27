import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from '@/components/provider';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.quipier.com'),
  title: { default: 'Quipier Docs', template: '%s · Quipier' },
  description: 'Quipier — 임베드 댓글 위젯 문서 + SDK 플레이그라운드.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
