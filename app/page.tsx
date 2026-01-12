import ScheduleManager from '@/components/ScheduleManager';
import ApiKeyManager from '@/components/ApiKeyManager';
import ClientCounter from '@/components/ClientCounter';
import PublisherStudio from '@/components/PublisherStudio';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">
          Publisher · Automação de cronogramas
        </p>
        <h1 className="text-4xl font-semibold text-text-primary sm:text-5xl">
          Cronograma inteligente para conteúdo e LinkedIn
        </h1>
        <p className="max-w-2xl text-base text-text-secondary">
          Defina a frequência, o escopo e o template do prompt para automatizar a criação
          e a publicação de conteúdo.
        </p>
      </section>

      <ScheduleManager />
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

      <section className="grid gap-6 rounded-3xl border border-brand-100 bg-surface-50 p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Padrão client component</h2>
          <p className="text-text-secondary">
            Componentes client ficam explícitos com a diretiva <code>'use client'</code>.
          </p>
        </div>
        <ClientCounter />
      </section>

      <ApiKeyManager />
      <PublisherStudio />
    </main>
  );
}
