import { NextResponse } from 'next/server';

import { addSchedule, listExecutions, listSchedules } from '@/lib/schedules-store';
import { SchedulePayload } from '@/lib/schedule-types';

export async function GET() {
  return NextResponse.json({
    schedules: listSchedules(),
    executions: listExecutions(),
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as SchedulePayload;
  const schedule = addSchedule(payload);

  return NextResponse.json({ schedule });
}
