'use client';

import { useEffect, useMemo, useState } from 'react';

type TabKey = 'chat' | 'settings' | 'schedule' | 'services';

type TabItem = {
  id: TabKey;
  label: string;
};

const tabs: TabItem[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'schedule', label: 'Cronograma' },
  { id: 'services', label: 'Services' },
  { id: 'settings', label: 'Settings' }
];

const quickActions = ['Deep Search', 'Reason'];

export default function PublisherDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('chat');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.label ?? 'Chat',
    [activeTab]
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const handleAvatarClick = () => {
    setActiveTab('settings');
  };

  return (
    <main className="min-h-screen bg-surface-0 text-text-primary">
      <div className="flex min-h-screen w-full">
        <aside
          className={`flex flex-col border-r border-surface-100 bg-surface-50 px-3 py-6 transition-all ${
            isSidebarOpen ? 'w-56' : 'w-16'
          }`}
        >
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-surface-100 bg-surface-0 text-sm font-semibold text-text-primary"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            type="button"
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? '‹' : '›'}
          </button>

          <nav className="mt-6 flex flex-1 flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'bg-surface-0 text-text-primary shadow-sm'
                      : 'text-text-secondary hover:bg-surface-0/70'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  aria-pressed={isActive}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-surface-100 bg-surface-0 text-xs">
                    {tab.label.slice(0, 1)}
                  </span>
                  {isSidebarOpen && <span>{tab.label}</span>}
                </button>
              );
            })}
          </nav>

          <button
            className="flex items-center justify-between rounded-2xl border border-surface-100 bg-surface-0 px-3 py-2 text-xs font-semibold text-text-secondary"
            onClick={() => setIsDarkMode((prev) => !prev)}
            type="button"
            aria-pressed={isDarkMode}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-surface-100 bg-surface-50 text-[11px]">
              {isDarkMode ? '🌙' : '☀️'}
            </span>
            {isSidebarOpen && (
              <span className="ml-2 flex-1 text-left">
                Dark mode {isDarkMode ? 'on' : 'off'}
              </span>
            )}
          </button>
        </aside>

        <section className="relative flex flex-1 flex-col px-10 py-8">
          <header className="flex items-center justify-end gap-3">
            <button
              className="rounded-full bg-text-primary px-4 py-2 text-xs font-semibold text-surface-0"
              type="button"
            >
              Get Pro
            </button>
            <button
              className="h-9 w-9 rounded-full bg-gradient-to-br from-surface-100 to-surface-50"
              type="button"
              aria-label="Abrir settings"
              onClick={handleAvatarClick}
            />
          </header>

          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">
              {selectedTab}
            </p>
            <h1 className="mt-3 text-4xl font-semibold">What can I help with?</h1>

            {activeTab === 'chat' && (
              <div className="mt-10 w-full max-w-3xl rounded-[28px] border border-surface-100 bg-surface-50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <div className="rounded-[24px] border border-surface-100 bg-surface-0 px-6 py-5">
                  <p className="text-sm text-text-secondary">Ask anything</p>

                  <div className="mt-8 flex flex-wrap items-center gap-2">
                    <button className="rounded-full border border-surface-100 px-3 py-1 text-xs text-text-secondary">
                      📎
                    </button>
                    {quickActions.map((action) => (
                      <button
                        key={action}
                        className="rounded-full border border-surface-100 px-4 py-1 text-xs font-semibold text-text-secondary"
                      >
                        {action}
                      </button>
                    ))}
                    <button className="rounded-full border border-surface-100 px-3 py-1 text-xs text-text-secondary">
                      ...
                    </button>
                    <button className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-text-primary text-surface-0">
                      ↑
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="mt-10 w-full max-w-3xl rounded-[28px] border border-surface-100 bg-surface-50 p-6">
                <h2 className="text-xl font-semibold">Settings do usuário</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Atualize dados e sua API key.
                </p>
                <div className="mt-6 grid gap-4">
                  <label className="grid gap-2 text-sm font-semibold">
                    Nome completo
                    <input
                      className="rounded-2xl border border-surface-100 bg-surface-0 px-4 py-2 text-sm"
                      defaultValue="Alan Ferreira"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    API key
                    <input
                      className="rounded-2xl border border-surface-100 bg-surface-0 px-4 py-2 text-sm"
                      defaultValue="pk_live_4f8c...a9d2"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="mt-10 w-full max-w-3xl rounded-[28px] border border-surface-100 bg-surface-50 p-6">
                <h2 className="text-xl font-semibold">Cronogramas</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Configure cadências e janelas de publicação.
                </p>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="mt-10 w-full max-w-3xl rounded-[28px] border border-surface-100 bg-surface-50 p-6">
                <h2 className="text-xl font-semibold">Services</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Configure integrações para posts automáticos.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
