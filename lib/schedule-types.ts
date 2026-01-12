export type ScheduleScope = 'content' | 'linkedin' | 'both';

export type ScheduleFrequency = 'once' | 'daily' | 'weekly' | 'monthly';

export type ScheduleStatus = 'active' | 'paused';

export type ScheduleExecutionStatus = 'success' | 'failed';

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  scope: ScheduleScope;
  platform: string;
  promptTemplate: string;
  frequency: ScheduleFrequency;
  runAt: string;
  nextRunAt: string;
  status: ScheduleStatus;
  lastRunAt?: string;
}

export interface ScheduleExecution {
  id: string;
  scheduleId: string;
  executedAt: string;
  status: ScheduleExecutionStatus;
  attempts: number;
  message: string;
}

export interface SchedulePayload {
  title: string;
  scope: ScheduleScope;
  platform: string;
  promptTemplate: string;
  frequency: ScheduleFrequency;
  runAt: string;
}
