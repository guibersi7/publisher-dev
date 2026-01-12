'use client';

import { useMemo, useState } from 'react';

import type { PlatformKey } from '@/lib/templates';
import { templateList } from '@/lib/templates';

const defaultPlatform: PlatformKey = 'linkedin';

type GenerationPayload = {
  content: string;
  validation: {
    isValid: boolean;
    issues: string[];
  };
  template: {
    label: string;
    description: string;
    maxLength: number;
  };
};

type PublishLog = {
  id: string;
  status: string;
  publishedAt: string;
  platform: PlatformKey;
};

export default function PublisherStudio() {
  const [platform, setPlatform] = useState<PlatformKey>(defaultPlatform);
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [validation, setValidation] = useState<GenerationPayload['validation'] | null>(null);
  const [template, setTemplate] = useState<GenerationPayload['template'] | null>(null);
  const [logs, setLogs] = useState<PublishLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTemplate = useMemo(
    () => templateList.find((item) => item.platform === platform),
    [platform],
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Descreva o tema antes de gerar o post.');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform }),
      });

      const data = (await response.json()) as GenerationPayload;

      if (!response.ok) {
        setError('Não foi possível gerar o conteúdo.');
        return;
      }

      setContent(data.content);
      setValidation(data.validation);
      setTemplate(data.template);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      setError('Inclua o conteúdo antes de publicar.');
      return;
    }

    setError(null);
    setIsPublishing(true);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform }),
      });

      const data = (await response.json()) as PublishLog & {
        validation?: GenerationPayload['validation'];
      };

      if (!response.ok) {
        setValidation(data.validation ?? null);
        setError(data.error ?? 'Falha ao publicar.');
        return;
      }

      setLogs((prev) => [data, ...prev]);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <section className="grid gap-8 rounded-3xl border border-brand-100 bg-surface-50 p-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Studio</p>
        <h2 className="text-2xl font-semibold text-text-primary">
          Gere, valide e publique conteúdos em um fluxo único
        </h2>
        <p className="text-text-secondary">
          Selecione a plataforma, descreva o tema e acompanhe o feedback da publicação.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-primary" htmlFor="platform">
              Plataforma
            </label>
            <select
              id="platform"
              className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
              value={platform}
              onChange={(event) => setPlatform(event.target.value as PlatformKey)}
            >
              {templateList.map((item) => (
                <option key={item.platform} value={item.platform}>
                  {item.label}
                </option>
              ))}
            </select>
            {selectedTemplate && (
              <p className="text-xs text-text-secondary">{selectedTemplate.description}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-primary" htmlFor="prompt">
              Prompt base
            </label>
            <textarea
              id="prompt"
              className="min-h-[120px] w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
              placeholder="Ex: Estratégias de lançamento para SaaS B2B"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <button
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-70"
              onClick={handleGenerate}
              disabled={isGenerating}
              type="button"
            >
              {isGenerating ? 'Gerando...' : 'Gerar conteúdo'}
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-primary" htmlFor="content">
              Prévia editável
            </label>
            <textarea
              id="content"
              className="min-h-[200px] w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
              placeholder="Conteúdo aparecerá aqui após gerar."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            {template && (
              <p className="text-xs text-text-secondary">
                Limite da plataforma: {template.maxLength} caracteres.
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-70"
              onClick={handlePublish}
              disabled={isPublishing}
              type="button"
            >
              {isPublishing ? 'Publicando...' : 'Publicar agora'}
            </button>
            <div className="flex flex-col justify-center text-xs text-text-secondary">
              <span>Prévia e validação obrigatórias antes de publicar.</span>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl border border-brand-100 bg-white p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-text-primary">Validação & Preview</h3>
            <p className="text-xs text-text-secondary">
              Confira as regras da plataforma antes de confirmar a publicação.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-brand-100 bg-surface-50 p-4">
            <p className="text-xs font-semibold text-text-primary">Resumo de validação</p>
            {validation ? (
              <ul className="list-disc space-y-1 pl-4 text-xs text-text-secondary">
                {validation.issues.length === 0 && (
                  <li>Conteúdo pronto para publicação.</li>
                )}
                {validation.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-secondary">Gere um conteúdo para validar.</p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">Logs de publicação</h4>
            {logs.length === 0 ? (
              <p className="text-xs text-text-secondary">Nenhuma publicação ainda.</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-brand-100 bg-surface-50 px-4 py-3 text-xs text-text-secondary"
                  >
                    <p className="text-sm font-semibold text-text-primary">
                      {log.platform.toUpperCase()} · {log.status}
                    </p>
                    <p>ID: {log.id}</p>
                    <p>Publicado em: {new Date(log.publishedAt).toLocaleString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
