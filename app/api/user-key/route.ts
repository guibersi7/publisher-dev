import { NextResponse } from 'next/server';

import {
  getUserApiKeySummary,
  saveUserApiKey,
  validateApiKey,
} from '@/lib/userApiKeyStore';

const getUserId = (request: Request) => {
  return request.headers.get('x-user-id') ?? 'demo-user';
};

export async function GET(request: Request) {
  const userId = getUserId(request);
  const summary = getUserApiKeySummary(userId);

  return NextResponse.json({
    hasKey: Boolean(summary),
    ...summary,
  });
}

export async function POST(request: Request) {
  const userId = getUserId(request);
  const body = await request.json();
  const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';
  const validationError = validateApiKey(apiKey);

  if (validationError) {
    return NextResponse.json(
      { error: validationError, code: 'invalid_key' },
      { status: 400 },
    );
  }

  const summary = saveUserApiKey(userId, apiKey);
  return NextResponse.json({
    message: 'API-key salva com sucesso.',
    ...summary,
  });
}

export async function PUT(request: Request) {
  return POST(request);
}
