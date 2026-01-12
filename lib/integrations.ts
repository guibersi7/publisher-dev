import { Schedule } from './schedule-types';

export async function createPostFromSchedule(schedule: Schedule) {
  return {
    id: `post-${schedule.id}`,
    content: `Post gerado a partir do template: ${schedule.promptTemplate}`,
  };
}

export async function publishToLinkedIn(schedule: Schedule, content: string) {
  return {
    id: `linkedin-${schedule.id}`,
    status: 'published',
    message: `Publicado para ${schedule.platform}: ${content}`,
  };
}
