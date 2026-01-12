import ScheduleManager from '@/components/ScheduleManager';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16">
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
    </main>
  );
}
