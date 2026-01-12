import PublisherStudio from '@/components/PublisherStudio';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">
          Fluxo completo Publisher
        </p>
        <h1 className="text-4xl font-semibold text-text-primary sm:text-5xl">
          Planeje, gere e publique com validação integrada
        </h1>
        <p className="max-w-2xl text-base text-text-secondary">
          Gere conteúdo com base em prompt, aplique templates por plataforma e acompanhe o
          feedback de publicação em tempo real.
        </p>
      </section>

      <PublisherStudio />
    </main>
  );
}
