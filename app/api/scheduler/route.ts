import { NextResponse } from 'next/server';

import { runDueSchedules } from '@/lib/scheduler';

export async function POST() {
  const results = await runDueSchedules();
  return NextResponse.json({ results });
}
