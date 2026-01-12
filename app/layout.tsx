import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Publisher Dev',
  description: 'Base Next.js App Router scaffold.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-surface-0 text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
