import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publisher Dev",
  description: "Crie posts profissionais com IA e automação."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-surface text-slate-100">
        {children}
      </body>
    </html>
  );
}
