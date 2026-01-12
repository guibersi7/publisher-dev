'use client';

import { useEffect, useState } from 'react';

type ApiKeySummary = {
  hasKey: boolean;
  last4?: string;
  updatedAt?: string;
};

type StatusState = {
  type: 'idle' | 'success' | 'error';
  message: string;
};

const defaultStatus: StatusState = { type: 'idle', message: '' };

const formatDate = (value?: string) => {
  if (!value) return '';
  return new Date(value).toLocaleString('pt-BR');
};

export default function ApiKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const [summary, setSummary] = useState<ApiKeySummary>({ hasKey: false });
  const [status, setStatus] = useState<StatusState>(defaultStatus);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  const fetchSummary = async () => {
    const response = await fetch('/api/user-key');
    const data = (await response.json()) as ApiKeySummary;
    setSummary(data);
  };

  useEffect(() => {
    fetchSummary().catch(() => {
      setStatus({
        type: 'error',
        message: 'Não foi possível carregar o status da API-key.',
      });
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setStatus(defaultStatus);

    try {
      const response = await fetch('/api/user-key', {
        method: summary.hasKey ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus({ type: 'error', message: data.error ?? 'Erro ao salvar.' });
        return;
      }

      setApiKey('');
      setSummary({
        hasKey: true,
        last4: data.last4,
        updatedAt: data.updatedAt,
      });
      setStatus({ type: 'success', message: data.message });
    } catch {
      setStatus({ type: 'error', message: 'Erro de rede ao salvar.' });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setStatus(defaultStatus);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Teste de autenticação' }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: 'error', message: data.error ?? 'Falha no teste.' });
        return;
      }

      setStatus({
        type: 'success',
        message: 'API-key validada com sucesso no provedor.',
      });
    } catch {
      setStatus({ type: 'error', message: 'Erro de rede ao testar.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="grid gap-6 rounded-3xl border border-brand-100 bg-surface-50 p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Configurações de IA</h2>
        <p className="text-text-secondary">
          Informe sua API-key para que as chamadas ao provedor de IA usem as credenciais do
          seu usuário. A chave é armazenada no backend com criptografia e nunca fica em
          localStorage.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-brand-100 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-text-secondary">
          <span>
            Status:{' '}
            {summary.hasKey
              ? `Configurada • termina em ${summary.last4}`
              : 'Nenhuma API-key salva'}
          </span>
          {summary.updatedAt && (
            <span>Atualizada em {formatDate(summary.updatedAt)}</span>
          )}
        </div>
        <label className="grid gap-2 text-sm font-medium text-text-primary">
          Nova API-key
          <input
            className="rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-text-primary shadow-sm outline-none transition focus:border-brand-300"
            type="password"
            placeholder="Cole sua chave (ex.: sk-...)"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={handleSave}
            disabled={loading || !apiKey}
          >
            {loading ? 'Salvando...' : summary.hasKey ? 'Atualizar chave' : 'Salvar chave'}
          </button>
          <button
            className="rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? 'Testando...' : 'Testar conexão'}
          </button>
        </div>
        {status.message && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {status.message}
          </div>
        )}
        <p className="text-xs text-text-secondary">
          Mensagens comuns: API-key inválida, ausente ou expirada. Ajuste a chave e salve
          novamente.
        </p>
      </div>
    </div>
  );
}
