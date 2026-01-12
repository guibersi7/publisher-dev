'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Schedule,
  ScheduleExecution,
  ScheduleFrequency,
  SchedulePayload,
  ScheduleScope,
} from '@/lib/schedule-types';
import { formatScheduleScope } from '@/lib/schedule-utils';

const frequencyOptions: { value: ScheduleFrequency; label: string }[] = [
  { value: 'once', label: 'Uma vez' },
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
];

const scopeOptions: { value: ScheduleScope; label: string }[] = [
  { value: 'content', label: 'Geração de conteúdo' },
  { value: 'linkedin', label: 'Postagem no LinkedIn' },
  { value: 'both', label: 'Geração + postagem' },
];

const platforms = ['LinkedIn', 'LinkedIn Page', 'LinkedIn Grupo'];

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [executions, setExecutions] = useState<ScheduleExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SchedulePayload>(() => ({
    title: 'Campanha de conteúdo semanal',
    scope: 'both',
    platform: platforms[0],
    promptTemplate: 'Compartilhe 3 aprendizados sobre marketing B2B',
    frequency: 'weekly',
    runAt: toDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000)),
  }));

  const scheduleExecutions = useMemo(() => {
    return new Map(
      executions.map((execution) => [execution.scheduleId, execution])
    );
  }, [executions]);

  async function loadSchedules() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/schedules');
      if (!response.ok) {
        throw new Error('Não foi possível carregar os cronogramas.');
      }
      const data = await response.json();
      setSchedules(data.schedules ?? []);
      setExecutions(data.executions ?? []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro inesperado ao carregar os cronogramas.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Não foi possível salvar o cronograma.');
      }

      await loadSchedules();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro inesperado ao salvar o cronograma.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRunScheduler() {
    setRunning(true);
    setError(null);
    try {
      const response = await fetch('/api/scheduler', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Não foi possível executar o scheduler.');
      }
      await loadSchedules();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro inesperado ao executar o scheduler.');
      }
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-3xl border border-brand-100 bg-surface-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Novo cronograma</h2>
            <p className="text-sm text-text-secondary">
              Defina escopo, frequência e template do prompt para automatizar conteúdo.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition hover:border-brand-400 hover:text-brand-800"
            onClick={handleRunScheduler}
            disabled={running}
          >
            {running ? 'Executando...' : 'Rodar scheduler agora'}
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-text-primary">
              Nome do cronograma
              <input
                value={formData.title}
                onChange={(event) =>
                  setFormData({ ...formData, title: event.target.value })
                }
                className="rounded-2xl border border-brand-100 bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
                placeholder="Ex.: Série de insights semanais"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-text-primary">
              Data e hora da primeira execução
              <input
                type="datetime-local"
                value={formData.runAt}
                onChange={(event) =>
                  setFormData({ ...formData, runAt: event.target.value })
                }
                className="rounded-2xl border border-brand-100 bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium text-text-primary">
              Escopo
              <select
                value={formData.scope}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    scope: event.target.value as ScheduleScope,
                  })
                }
                className="rounded-2xl border border-brand-100 bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              >
                {scopeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-text-primary">
              Frequência
              <select
                value={formData.frequency}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    frequency: event.target.value as ScheduleFrequency,
                  })
                }
                className="rounded-2xl border border-brand-100 bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              >
                {frequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-text-primary">
              Plataforma
              <select
                value={formData.platform}
                onChange={(event) =>
                  setFormData({ ...formData, platform: event.target.value })
                }
                className="rounded-2xl border border-brand-100 bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-text-primary">
            Template do prompt
            <textarea
              value={formData.promptTemplate}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  promptTemplate: event.target.value,
                })
              }
              className="min-h-[120px] rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              placeholder="Descreva o formato do conteúdo, tom de voz e objetivos."
              required
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar cronograma'}
            </button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        </form>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Cronogramas ativos</h2>
            <p className="text-sm text-text-secondary">
              Acompanhe o próximo disparo, integração e resultado das execuções.
            </p>
          </div>
          <button
            type="button"
            onClick={loadSchedules}
            className="rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition hover:border-brand-400"
          >
            Atualizar lista
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-text-secondary">Carregando cronogramas...</p>
        ) : schedules.length === 0 ? (
          <p className="text-sm text-text-secondary">
            Ainda não há cronogramas cadastrados.
          </p>
        ) : (
          <div className="grid gap-4">
            {schedules.map((schedule) => {
              const lastExecution = scheduleExecutions.get(schedule.id);
              return (
                <article
                  key={schedule.id}
                  className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {schedule.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {formatScheduleScope(schedule.scope)} · {schedule.platform}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {schedule.status === 'active' ? 'Ativo' : 'Pausado'}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-text-secondary md:grid-cols-3">
                    <div>
                      <p className="font-medium text-text-primary">Frequência</p>
                      <p>{schedule.frequency}</p>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Próxima execução</p>
                      <p>{formatDate(schedule.nextRunAt)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Última execução</p>
                      <p>{schedule.lastRunAt ? formatDate(schedule.lastRunAt) : '—'}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-surface-50 px-4 py-3 text-sm text-text-secondary">
                    <p className="font-medium text-text-primary">Template do prompt</p>
                    <p>{schedule.promptTemplate}</p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-brand-100 bg-surface-50 px-4 py-3 text-sm">
                    <p className="font-medium text-text-primary">Último status</p>
                    {lastExecution ? (
                      <div className="mt-2 grid gap-1 text-text-secondary">
                        <p>
                          {lastExecution.status === 'success'
                            ? 'Sucesso'
                            : 'Falha'}{' '}
                          · Tentativas: {lastExecution.attempts}
                        </p>
                        <p>{lastExecution.message}</p>
                      </div>
                    ) : (
                      <p className="text-text-secondary">Nenhuma execução registrada.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
