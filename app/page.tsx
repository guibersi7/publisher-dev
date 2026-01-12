import ClientCounter from '@/components/ClientCounter';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">
          Next.js + App Router
        </p>
        <h1 className="text-4xl font-semibold text-text-primary sm:text-5xl">
          Base pronta para evoluir o Publisher
        </h1>
        <p className="max-w-2xl text-base text-text-secondary">
          Estrutura inicial com Tailwind, TypeScript, aliases e padrões de componentes para
          começar rápido.
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
    </main>
  );
}
