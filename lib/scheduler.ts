import {
  Schedule,
  ScheduleExecution,
  ScheduleExecutionStatus,
} from './schedule-types';
import { createPostFromSchedule, publishToLinkedIn } from './integrations';
import { addExecution, listSchedules, updateScheduleRun } from './schedules-store';
import { createId } from './schedule-utils';

function shouldRun(schedule: Schedule, now: Date) {
  return schedule.status === 'active' && new Date(schedule.nextRunAt).getTime() <= now.getTime();
}

export async function runDueSchedules() {
  const now = new Date();
  const schedules = listSchedules().filter((schedule) => shouldRun(schedule, now));
  const results: ScheduleExecution[] = [];

  for (const schedule of schedules) {
    const execution = await runSchedule(schedule, now);
    results.push(execution);
    addExecution(execution);
    updateScheduleRun(schedule.id, now);
  }

  return results;
}

async function runSchedule(schedule: Schedule, executedAt: Date) {
  let status: ScheduleExecutionStatus = 'success';
  let message = 'Execução concluída.';

  if (schedule.scope === 'content' || schedule.scope === 'both') {
    const post = await createPostFromSchedule(schedule);
    message = `Conteúdo gerado: ${post.content}`;
  }

  if (schedule.scope === 'linkedin' || schedule.scope === 'both') {
    const post = await createPostFromSchedule(schedule);
    const published = await publishToLinkedIn(schedule, post.content);
    message = published.message;
  }

  if (schedule.scope === 'content') {
    message = 'Conteúdo gerado com sucesso.';
  }

  return {
    id: createId(),
    scheduleId: schedule.id,
    executedAt: executedAt.toISOString(),
    status,
    attempts: 1,
    message,
  };
}
