import { Schedule, ScheduleExecution, SchedulePayload } from './schedule-types';
import { addInterval, createId, resolveNextRun } from './schedule-utils';

const schedules: Schedule[] = [];
const executions: ScheduleExecution[] = [];

export function listSchedules() {
  return schedules;
}

export function listExecutions(scheduleId?: string) {
  if (!scheduleId) {
    return executions;
  }
  return executions.filter((execution) => execution.scheduleId === scheduleId);
}

export function addSchedule(payload: SchedulePayload) {
  const now = new Date();
  const runAt = new Date(payload.runAt);
  const nextRunAt = resolveNextRun(runAt, payload.frequency, now);

  const schedule: Schedule = {
    id: createId(),
    userId: 'demo-user',
    title: payload.title,
    scope: payload.scope,
    platform: payload.platform,
    promptTemplate: payload.promptTemplate,
    frequency: payload.frequency,
    runAt: payload.runAt,
    nextRunAt: nextRunAt.toISOString(),
    status: 'active',
  };

  schedules.unshift(schedule);
  return schedule;
}

export function updateScheduleRun(scheduleId: string, executedAt: Date) {
  const schedule = schedules.find((item) => item.id === scheduleId);
  if (!schedule) {
    return;
  }
  schedule.lastRunAt = executedAt.toISOString();
  schedule.nextRunAt = addInterval(executedAt, schedule.frequency).toISOString();
}

export function addExecution(execution: ScheduleExecution) {
  executions.unshift(execution);
}
