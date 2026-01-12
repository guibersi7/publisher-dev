import { ScheduleFrequency } from './schedule-types';

const DAY = 24 * 60 * 60 * 1000;

export function createId() {
  return crypto.randomUUID();
}

export function addInterval(date: Date, frequency: ScheduleFrequency) {
  switch (frequency) {
    case 'daily':
      return new Date(date.getTime() + DAY);
    case 'weekly':
      return new Date(date.getTime() + DAY * 7);
    case 'monthly': {
      const next = new Date(date);
      next.setMonth(next.getMonth() + 1);
      return next;
    }
    default:
      return date;
  }
}

export function resolveNextRun(runAt: Date, frequency: ScheduleFrequency, now: Date) {
  if (frequency === 'once') {
    return runAt;
  }
  let next = runAt;
  while (next.getTime() < now.getTime()) {
    next = addInterval(next, frequency);
  }
  return next;
}

export function formatScheduleScope(scope: string) {
  switch (scope) {
    case 'content':
      return 'Somente geração de conteúdo';
    case 'linkedin':
      return 'Somente postagem no LinkedIn';
    case 'both':
      return 'Geração + postagem no LinkedIn';
    default:
      return scope;
  }
}
