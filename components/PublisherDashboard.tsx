'use client';

import { useMemo, useState } from 'react';

type TabKey = 'chat' | 'settings' | 'schedule' | 'services';

type TabItem = {
  id: TabKey;
  label: string;
  helper?: string;
};

const tabs: TabItem[] = [
  { id: 'chat', label: 'Pergunte', helper: 'Peça um post' },
  { id: 'settings', label: 'Settings', helper: 'Conta e API' },
  { id: 'schedule', label: 'Cronograma', helper: 'Cadências' },
  { id: 'services', label: 'Services', helper: 'Integrações' }
];

const chatMessages = [
  {
    id: 1,
    author: 'Você',
    message: 'Crie um post sobre cultura de feedback para LinkedIn.',
    time: '09:12'
  },
  {
    id: 2,
    author: 'Publisher IA',
    message:
      'Claro! Aqui vai uma sugestão: "Feedback é o combustível para equipes de alta performance. Quando líderes criam um ambiente seguro para trocas sinceras, o aprendizado vira rotina e a colaboração cresce."',
    time: '09:13'
  },
  {
    id: 3,
    author: 'Você',
    message: 'Inclua uma chamada para interação no final.',
    time: '09:14'
  },
  {
    id: 4,
    author: 'Publisher IA',
    message:
      'Finalizando com convite: "E na sua equipe, como vocês fortalecem a cultura de feedback?"',
    time: '09:15'
  }
];

const scheduleCards = [
  {
    title: 'Conteúdo Institucional',
    description: 'Publicações sobre cultura, vagas e conquistas internas.',
    cadence: 'Segundas e quintas · 9h'
  },
  {
    title: 'Educação & Dicas',
    description: 'Posts com insights e materiais educativos.',
    cadence: 'Quartas · 11h'
  },
  {
    title: 'Cases & Resultados',
    description: 'Histórias de sucesso e métricas de impacto.',
    cadence: 'Sextas · 15h'
  }
];

const services = [
  {
    title: 'LinkedIn',
    description: 'Publicação automática via API do LinkedIn.',
    status: 'Conectado'
  },
  {
    title: 'Notion',
    description: 'Sincronização de roteiros e briefs.',
    status: 'Pendente'
  },
  {
    title: 'Google Agenda',
    description: 'Disparo e alertas de cronograma.',
    status: 'Conectado'
  }
];

export default function PublisherDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('chat');
  const selectedTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTab),
    [activeTab]
  );

  return (
    <main className="min-h-screen bg-surface-0 text-text-primary">
      <div className="flex min-h-screen w-full overflow-hidden bg-surface-0">
        <aside className="flex w-full max-w-[280px] flex-col border-r border-slate-100 bg-surface-50">
          <div className="px-6 pb-4 pt-6">
            <h1 className="text-xl font-semibold">Publisher Studio</h1>
            <p className="mt-1 text-sm text-text-secondary">Automação de conteúdo</p>
          </div>

          <nav className="flex-1 px-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    className={`flex w-full items-start rounded-2xl border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-brand-100 bg-white shadow-sm'
                        : 'border-transparent hover:border-brand-100 hover:bg-white/70'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    aria-pressed={isActive}
                  >
                    <span>
                      <span className="block text-sm font-semibold">{tab.label}</span>
                      {tab.helper && (
                        <span className="block text-xs text-text-secondary">{tab.helper}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-brand-100" />
              <div>
                <p className="text-sm font-semibold">Alan Ferreira</p>
                <p className="text-xs text-text-secondary">alan@publisher.dev</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex flex-1 flex-col bg-white px-8 py-10">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">
                {selectedTab?.label}
              </p>
              <h2 className="text-3xl font-semibold">
                {activeTab === 'chat' && 'Peça um post para a IA'}
                {activeTab === 'settings' && 'Configurações da conta'}
                {activeTab === 'schedule' && 'Seu cronograma'}
                {activeTab === 'services' && 'Serviços conectados'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                {activeTab === 'chat' &&
                  'Acompanhe a conversa com a IA e mantenha histórico de mensagens.'}
                {activeTab === 'settings' &&
                  'Gerencie seus dados, preferências e chaves de integração.'}
                {activeTab === 'schedule' &&
                  'Defina cadências, horários e tipos de conteúdo que serão publicados.'}
                {activeTab === 'services' &&
                  'Configure integrações para publicação automática em canais parceiros.'}
              </p>
            </div>
            <span className="hidden rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 sm:inline-flex">
              Publisher IA
            </span>
          </header>

          {activeTab === 'chat' && (
            <div className="mt-10 flex flex-1 flex-col gap-6">
              <div className="flex flex-wrap gap-3">
                {[
                  'Engajamento',
                  'Liderança',
                  'Employer Branding',
                  'Cultura',
                  'People Analytics'
                ].map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-slate-200 bg-surface-50 px-4 py-2 text-xs font-semibold text-text-secondary"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-3xl border border-slate-100 bg-surface-50 p-6">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col gap-1 rounded-2xl px-4 py-3 ${
                      message.author === 'Você'
                        ? 'self-end bg-white shadow-sm'
                        : 'self-start bg-brand-50 text-text-primary'
                    }`}
                  >
                    <span className="text-xs font-semibold text-text-secondary">
                      {message.author}
                    </span>
                    <p className="text-sm">{message.message}</p>
                    <span className="text-[11px] text-text-secondary">{message.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <span className="text-sm text-text-secondary">
                  Insira sua mensagem aqui
                </span>
                <button
                  className="ml-auto rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white"
                  type="button"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6 rounded-3xl border border-slate-100 bg-surface-50 p-6">
                <div>
                  <h3 className="text-lg font-semibold">Dados do usuário</h3>
                  <p className="text-sm text-text-secondary">
                    Atualize nome, cargo e informações de contato.
                  </p>
                </div>
                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm font-semibold">
                    Nome completo
                    <input
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                      defaultValue="Alan Ferreira"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    E-mail corporativo
                    <input
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                      defaultValue="alan@publisher.dev"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    Cargo
                    <input
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                      defaultValue="Especialista em Conteúdo"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold">API Key</h3>
                  <p className="text-sm text-text-secondary">
                    Use a chave para integrar com serviços externos.
                  </p>
                </div>
                <label className="grid gap-2 text-sm font-semibold">
                  Chave ativa
                  <input
                    className="rounded-2xl border border-slate-200 bg-surface-50 px-4 py-2 text-sm"
                    defaultValue="pk_live_4f8c...a9d2"
                  />
                </label>
                <button
                  className="rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white"
                  type="button"
                >
                  Gerar nova chave
                </button>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="mt-10 space-y-6">
              <div className="grid gap-4 lg:grid-cols-3">
                {scheduleCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-3xl border border-slate-100 bg-surface-50 p-6"
                  >
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{card.description}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                      {card.cadence}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Criar novo cronograma</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Defina frequência, janela de publicação e template base.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="rounded-full border border-brand-100 px-4 py-2 text-xs font-semibold text-brand-700">
                    Semanal
                  </button>
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-text-secondary">
                    Quinzenal
                  </button>
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-text-secondary">
                    Mensal
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-3xl border border-slate-100 bg-surface-50 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <p className="mt-2 text-sm text-text-secondary">{service.description}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.status === 'Conectado'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <button
                    className="mt-6 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-text-secondary"
                    type="button"
                  >
                    Configurar serviço
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
